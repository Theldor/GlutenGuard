import { useApp } from "../store";
import { BottomTabs } from "./BottomTabs";
import { CreditCard, Settings, HelpCircle, LogOut, CheckCircle, AlertCircle, AlertTriangle, Edit2, X, Plus, ChevronDown, History } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, type KeyboardEvent } from "react";
import { medicalConditions, questions } from "../onboardingData";

const symptomLabels = ["Rarely", "Sometimes", "Always", "Severely"];

const crossContactLabels = [
  "I'd rather not say",
  "Not concerned",
  "Avoid if possible",
  "Pretty strict",
  "Very strict",
];

function riskBadge(symptomatic: number) {
  if (symptomatic >= 2) return { label: "High Risk", bg: "#DA1E28" };
  if (symptomatic === 1) return { label: "Moderate Risk", bg: "#c8a104" };
  return { label: "Low Risk", bg: "#6d7854" };
}

function primaryConditionIcon(symptomatic: number) {
  if (symptomatic >= 2) return { Icon: AlertTriangle, color: "#DA1E28" };
  if (symptomatic === 1) return { Icon: AlertCircle, color: "#c8a104" };
  if (symptomatic === 0) return { Icon: CheckCircle, color: "#6d7854" };
  return { Icon: CheckCircle, color: "#A6A6A6" };
}

export function Profile() {
  const { profile, setProfile, signOut } = useApp();
  const nav = useNavigate();

  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);
  const [editStep, setEditStep] = useState<number | null>(null);
  const [showBlockListModal, setShowBlockListModal] = useState(false);

  const sympIdx = Math.max(0, profile.symptomatic);
  const badge = riskBadge(profile.symptomatic);
  const severityIcon = primaryConditionIcon(profile.symptomatic);

  const removeBlockedIngredient = (index: number) => {
    setProfile({
      customBlockedIngredients: profile.customBlockedIngredients.filter((_, i) => i !== index),
    });
  };

  const handleSignOut = () => {
    signOut();
    nav("/");
  };

  const menuItems = [
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: LogOut, label: "Sign Out", action: handleSignOut },
  ];

  const sensitivityLabel = profile.condition || "Not set";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto px-4 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#525a3f] flex items-center justify-center text-white text-[24px]">
            {profile.name[0]}
          </div>
          <div>
            <h2 className="text-[#100d09]">{profile.name}</h2>
            <p className="text-[13px] text-[#846848]">Condition: {sensitivityLabel}</p>
          </div>
        </div>

        {/* Prominent Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => nav("/allergy-card")}
            className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl border-2 border-[#525a3f] bg-[#f3f5f0] text-left hover:bg-[#e7eae1]"
          >
            <CreditCard size={24} className="text-[#525a3f]" />
            <span className="text-[#525a3f] text-[15px]" style={{ fontWeight: 600 }}>Allergy Card</span>
          </button>
          <button
            onClick={() => {}}
            className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl border-2 border-[#dbcdbd] bg-white text-left hover:bg-[#FCF5E8]"
          >
            <Settings size={24} className="text-[#423424]" />
            <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 600 }}>Settings</span>
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {/* My Restrictions Dropdown */}
          <div className="border border-[#dbcdbd] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowRestrictions(!showRestrictions)}
              className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#FCF5E8]"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-[#423424]" />
                <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>My Conditions</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-[#423424] transition-transform ${showRestrictions ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showRestrictions && (
              <div className="px-4 pb-4 border-t border-[#dbcdbd]">
                {/* Primary condition — onboarding step 2 */}
                <div className="bg-[#fcf5e9] border border-[#dbcdbd] rounded-2xl p-4 mb-3 mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <severityIcon.Icon size={20} className="shrink-0" style={{ color: severityIcon.color }} />
                      <span className="text-[#100d09] text-[16px] truncate block" style={{ fontWeight: 600 }}>
                        {profile.condition || "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {profile.symptomatic >= 0 && (
                        <div
                          className="text-white px-3 py-1 rounded-full text-[12px] flex items-center gap-1"
                          style={{ fontWeight: 500, backgroundColor: badge.bg }}
                        >
                          <AlertCircle size={14} />
                          {badge.label}
                        </div>
                      )}
                      <button onClick={() => setEditStep(1)} className="p-1">
                        <Edit2 size={16} className="text-[#423424]" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#846848]">Primary condition</p>
                </div>

                {/* Reaction severity — onboarding step 3 */}
                <div className="bg-[#fcf5e9] border border-[#dbcdbd] rounded-2xl p-4 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#100d09] text-[15px]" style={{ fontWeight: 600 }}>Reaction severity</p>
                      <p className="text-[13px] text-[#846848] mt-0.5">
                        {profile.symptomatic >= 0 ? symptomLabels[sympIdx] : "Not set"}
                      </p>
                    </div>
                    <button onClick={() => setEditStep(2)} className="p-2">
                      <Edit2 size={16} className="text-[#423424]" />
                    </button>
                  </div>
                </div>

                {/* Cross-contamination strictness — onboarding step 4 */}
                <div className="bg-[#fcf5e9] border border-[#dbcdbd] rounded-2xl p-4 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#100d09] text-[15px]" style={{ fontWeight: 600 }}>Cross-contact strictness</p>
                      <p className="text-[13px] text-[#846848] mt-0.5">
                        {profile.crossContamination >= 0
                          ? crossContactLabels[profile.crossContamination]
                          : "Not set"}
                      </p>
                    </div>
                    <button onClick={() => setEditStep(3)} className="p-2">
                      <Edit2 size={16} className="text-[#423424]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Ingredient Block List Dropdown */}
          <div className="border border-[#dbcdbd] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowBlockList(!showBlockList)}
              className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#FCF5E8]"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-[#423424]" />
                  <div className="w-3 h-0.5 bg-[#423424]" />
                  <div className="w-3 h-0.5 bg-[#423424]" />
                </div>
                <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>Custom Ingredient Block List</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-[#423424] transition-transform ${showBlockList ? 'rotate-180' : ''}`}
              />
            </button>

            {showBlockList && (
              <div className="px-4 pb-4 border-t border-[#dbcdbd]">
                <p className="text-[13px] text-[#846848] mb-4 mt-3 leading-relaxed">
                  Ingredients flagged regardless of general risk model. We'll warn you about these in addition to standard celiac restrictions.
                </p>

                <ul className="flex flex-wrap gap-2">
                  {profile.customBlockedIngredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fcf5e9] border border-[#dbcdbd] text-[15px] text-[#100d09]"
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => removeBlockedIngredient(index)}
                        className="text-[#846848] hover:text-[#423424] leading-none"
                        aria-label={`Remove ${ingredient}`}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowBlockListModal(true)}
                  className="w-full mt-3 border border-[#dbcdbd] rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 text-[#100d09] text-[15px]"
                >
                  <Plus size={18} />
                  Add ingredient
                </button>
              </div>
            )}
          </div>

          {/* Scanned History */}
          <button
            onClick={() => nav("/scan/history")}
            className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-[#dbcdbd] text-left bg-white hover:bg-[#FCF5E8]"
          >
            <div className="flex items-center gap-3">
              <History size={20} className="text-[#423424]" />
              <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>Scanned History</span>
            </div>
            <ChevronDown size={18} className="text-[#A6A6A6] -rotate-90" />
          </button>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-[#dbcdbd] text-left bg-white hover:bg-[#FCF5E8]"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-[#423424]" />
                <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomTabs />

      {/* Onboarding question edit modal */}
      {editStep !== null && (
        <OnboardingEditModal stepIndex={editStep} onClose={() => setEditStep(null)} />
      )}

      {/* Block list ingredient modal */}
      {showBlockListModal && (
        <BlockListModal
          existing={profile.customBlockedIngredients}
          onSave={(tags) => {
            setProfile({ customBlockedIngredients: tags });
            setShowBlockListModal(false);
          }}
          onClose={() => setShowBlockListModal(false)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal for editing the custom ingredient block list as tags        */
/* ------------------------------------------------------------------ */

function BlockListModal({
  existing,
  onSave,
  onClose,
}: {
  existing: string[];
  onSave: (tags: string[]) => void;
  onClose: () => void;
}) {
  const [tags, setTags] = useState<string[]>([...existing]);
  const [input, setInput] = useState("");

  const addTags = (words: string[]) => {
    setTags((prev) => {
      const next = [...prev];
      words.forEach((w) => {
        const normalized = w.trim().replace(/,+$/, "");
        if (normalized && !next.includes(normalized)) next.push(normalized);
      });
      return next;
    });
  };

  const handleInputChange = (value: string) => {
    const hasWhitespace = /\s/.test(value);
    if (!hasWhitespace) { setInput(value); return; }
    const trailingSpace = /\s$/.test(value);
    const parts = value.split(/\s+/);
    const completed = trailingSpace ? parts : parts.slice(0, -1);
    const remainder = trailingSpace ? "" : (parts[parts.length - 1] ?? "");
    addTags(completed.filter(Boolean));
    setInput(remainder);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed) { addTags([trimmed]); setInput(""); }
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-[#dbcdbd] flex items-center justify-between">
          <h3 className="text-[17px] text-[#100d09]" style={{ fontWeight: 600 }}>
            Ingredients I cannot eat
          </h3>
          <button onClick={onClose} className="p-1">
            <X size={20} className="text-[#423424]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-5 py-4">
          <p className="text-[13px] text-[#846848] mb-4 leading-relaxed">
            Type an ingredient and press space or Enter to add it as a tag.
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fcf5e9] border border-[#dbcdbd] text-[14px] text-[#100d09]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    className="text-[#846848] hover:text-[#423424] leading-none"
                    aria-label={`Remove ${tag}`}
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Input */}
          <input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 border border-[#dbcdbd] rounded-lg text-[15px] text-[#100d09] focus:border-[#525a3f] focus:outline-none"
            placeholder="Type ingredient then space…"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 pt-4 border-t border-[#dbcdbd] flex gap-3">
          <button
            onClick={() => onSave(tags)}
            className="flex-1 py-3.5 bg-[#525a3f] text-white rounded-lg text-[15px]"
            style={{ fontWeight: 500 }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 border border-[#dbcdbd] text-[#100d09] rounded-lg text-[15px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline modal that shows a single onboarding question for editing  */
/* ------------------------------------------------------------------ */

function OnboardingEditModal({
  stepIndex,
  onClose,
}: {
  stepIndex: number;
  onClose: () => void;
}) {
  const { profile, setProfile } = useApp();
  const data = questions[stepIndex];

  const [localProfile, setLocalProfile] = useState(() => ({ ...profile }));

  if (!data) return null;

  const applyLocal = (patch: Record<string, unknown>) => {
    setLocalProfile((prev) => ({ ...prev, ...patch }));
  };

  const selected =
    data.type === "radio" ? (localProfile[data.key as keyof typeof localProfile] as number) : null;
  const selectedArray =
    data.type === "checkbox"
      ? (localProfile[data.key as keyof typeof localProfile] as number[])
      : [];
  const textValue = data.textInputKey
    ? (localProfile[data.textInputKey as keyof typeof localProfile] as string)
    : "";

  const handleSave = () => {
    const patch: Record<string, unknown> = { [data.key]: localProfile[data.key as keyof typeof localProfile] };
    if (data.textInputKey) {
      patch[data.textInputKey] = localProfile[data.textInputKey as keyof typeof localProfile];
    }
    if (data.key === "reason") {
      patch.isHelpingOther = (localProfile.reason as number[]).includes(3);
    }
    setProfile(patch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-[#dbcdbd]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[17px] text-[#100d09]" style={{ fontWeight: 600 }}>
              {data.q}
            </h3>
            <button onClick={onClose} className="p-1">
              <X size={20} className="text-[#423424]" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-2">
          {data.type === "checkbox" &&
            data.options?.map((opt, i) => {
              const isSelected = selectedArray.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    const next = isSelected
                      ? selectedArray.filter((r) => r !== i)
                      : [...selectedArray, i];
                    applyLocal({ [data.key]: next });
                  }}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    isSelected ? "border-[#525a3f] bg-[#f3f5f0]" : "border-[#dbcdbd] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? "border-[#525a3f] bg-[#525a3f]" : "border-[#b79b7b]"
                      }`}
                    >
                      {isSelected && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path
                            d="M1 5L4.5 8.5L11 1.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-[#100d09]">{opt.title}</p>
                      {opt.sub && <p className="text-[13px] text-[#846848] mt-0.5">{opt.sub}</p>}
                    </div>
                  </div>
                </button>
              );
            })}

          {data.type === "radio" &&
            data.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => applyLocal({ [data.key]: i })}
                className={`text-left p-4 rounded-lg border transition-all ${
                  selected === i ? "border-[#525a3f] bg-[#f3f5f0]" : "border-[#dbcdbd] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selected === i ? "border-[#525a3f]" : "border-[#b79b7b]"
                    }`}
                  >
                    {selected === i && <div className="w-2.5 h-2.5 rounded-full bg-[#525a3f]" />}
                  </div>
                  <div>
                    <p className="text-[#100d09]">{opt.title}</p>
                    {opt.sub && <p className="text-[13px] text-[#846848] mt-0.5">{opt.sub}</p>}
                  </div>
                </div>
              </button>
            ))}

          {data.type === "dropdown" && (
            <select
              value={localProfile.condition}
              onChange={(e) => applyLocal({ condition: e.target.value })}
              className="w-full p-4 rounded-lg border border-[#dbcdbd] bg-white text-[#100d09] focus:border-[#525a3f] focus:outline-none"
            >
              <option value="">Select a condition...</option>
              {medicalConditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {data.textInputKey && (
            <div className="mt-4">
              <label className="block text-[#423424] text-[14px] mb-2">
                {data.textInputLabel}
              </label>
              <textarea
                value={textValue}
                onChange={(e) => applyLocal({ [data.textInputKey!]: e.target.value })}
                className="w-full p-4 rounded-lg border border-[#dbcdbd] bg-white text-[#100d09] focus:border-[#525a3f] focus:outline-none min-h-[100px] resize-none"
                placeholder="Optional"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 pt-4 border-t border-[#dbcdbd] flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-[#525a3f] text-white rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-[#525a3f] bg-transparent"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
