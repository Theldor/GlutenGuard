export interface AnalyzedMenuItem {
  id: number;
  name: string;
  price: string | null;
  desc: string;
  tag: "Low Risk" | "Ask First" | "High Risk";
  ask: string | null;
}

export interface AnalysisResult {
  restaurant: string;
  cuisine: string;
  banner: string;
  safe: AnalyzedMenuItem[];
  caution: AnalyzedMenuItem[];
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

  const prompt = `You are a celiac disease dietary assistant analyzing a restaurant menu for someone with celiac disease.

CRITICAL INSTRUCTION: You must extract and classify EVERY SINGLE menu item visible across all provided images. Do not summarize, do not group items, do not skip any item, do not stop early. If there are 40 items on the menu, all 40 must appear in your response.

Work through the menu systematically, section by section (appetizers, soups, salads, pasta, mains, sides, desserts, drinks, specials, etc.). Every item from every section must be included.
${note ? `\nAdditional context from the user: "${note}"\n` : ""}
Return ONLY valid JSON with this exact shape. No markdown fences, no explanation, no text before or after the JSON:
{
  "restaurant": "restaurant name if visible, otherwise 'Unknown Restaurant'",
  "cuisine": "cuisine type (one or two words)",
  "banner": "one sentence summarizing the overall gluten-free friendliness of this menu",
  "safe": [
    {
      "id": 1,
      "name": "exact dish name as written on menu",
      "price": "$XX" or null if not visible,
      "desc": "description from menu or brief note about ingredients",
      "tag": "Low Risk",
      "ask": null or "specific question to ask the server about this dish"
    }
  ],
  "caution": [
    {
      "id": 2,
      "name": "exact dish name as written on menu",
      "price": "$XX" or null if not visible,
      "desc": "description from menu or brief note about ingredients",
      "tag": "Ask First",
      "ask": "specific question or warning about this dish"
    }
  ]
}

Classification rules — apply to every item:
- "Low Risk" → tag: "Low Risk" → goes in safe[]. Naturally gluten-free ingredients (grilled meats, fish, rice, vegetables, salads with no croutons). Low cross-contamination risk.
- "Ask First" → tag: "Ask First" → goes in caution[]. Ambiguous ingredients, shared fryers, sauces that may contain flour, marinated items where marinade is unknown.
- "High Risk" → tag: "High Risk" → goes in caution[]. Definitively contains gluten: pasta, bread, breaded/fried in batter, pizza, sandwiches, wraps, items explicitly containing flour, soy sauce, malt.

Every menu item must appear in exactly one of safe[] or caution[]. No item may be omitted. IDs must be unique integers starting from 1.`;

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
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "OpenAI API error");
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};
