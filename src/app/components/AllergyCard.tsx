import { useState } from "react";
import { useNavigate } from "react-router";
import {
  X,
  QrCode,
  Copy,
  ChevronDown,
  Wallet,
  Edit2,
} from "lucide-react";
import { useApp } from "../store";

// Mock translation function - Replace with real API call
async function translateText(text: string, targetLang: string): Promise<string> {
  // TODO: Replace with actual translation API (e.g., Google Translate API)
  // Example API call:
  // const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`, {
  //   method: 'POST',
  //   body: JSON.stringify({ q: text, target: targetLang }),
  // });
  // const data = await response.json();
  // return data.data.translations[0].translatedText;
  
  // For now, return mock translations
  return `[Translated to ${targetLang}]: ${text}`;
}

const translations: Record<
  string,
  {
    flag: string;
    label: string;
    cardTitle: string;
    content: {
      title: string;
      cant: string;
      cross: string;
      specifics: string;
      can: string;
      canList: string;
    };
  }
> = {
  en: {
    flag: "🇬🇧",
    label: "English",
    cardTitle: "My Allergy Card",
    content: {
      title: "I have celiac disease",
      cant: "I cannot eat anything containing wheat, barley, rye, or oats.",
      cross: "Cross-contamination is dangerous for me.",
      specifics:
        "This means: No shared fryers. No shared cutting boards. No sauces from jars used with bread. Even small crumbs can make me very ill.",
      can: "I CAN safely eat:",
      canList:
        "Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans",
    },
  },
  it: {
    flag: "🇮🇹",
    label: "Italiano",
    cardTitle: "La Mia Carta Allergie",
    content: {
      title: "Ho la celiachia",
      cant: "Non posso mangiare nulla che contenga grano, orzo, segale o avena.",
      cross:
        "La contaminazione incrociata è pericolosa per me.",
      specifics:
        "Questo significa: Nessuna friggitrice condivisa. Nessun tagliere condiviso. Nessuna salsa da barattoli usati con il pane. Anche piccole briciole possono farmi star molto male.",
      can: "Posso mangiare in sicurezza:",
      canList:
        "Riso, mais, patate, verdure, frutta, carne, pesce, uova, latticini, fagioli",
    },
  },
  ja: {
    flag: "🇯🇵",
    label: "日本語",
    cardTitle: "私のアレルギーカード",
    content: {
      title: "私はセリアック病です",
      cant: "小麦、大麦、ライ麦、オーツ麦を含むものは一切食べられません。",
      cross: "交差汚染は私にとって危険です。",
      specifics:
        "共有のフライヤー、まな板、パンに使用したソースは使えません。小さなパン粉でも重篤な症状を引き起こします。",
      can: "安全に食べられるもの：",
      canList:
        "米、とうもろこし、じゃがいも、野菜、果物、肉、魚、卵、乳製品、豆",
    },
  },
};

export function AllergyCard({ onClose }: { onClose?: () => void } = {}) {
  const nav = useNavigate();
  const { profile } = useApp();
  const [lang, setLang] = useState("ja");
  const [showLangDropdown, setShowLangDropdown] =
    useState(false);

  const t = translations[lang];
  const englishContent = translations.en.content;
  const sev = Math.max(0, profile.crossContamination);
  const color = ["#DA1E28", "#fac905", "#6d7854", "#b79b7b"][
    sev
  ];

  // Get cross-contamination text based on user's strictness level
  const getCrossContaminationText = (level: number): string => {
    switch (level) {
      case 0: // Very strict
        return "I have SEVERE reactions to gluten. Even trace amounts from shared surfaces, utensils, or airborne flour can make me extremely ill. I need dedicated gluten-free preparation area, separate cookware, and fresh gloves.";
      case 1: // Strict
        return "Cross-contact is dangerous for me. Please use clean surfaces, separate utensils, fresh gloves, and avoid shared fryers or cutting boards. Even crumbs can trigger severe symptoms.";
      case 2: // Moderate
        return "Please take care to avoid cross-contact. Use clean utensils and surfaces when preparing my food. Shared fryers should be avoided.";
      case 3: // Flexible
        return "I prefer to avoid cross-contact when possible. Please wipe down surfaces and use clean utensils if convenient.";
      case 4: // Very flexible
        return "Minor cross-contact is okay for me, but I still cannot eat foods with gluten as a direct ingredient.";
      default:
        return "Cross-contamination is dangerous for me. Please use clean surfaces and utensils.";
    }
  };

  const crossContaminationText = getCrossContaminationText(profile.crossContamination);

  const handleEdit = () => {
    // Navigate to the edit card page instead of inline editing
    nav("/edit-card");
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 pt-4">
      {/* Header with title */}
      <div className="mb-6 pt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-[#846848]">
            Show this to your server
          </p>
          <button onClick={() => (onClose ? onClose() : nav("/scan/results"))}>
            <X size={20} />
          </button>
        </div>
        <h1
          className="text-[24px] text-[#100d09] leading-tight"
          style={{ fontWeight: 600 }}
        >
          <>
            {translations.en.cardTitle}
            {lang !== "en" && (
              <span className="text-[#A6A6A6] ml-2">
                {t.cardTitle}
              </span>
            )}
          </>
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Language selector */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() =>
                setShowLangDropdown(!showLangDropdown)
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbcdbd] rounded-lg text-[15px] text-[#423424]"
            >
              <span className="text-[20px]">{t.flag}</span>
              <span>{t.label}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-[#525a3f] text-[14px] hover:bg-[#FCF5E8] rounded-lg transition-colors"
            >
              <Edit2 size={14} /> Edit my card
            </button>

            {showLangDropdown && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-[#dbcdbd] rounded-lg shadow-lg overflow-hidden z-10">
                {Object.entries(translations).map(
                  ([k, v]) => (
                    <button
                      key={k}
                      onClick={() => {
                        setLang(k);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[#FCF5E8] ${k === lang ? "bg-[#dbcdbd]" : ""}`}
                    >
                      <span className="text-[20px]">
                        {v.flag}
                      </span>
                      <span className="text-[15px]">
                        {v.label}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Languages I speak */}
          {profile.spokenLanguages && (
            <div className="space-y-2">
              <div className="bg-[#F9F9F9] rounded-lg p-4">
                <p className="text-[16px] text-[#100d09] leading-relaxed">
                  <span style={{ fontWeight: 600 }}>Languages I speak:</span> {profile.spokenLanguages}
                </p>
              </div>
            </div>
          )}

          {/* Title + Can't eat combined */}
          <div className="space-y-2">
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <p className="text-[20px] text-[#100d09] leading-relaxed">
                🔴 {t.content.title} {t.content.cant}
              </p>
            </div>
            {lang !== "en" && (
              <p className="text-[14px] text-[#A6A6A6]">
                {englishContent.title} {englishContent.cant}
              </p>
            )}
          </div>

          {/* Cross-contamination warning - now using profile-specific text */}
          <div className="space-y-2">
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <p
                className="text-[18px] text-[#100d09] leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                🔴 {crossContaminationText}
              </p>
            </div>
            {lang !== "en" && (
              <p
                className="text-[14px] text-[#A6A6A6]"
                style={{ fontWeight: 600 }}
              >
                {crossContaminationText}
              </p>
            )}
          </div>

          <hr className="border-[#dbcdbd]" />

          {/* Can eat + Can eat list combined */}
          <div className="space-y-2">
            <div className="bg-[#F9F9F9] rounded-lg p-4">
              <p
                className="text-[20px] text-[#100d09] leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                🟢 {t.content.can} {t.content.canList}
              </p>
            </div>
            {lang !== "en" && (
              <p
                className="text-[14px] text-[#A6A6A6]"
                style={{ fontWeight: 600 }}
              >
                {englishContent.can} {englishContent.canList}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-8 pt-4">
        {/* Add to Apple Wallet button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#525a3f] rounded-lg text-white">
          <Wallet size={18} /> Add to Apple Wallet
        </button>

        {/* Share and Copy buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#dbcdbd] rounded-lg text-[#100d09]">
            <QrCode size={16} /> Share via QR
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#dbcdbd] rounded-lg text-[#100d09]">
            <Copy size={16} /> Copy text
          </button>
        </div>
      </div>
    </div>
  );
}