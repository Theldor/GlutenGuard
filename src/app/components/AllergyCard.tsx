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

interface TranslationEntry {
  flag: string;
  label: string;
  cardTitle: string;
  languagesLabel: string;
  content: {
    title: string;
    cant: string;
    can: string;
    canList: string;
  };
  crossContamination: string[]; // 5 levels: 0 (very strict) → 4 (very flexible)
}

const translations: Record<string, TranslationEntry> = {
  en: {
    flag: "🇬🇧",
    label: "English",
    cardTitle: "My Allergy Card",
    languagesLabel: "Languages I speak:",
    content: {
      title: "I have celiac disease.",
      cant: "I cannot eat anything containing wheat, barley, rye, or oats.",
      can: "I CAN safely eat:",
      canList:
        "Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans",
    },
    crossContamination: [
      "I have SEVERE reactions to gluten. Even trace amounts from shared surfaces, utensils, or airborne flour can make me extremely ill. I need a dedicated gluten-free preparation area, separate cookware, and fresh gloves.",
      "Cross-contact is dangerous for me. Please use clean surfaces, separate utensils, fresh gloves, and avoid shared fryers or cutting boards. Even crumbs can trigger severe symptoms.",
      "Please take care to avoid cross-contact. Use clean utensils and surfaces when preparing my food. Shared fryers should be avoided.",
      "I prefer to avoid cross-contact when possible. Please wipe down surfaces and use clean utensils if convenient.",
      "Minor cross-contact is okay for me, but I still cannot eat foods with gluten as a direct ingredient.",
    ],
  },
  it: {
    flag: "🇮🇹",
    label: "Italiano",
    cardTitle: "La Mia Carta Allergie",
    languagesLabel: "Lingue che parlo:",
    content: {
      title: "Ho la celiachia.",
      cant: "Non posso mangiare nulla che contenga grano, orzo, segale o avena.",
      can: "Posso mangiare in sicurezza:",
      canList:
        "Riso, mais, patate, verdure, frutta, carne, pesce, uova, latticini, fagioli",
    },
    crossContamination: [
      "Ho reazioni GRAVI al glutine. Anche tracce da superfici condivise, utensili o farina nell'aria possono farmi star molto male. Ho bisogno di un'area di preparazione dedicata senza glutine, pentole separate e guanti puliti.",
      "Il contatto incrociato è pericoloso per me. Si prega di usare superfici pulite, utensili separati, guanti puliti ed evitare friggitrici o taglieri condivisi. Anche le briciole possono scatenare sintomi gravi.",
      "Si prega di fare attenzione per evitare il contatto incrociato. Usare utensili e superfici puliti quando si prepara il mio cibo. Evitare friggitrici condivise.",
      "Preferisco evitare il contatto incrociato quando possibile. Si prega di pulire le superfici e usare utensili puliti se conveniente.",
      "Un leggero contatto incrociato va bene per me, ma non posso comunque mangiare cibi con glutine come ingrediente diretto.",
    ],
  },
  ja: {
    flag: "🇯🇵",
    label: "日本語",
    cardTitle: "私のアレルギーカード",
    languagesLabel: "話せる言語：",
    content: {
      title: "私はセリアック病です。",
      cant: "小麦、大麦、ライ麦、オーツ麦を含むものは一切食べられません。",
      can: "安全に食べられるもの：",
      canList:
        "米、とうもろこし、じゃがいも、野菜、果物、肉、魚、卵、乳製品、豆",
    },
    crossContamination: [
      "私はグルテンに対して重篤な反応を起こします。共有された調理面、器具、空気中の小麦粉の微量でも非常に具合が悪くなります。専用のグルテンフリー調理エリア、別の調理器具、清潔な手袋が必要です。",
      "交差汚染は私にとって危険です。清潔な調理面、別々の器具、新しい手袋を使用し、共有のフライヤーやまな板は避けてください。パン粉でも重篤な症状を引き起こします。",
      "交差汚染を避けるようご注意ください。料理を作る際は清潔な器具と調理面を使用してください。共有のフライヤーは避けてください。",
      "可能な限り交差汚染を避けたいと思います。差し支えなければ調理面を拭いて清潔な器具を使用してください。",
      "軽度の交差汚染は問題ありませんが、グルテンを直接材料として含む食品は食べられません。",
    ],
  },
  zh: {
    flag: "🇨🇳",
    label: "中文",
    cardTitle: "我的过敏卡",
    languagesLabel: "我会说的语言：",
    content: {
      title: "我患有乳糜泻。",
      cant: "我不能食用任何含有小麦、大麦、黑麦或燕麦的食物。",
      can: "我可以安全食用：",
      canList: "米饭、玉米、土豆、蔬菜、水果、肉类、鱼类、鸡蛋、乳制品、豆类",
    },
    crossContamination: [
      "我对麸质有严重反应。即使是共用表面、餐具或空气中飘散的面粉微量也会让我非常不适。我需要专用的无麸质准备区域、独立的炊具和干净的手套。",
      "交叉接触对我很危险。请使用清洁的表面、专用餐具和干净的手套，避免共用油炸锅或砧板。即使是碎屑也会引发严重症状。",
      "请注意避免交叉接触。准备我的食物时请使用干净的餐具和表面。应避免使用共用油炸锅。",
      "我希望尽可能避免交叉接触。如果方便的话，请擦拭表面并使用干净的餐具。",
      "轻微的交叉接触对我来说没问题，但我仍然不能食用以麸质作为直接成分的食物。",
    ],
  },
  ko: {
    flag: "🇰🇷",
    label: "한국어",
    cardTitle: "나의 알레르기 카드",
    languagesLabel: "제가 할 수 있는 언어:",
    content: {
      title: "저는 셀리악병이 있습니다.",
      cant: "저는 밀, 보리, 호밀, 귀리가 포함된 어떤 것도 먹을 수 없습니다.",
      can: "저는 안전하게 먹을 수 있습니다:",
      canList: "쌀, 옥수수, 감자, 채소, 과일, 고기, 생선, 계란, 유제품, 콩",
    },
    crossContamination: [
      "저는 글루텐에 심각한 반응을 보입니다. 공용 표면, 조리도구, 공기 중의 밀가루 흔적도 저를 매우 아프게 할 수 있습니다. 전용 글루텐프리 조리 공간, 별도의 조리도구, 새 장갑이 필요합니다.",
      "교차 접촉은 저에게 위험합니다. 깨끗한 표면, 별도의 조리도구, 새 장갑을 사용해 주시고 공용 튀김기나 도마는 피해 주세요. 작은 부스러기도 심각한 증상을 유발할 수 있습니다.",
      "교차 접촉을 피하도록 주의해 주세요. 제 음식을 준비할 때 깨끗한 조리도구와 표면을 사용해 주세요. 공용 튀김기는 피해야 합니다.",
      "가능하면 교차 접촉을 피하고 싶습니다. 편리하시다면 표면을 닦고 깨끗한 조리도구를 사용해 주세요.",
      "약간의 교차 접촉은 괜찮지만, 여전히 글루텐이 직접 재료로 들어간 음식은 먹을 수 없습니다.",
    ],
  },
  fr: {
    flag: "🇫🇷",
    label: "Français",
    cardTitle: "Ma Carte d'Allergies",
    languagesLabel: "Langues que je parle :",
    content: {
      title: "J'ai la maladie cœliaque.",
      cant: "Je ne peux rien manger qui contienne du blé, de l'orge, du seigle ou de l'avoine.",
      can: "Je PEUX manger en toute sécurité :",
      canList:
        "Riz, maïs, pommes de terre, légumes, fruits, viande, poisson, œufs, produits laitiers, haricots",
    },
    crossContamination: [
      "J'ai des réactions GRAVES au gluten. Même des traces provenant de surfaces partagées, d'ustensiles ou de farine en suspension peuvent me rendre extrêmement malade. J'ai besoin d'une zone de préparation sans gluten dédiée, d'ustensiles séparés et de gants neufs.",
      "Le contact croisé est dangereux pour moi. Veuillez utiliser des surfaces propres, des ustensiles séparés, des gants neufs et éviter les friteuses ou planches à découper partagées. Même les miettes peuvent déclencher des symptômes graves.",
      "Veuillez faire attention à éviter le contact croisé. Utilisez des ustensiles et surfaces propres lors de la préparation de mon repas. Les friteuses partagées doivent être évitées.",
      "Je préfère éviter le contact croisé quand c'est possible. Veuillez essuyer les surfaces et utiliser des ustensiles propres si c'est pratique.",
      "Un léger contact croisé est acceptable pour moi, mais je ne peux toujours pas manger d'aliments contenant du gluten comme ingrédient direct.",
    ],
  },
  es: {
    flag: "🇪🇸",
    label: "Español",
    cardTitle: "Mi Tarjeta de Alergias",
    languagesLabel: "Idiomas que hablo:",
    content: {
      title: "Tengo enfermedad celíaca.",
      cant: "No puedo comer nada que contenga trigo, cebada, centeno o avena.",
      can: "PUEDO comer con seguridad:",
      canList:
        "Arroz, maíz, patatas, verduras, fruta, carne, pescado, huevos, lácteos, frijoles",
    },
    crossContamination: [
      "Tengo reacciones GRAVES al gluten. Incluso trazas de superficies compartidas, utensilios o harina en el aire pueden enfermarme mucho. Necesito un área de preparación sin gluten dedicada, utensilios separados y guantes limpios.",
      "El contacto cruzado es peligroso para mí. Por favor use superficies limpias, utensilios separados, guantes nuevos y evite freidoras o tablas de cortar compartidas. Incluso las migas pueden provocar síntomas graves.",
      "Por favor tenga cuidado para evitar el contacto cruzado. Use utensilios y superficies limpias al preparar mi comida. Deben evitarse las freidoras compartidas.",
      "Prefiero evitar el contacto cruzado cuando sea posible. Por favor limpie las superficies y use utensilios limpios si es conveniente.",
      "El contacto cruzado menor está bien para mí, pero aún así no puedo comer alimentos con gluten como ingrediente directo.",
    ],
  },
  ru: {
    flag: "🇷🇺",
    label: "Русский",
    cardTitle: "Моя карточка аллергика",
    languagesLabel: "Языки, на которых я говорю:",
    content: {
      title: "У меня целиакия.",
      cant: "Я не могу есть ничего, содержащего пшеницу, ячмень, рожь или овёс.",
      can: "Я МОГУ безопасно есть:",
      canList:
        "Рис, кукурузу, картофель, овощи, фрукты, мясо, рыбу, яйца, молочные продукты, бобы",
    },
    crossContamination: [
      "У меня ТЯЖЁЛЫЕ реакции на глютен. Даже следы с общих поверхностей, посуды или мучная пыль в воздухе могут сделать меня очень больным. Мне нужна отдельная безглютеновая зона приготовления, отдельная посуда и чистые перчатки.",
      "Перекрёстное загрязнение опасно для меня. Пожалуйста, используйте чистые поверхности, отдельную посуду, чистые перчатки и избегайте общих фритюрниц или разделочных досок. Даже крошки могут вызвать тяжёлые симптомы.",
      "Пожалуйста, будьте осторожны, чтобы избежать перекрёстного загрязнения. Используйте чистую посуду и поверхности при приготовлении моей еды. Следует избегать общих фритюрниц.",
      "Я предпочитаю избегать перекрёстного загрязнения, когда это возможно. Пожалуйста, протрите поверхности и используйте чистую посуду, если это удобно.",
      "Небольшое перекрёстное загрязнение допустимо для меня, но я всё равно не могу есть еду, где глютен является прямым ингредиентом.",
    ],
  },
  el: {
    flag: "🇬🇷",
    label: "Ελληνικά",
    cardTitle: "Η Κάρτα Αλλεργιών Μου",
    languagesLabel: "Γλώσσες που μιλάω:",
    content: {
      title: "Έχω κοιλιοκάκη.",
      cant: "Δεν μπορώ να φάω τίποτα που περιέχει σιτάρι, κριθάρι, σίκαλη ή βρώμη.",
      can: "Μπορώ να φάω με ασφάλεια:",
      canList:
        "Ρύζι, καλαμπόκι, πατάτες, λαχανικά, φρούτα, κρέας, ψάρι, αυγά, γαλακτοκομικά, όσπρια",
    },
    crossContamination: [
      "Έχω ΣΟΒΑΡΕΣ αντιδράσεις στη γλουτένη. Ακόμη και ίχνη από κοινές επιφάνειες, σκεύη ή αιωρούμενο αλεύρι μπορούν να με κάνουν εξαιρετικά άρρωστο. Χρειάζομαι αποκλειστικό χώρο προετοιμασίας χωρίς γλουτένη, ξεχωριστά σκεύη και καθαρά γάντια.",
      "Η διασταυρούμενη επαφή είναι επικίνδυνη για εμένα. Παρακαλώ χρησιμοποιήστε καθαρές επιφάνειες, ξεχωριστά σκεύη, καθαρά γάντια και αποφύγετε κοινές φριτέζες ή σανίδες κοπής. Ακόμη και ψίχουλα μπορούν να προκαλέσουν σοβαρά συμπτώματα.",
      "Παρακαλώ προσέξτε να αποφύγετε τη διασταυρούμενη επαφή. Χρησιμοποιήστε καθαρά σκεύη και επιφάνειες κατά την προετοιμασία του φαγητού μου. Πρέπει να αποφεύγονται κοινές φριτέζες.",
      "Προτιμώ να αποφεύγω τη διασταυρούμενη επαφή όταν είναι δυνατόν. Παρακαλώ σκουπίστε τις επιφάνειες και χρησιμοποιήστε καθαρά σκεύη αν είναι βολικό.",
      "Η μικρή διασταυρούμενη επαφή είναι εντάξει για εμένα, αλλά και πάλι δεν μπορώ να φάω φαγητά με γλουτένη ως άμεσο συστατικό.",
    ],
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

  const severityTints: { bg: string; border: string }[] = [
    { bg: "#FDECEC", border: "#DA1E28" },
    { bg: "#FFF4D6", border: "#E6B800" },
    { bg: "#EFF1E8", border: "#6d7854" },
    { bg: "#F5EFE8", border: "#b79b7b" },
    { bg: "#F4F4F4", border: "#A6A6A6" },
  ];
  const crossTint =
    severityTints[Math.max(0, Math.min(4, profile.crossContamination))];
  const dangerTint = severityTints[0];
  const safeTint = { bg: "#EEF3E8", border: "#525a3f" };

  const crossLevel = Math.max(0, Math.min(4, profile.crossContamination));
  const crossContaminationText = t.crossContamination[crossLevel];
  const crossContaminationEnglish = translations.en.crossContamination[crossLevel];

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
          {t.cardTitle}
          {lang !== "en" && (
            <span className="text-[#A6A6A6] ml-2">
              {translations.en.cardTitle}
            </span>
          )}
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
                  <span style={{ fontWeight: 600 }}>{t.languagesLabel}</span> {profile.spokenLanguages}
                </p>
              </div>
              {lang !== "en" && (
                <p className="text-[14px] text-[#A6A6A6]">
                  <span style={{ fontWeight: 600 }}>{translations.en.languagesLabel}</span> {profile.spokenLanguages}
                </p>
              )}
            </div>
          )}

          {/* Title + Can't eat combined */}
          <div className="space-y-2">
            <div
              className="rounded-lg p-4 border-l-4"
              style={{
                backgroundColor: dangerTint.bg,
                borderLeftColor: dangerTint.border,
              }}
            >
              <p
                className="text-[16px] text-[#100d09] leading-relaxed"
                style={{ fontWeight: 500 }}
              >
                {t.content.title} {t.content.cant}
              </p>
            </div>
            {lang !== "en" && (
              <p className="text-[14px] text-[#A6A6A6] border-b border-[#dbcdbd] pb-3 mb-1">
                {englishContent.title} {englishContent.cant}
              </p>
            )}
          </div>

          {/* Cross-contamination warning - now using profile-specific text */}
          <div className="space-y-2">
            <div
              className="rounded-lg p-4 border-l-4"
              style={{
                backgroundColor: crossTint.bg,
                borderLeftColor: crossTint.border,
              }}
            >
              <p
                className="text-[16px] text-[#100d09] leading-relaxed"
                style={{ fontWeight: 500 }}
              >
                {crossContaminationText}
              </p>
            </div>
            {lang !== "en" && (
              <p className="text-[14px] text-[#A6A6A6] border-b border-[#dbcdbd] pb-3 mb-1">
                {crossContaminationEnglish}
              </p>
            )}
          </div>

          {/* Can eat + Can eat list combined */}
          <div className="space-y-2">
            <div
              className="rounded-lg p-4 border-l-4"
              style={{
                backgroundColor: safeTint.bg,
                borderLeftColor: safeTint.border,
              }}
            >
              <p
                className="text-[16px] text-[#100d09] leading-relaxed"
                style={{ fontWeight: 500 }}
              >
                {t.content.can} {t.content.canList}
              </p>
            </div>
            {lang !== "en" && (
              <p className="text-[14px] text-[#A6A6A6]">
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