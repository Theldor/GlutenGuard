import type { UserProfile } from "../store";

const REASON_LABELS = [
  "Eating out safely",
  "Traveling with celiac",
  "Newly diagnosed",
  "Helping someone else",
];

const SYMPTOM_LABELS = ["Rarely", "Sometimes", "Always", "Severely"];

const CROSS_CONTACT_LABELS = [
  "I'd rather not say",
  "Not concerned",
  "Avoid if possible",
  "Pretty strict",
  "Very strict",
];

/**
 * Converts a UserProfile into a plain-language string suitable for injection
 * into an AI system prompt. Only includes fields that have been set.
 */
export function getProfileContextForAI(profile: UserProfile): string {
  const sections: string[] = [];

  if (profile.condition.length > 0)
    sections.push(`Primary condition: ${profile.condition.join(", ")}`);

  if (profile.reason.length > 0)
    sections.push(
      `Goals: ${profile.reason.map((i) => REASON_LABELS[i]).join(", ")}`,
    );

  if (profile.symptomatic >= 0)
    sections.push(`Symptom severity: ${SYMPTOM_LABELS[profile.symptomatic]}`);

  if (profile.crossContamination >= 0)
    sections.push(
      `Cross-contact strictness: ${CROSS_CONTACT_LABELS[profile.crossContamination]}`,
    );

  if (profile.crossContaminationNotes)
    sections.push(
      `Cross-contact notes: ${profile.crossContaminationNotes}`,
    );

  if (profile.customBlockedIngredients.length > 0)
    sections.push(
      `Blocked ingredients: ${profile.customBlockedIngredients.join(", ")}`,
    );

  if (profile.additionalRestrictions.length > 0)
    sections.push(
      `Additional restrictions: ${profile.additionalRestrictions.join(", ")}`,
    );

  if (profile.otherDietaryPreferences)
    sections.push(
      `Other dietary preferences: ${profile.otherDietaryPreferences}`,
    );

  if (profile.symptomNotes)
    sections.push(`Symptom notes: ${profile.symptomNotes}`);

  if (profile.spokenLanguages)
    sections.push(`Languages spoken: ${profile.spokenLanguages}`);

  if (profile.isHelpingOther)
    sections.push(
      "This user is managing dietary needs for someone else.",
    );

  return sections.join("\n");
}

/**
 * Builds a complete system prompt string with profile context embedded.
 * Pass the returned string as the `system` / first message to your AI API.
 */
export function buildSystemPrompt(profile: UserProfile): string {
  const context = getProfileContextForAI(profile);

  return [
    "You are a celiac dining assistant for the GlutenGuard app.",
    "You help users evaluate restaurant menus, identify safe dishes, and communicate dietary needs.",
    "Be concise, empathetic, and safety-first in all recommendations.",
    "",
    context
      ? `Here is the current user's profile:\n\n${context}`
      : "The user has not completed their profile yet.",
  ].join("\n");
}
