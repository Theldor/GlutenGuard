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

export const analyzeMenuPhotos = async (
  photos: string[],
  note: string
): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const prompt = `You are a celiac disease dietary assistant. Analyze this restaurant menu and classify every item for someone with celiac disease.
${note ? `\nExtra context from the user: "${note}"\n` : ""}
RULES:
1. Include every single item visible — food AND drinks. No section may be skipped, including Drinks, Beverages, and Cocktails.
2. Be concise per item: desc in 5 words or fewer, ask in 6 words or fewer. Brevity is required so all items fit.
3. Work section by section in menu order.
4. Classify each item as exactly one of: "Low Risk", "Ask First", or "High Risk".
   - Low Risk: naturally gluten-free (grilled meats, fish, rice, plain vegetables, most wines/spirits). Goes in safe[].
   - Ask First: ambiguous — unknown sauces, shared fryers, tap drinks with unknown mixers. Goes in caution[].
   - High Risk: definitively contains gluten — pasta, bread, pizza, sandwiches, wraps, breaded items, soy sauce, beer, malt beverages. Goes in caution[].
5. For every item:
   - desc: shortest possible ingredient list or menu description.
   - ask: Low Risk → null. Ask First → one specific question. High Risk → the gluten source only.
6. IDs must be unique integers starting from 1.

SECTION HEADINGS:
- If the menu has visible section headings (e.g. Appetizers, Salads, Mains), include a "menuOrder" array that lists items in the exact order they appear on the menu, with heading entries where headings appear.
- If no section headings are visible, omit "menuOrder" entirely.

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "restaurant": "name from menu, or 'Unknown Restaurant'",
  "cuisine": "cuisine type in 1–2 words",
  "banner": "one sentence on how gluten-free friendly this menu is overall",
  "safe": [
    { "id": 1, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "Low Risk", "ask": null }
  ],
  "caution": [
    { "id": 2, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "Ask First", "ask": "specific question for the server" },
    { "id": 3, "name": "exact name from menu", "price": "$XX or null", "desc": "description or key ingredients", "tag": "High Risk", "ask": "specific gluten source" }
  ],
  "menuOrder": [
    { "type": "heading", "text": "Appetizers" },
    { "type": "item", "id": 2 },
    { "type": "item", "id": 1 },
    { "type": "heading", "text": "Mains" },
    { "type": "item", "id": 3 }
  ]
}`;

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
