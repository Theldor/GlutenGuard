export interface AnalyzedMenuItem {
  id: number;
  name: string;
  price: string | null;
  desc: string;
  tag: "Low Risk" | "Ask First" | "High Risk";
  ask: string | null;
}

export interface MenuOrderEntry {
  type: "heading" | "item";
  text?: string;
  id?: number;
}

export interface AnalysisResult {
  restaurant: string;
  cuisine: string;
  banner: string;
  safe: AnalyzedMenuItem[];
  caution: AnalyzedMenuItem[];
  menuOrder?: MenuOrderEntry[];
}

export const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.readAsDataURL(file);
  });

export interface ProfileContext {
  condition: string[];
  customBlockedIngredients: string[];
  additionalRestrictions: string[];
  symptomatic: number;
  crossContamination: number;
  otherDietaryPreferences: string;
}

function buildAnalysisPrompt(note: string, profile?: ProfileContext): string {
  const hasCondition = !!profile?.condition && profile.condition.length > 0;
  const blocked = profile?.customBlockedIngredients ?? [];
  const restrictions = profile?.additionalRestrictions ?? [];
  const otherPrefs = profile?.otherDietaryPreferences ?? "";

  const conditionLabel = hasCondition ? profile!.condition.join(", ") : "celiac disease";

  const crossContactStrictness = ["not specified", "not concerned", "avoid if possible", "pretty strict", "very strict"];
  const strictness =
    profile && profile.crossContamination >= 0
      ? crossContactStrictness[profile.crossContamination] ?? "not specified"
      : "not specified";

  let profileSection = `The user has: ${conditionLabel}.`;
  if (strictness !== "not specified")
    profileSection += ` Cross-contact strictness: ${strictness}.`;
  if (blocked.length > 0)
    profileSection += ` They also cannot eat: ${blocked.join(", ")}.`;
  if (restrictions.length > 0)
    profileSection += ` Additional restrictions: ${restrictions.join(", ")}.`;
  if (otherPrefs)
    profileSection += ` Other preferences: ${otherPrefs}.`;

  if (!hasCondition && blocked.length === 0 && restrictions.length === 0 && !otherPrefs) {
    profileSection =
      "The user has NOT specified any allergies, conditions, or dietary restrictions. Classify ALL items as Low Risk / safe unless the user's note says otherwise.";
  }

  return `You are a dietary safety assistant. Analyze this restaurant menu and classify every item based on the user's specific profile.

USER PROFILE:
${profileSection}
${note ? `\nExtra context from the user: "${note}"\n` : ""}
RULES:
1. Include every single item visible — food AND drinks. No section may be skipped.
2. Be concise per item: desc in 5 words or fewer, ask in 6 words or fewer.
3. Work section by section in menu order.
4. Classify each item as exactly one of: "Low Risk", "Ask First", or "High Risk" — relative to THIS USER'S conditions and blocked ingredients.
   - Low Risk: safe for this user given their specific conditions. Goes in safe[].
   - Ask First: ambiguous for this user — might contain a trigger ingredient, cross-contact risk, unknown preparation. Goes in caution[].
   - High Risk: definitively contains something this user must avoid. Goes in caution[].
   - If the user has no conditions or restrictions, classify everything as "Low Risk".
5. For every item:
   - desc: shortest possible ingredient list or menu description.
   - ask: Low Risk → null. Ask First → one specific question. High Risk → the trigger ingredient only.
6. IDs must be unique integers starting from 1.

SECTION HEADINGS:
- If the menu has visible section headings, include a "menuOrder" array that lists items in exact menu order with heading entries.
- If no section headings are visible, omit "menuOrder" entirely.

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "restaurant": "name from menu, or 'Unknown Restaurant'",
  "cuisine": "cuisine type in 1–2 words",
  "banner": "one sentence on how friendly this menu is for this user's specific needs",
  "safe": [
    { "id": 1, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "Low Risk", "ask": null }
  ],
  "caution": [
    { "id": 2, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "Ask First", "ask": "specific question for the server" },
    { "id": 3, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "High Risk", "ask": "specific trigger ingredient" }
  ],
  "menuOrder": [
    { "type": "heading", "text": "Appetizers" },
    { "type": "item", "id": 2 },
    { "type": "item", "id": 1 },
    { "type": "heading", "text": "Mains" },
    { "type": "item", "id": 3 }
  ]
}`;
}

export const analyzeMenuPhotos = async (
  photos: string[],
  note: string,
  profile?: ProfileContext,
): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const prompt = buildAnalysisPrompt(note, profile);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...photos.map((url) => ({
              type: "image_url",
              image_url: { url, detail: "high" },
            })),
          ],
        },
      ],
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "OpenAI API error");
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      "No menu detected. Make sure your photo shows a restaurant menu clearly and try again.",
    );
  }
};
