import { useNavigate, useParams } from "react-router";
import { useApp } from "../store";
import { ArrowLeft } from "lucide-react";

const medicalConditions = [
  "I'd rather not say",
  "Celiac Disease",
  "Gluten Sensitivity",
  "Gluten Intolerance",
  "A Wheat Allergy",
  "Crohn's Disease",
  "Hashimoto's Disease",
  "IBS",
  "FODMAP Intolerance",
  "Eosinophilic Esophagitis",
  "FPIES",
  "Dermatitis Herpetiformis",
  "Sjogren's Syndrome",
  "Lupus",
  "Gluten Ataxia",
  "Lymphocytic Esophagitis",
  "Lyme Disease",
  "Graves Disease",
  "Ulcerative Colitis",
  "Endometriosis",
  "Auto-Brewery Syndrome",
  "Multiple Sclerosis",
  "Fibromyalgia",
  "Rheumatoid Arthritis",
  "MTHFR",
  "MCAS",
  "Other",
];

const questions = [
  {
    q: "What brought you here today?",
    key: "reason" as const,
    type: "checkbox" as const,
    options: [
      { title: "Eating out safely", sub: "I want help navigating restaurant menus" },
      { title: "Traveling with celiac", sub: "I need support dining in unfamiliar places" },
      { title: "I'm newly diagnosed", sub: "I want to learn what's safe" },
      { title: "Helping someone I know", sub: "A friend or family member has celiac" },
    ],
  },
  {
    q: "I'm gluten free because:",
    key: "condition" as const,
    type: "dropdown" as const,
    textInputLabel: "Other dietary preferences",
    textInputKey: "otherDietaryPreferences" as const,
  },
  {
    q: "Are you symptomatic?",
    key: "symptomatic" as const,
    type: "radio" as const,
    options: [
      { title: "Rarely", sub: "" },
      { title: "Sometimes", sub: "" },
      { title: "Always", sub: "" },
      { title: "Severely", sub: "" },
    ],
    textInputLabel: "Additional comments",
    textInputKey: "symptomNotes" as const,
  },
  {
    q: "How strictly do you avoid cross-contact?",
    key: "crossContamination" as const,
    type: "radio" as const,
    options: [
      { title: "I'd rather not say", sub: "" },
      { title: "Not concerned", sub: "" },
      { title: "Avoid if possible", sub: "" },
      { title: "Pretty strict", sub: "" },
      { title: "Very strict", sub: "" },
    ],
    textInputLabel: "Additional comments",
    textInputKey: "crossContaminationNotes" as const,
  },
];

export function OnboardingQuestion() {
  const { step } = useParams();
  const stepNum = parseInt(step || "1") - 1;
  const nav = useNavigate();
  const { profile, setProfile } = useApp();
  const data = questions[stepNum];
  if (!data) return null;

  const isHelpingOther = profile.reason.includes(3);
  const questionText = data.q;
  const adjustedQuestion = isHelpingOther && stepNum > 0
    ? questionText.replace("you", "they").replace("your", "their").replace("Are you", "Are they")
    : questionText;

  const selected = data.type === "radio" ? profile[data.key as keyof typeof profile] : null;
  const selectedArray = data.type === "checkbox" ? (profile[data.key as keyof typeof profile] as number[]) : [];
  const textValue = data.textInputKey ? (profile[data.textInputKey] as string) : "";

  const next = () => {
    if (stepNum < 3) nav(`/onboarding/${stepNum + 2}`);
    else nav("/onboarding/card");
  };

  const back = () => {
    if (stepNum === 0) nav("/");
    else nav(`/onboarding/${stepNum}`);
  };

  const canContinue = data.type === "dropdown"
    ? profile.condition.length > 0
    : data.type === "checkbox"
    ? selectedArray.length > 0
    : (selected as number) >= 0;

  return (
    <div className="flex flex-col h-full bg-white px-6 pt-6">
      {/* Back button */}
      <button
        onClick={back}
        className="flex items-center gap-2 text-[#0F62FE] mb-4 -ml-2 p-2"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= stepNum ? "bg-[#0F62FE]" : "bg-[#e0e0e0]"}`}
          />
        ))}
      </div>
      <p className="text-[#6f6f6f] mb-1">Step {stepNum + 1} of 4</p>
      <h2 className="text-[#161616] mb-6">{adjustedQuestion}</h2>

      <div className="flex-1 overflow-auto flex flex-col gap-2">
        {data.type === "checkbox" && data.options?.map((opt, i) => {
          const isSelected = selectedArray.includes(i);
          return (
            <button
              key={i}
              onClick={() => {
                const newReasons = isSelected
                  ? selectedArray.filter((r) => r !== i)
                  : [...selectedArray, i];
                setProfile({ [data.key]: newReasons });
                if (data.key === "reason") {
                  setProfile({ isHelpingOther: newReasons.includes(3) });
                }
              }}
              className={`text-left p-4 rounded-lg border transition-all ${
                isSelected
                  ? "border-[#0F62FE] bg-[#EDF5FF]"
                  : "border-[#e0e0e0] bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-[#0F62FE] bg-[#0F62FE]" : "border-[#a8a8a8]"
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[#161616]">{opt.title}</p>
                  {opt.sub && <p className="text-[13px] text-[#6f6f6f] mt-0.5">{opt.sub}</p>}
                </div>
              </div>
            </button>
          );
        })}

        {data.type === "radio" && data.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              setProfile({ [data.key]: i });
              if (data.key === "reason" && i === 3) {
                setProfile({ isHelpingOther: true });
              } else if (data.key === "reason") {
                setProfile({ isHelpingOther: false });
              }
            }}
            className={`text-left p-4 rounded-lg border transition-all ${
              selected === i
                ? "border-[#0F62FE] bg-[#EDF5FF]"
                : "border-[#e0e0e0] bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected === i ? "border-[#0F62FE]" : "border-[#a8a8a8]"
                }`}
              >
                {selected === i && <div className="w-2.5 h-2.5 rounded-full bg-[#0F62FE]" />}
              </div>
              <div>
                <p className="text-[#161616]">{opt.title}</p>
                {opt.sub && <p className="text-[13px] text-[#6f6f6f] mt-0.5">{opt.sub}</p>}
              </div>
            </div>
          </button>
        ))}

        {data.type === "dropdown" && (
          <>
            <select
              value={profile.condition}
              onChange={(e) => setProfile({ condition: e.target.value })}
              className="w-full p-4 rounded-lg border border-[#e0e0e0] bg-white text-[#161616] focus:border-[#0F62FE] focus:outline-none"
            >
              <option value="">Select a condition...</option>
              {medicalConditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </>
        )}

        {data.textInputKey && (
          <div className="mt-4">
            <label className="block text-[#525252] text-[14px] mb-2">
              {data.textInputLabel}
            </label>
            <textarea
              value={textValue}
              onChange={(e) => setProfile({ [data.textInputKey]: e.target.value })}
              className="w-full p-4 rounded-lg border border-[#e0e0e0] bg-white text-[#161616] focus:border-[#0F62FE] focus:outline-none min-h-[100px] resize-none"
              placeholder="Optional"
            />
          </div>
        )}
      </div>

      <div className="pb-8 pt-4 flex flex-col gap-2">
        <button
          onClick={next}
          disabled={!canContinue}
          className="w-full py-3.5 bg-[#0F62FE] text-white rounded-lg disabled:opacity-40"
        >
          Continue
        </button>
        <button onClick={next} className="w-full py-3 text-[#0F62FE] bg-transparent">
          Skip
        </button>
      </div>
    </div>
  );
}
