import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Wallet, MessageCircle, X } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { AllergyCard } from "./AllergyCard";
import type { AnalysisResult, AnalyzedMenuItem } from "@/app/lib/analyzeMenu";

// ─── Fallback mock data (shown when navigating directly without a scan) ────────
const MOCK_RESULTS: AnalysisResult = {
  restaurant: "Osteria Francescana",
  cuisine: "Italian",
  banner: "This restaurant has a gluten-free menu. 4 celiac reviews available.",
  safe: [
    { id: 1, name: "Grilled Branzino", price: "$28", desc: "White fish, lemon, olive oil", tag: "Low Risk", ask: null },
    { id: 2, name: "Caprese Salad", price: "$14", desc: "Fresh mozzarella, tomato, basil", tag: "Low Risk", ask: null },
    { id: 3, name: "Risotto ai Funghi", price: "$24", desc: "Arborio rice, mushrooms, parmesan", tag: "Low Risk", ask: "Is the broth gluten-free?" },
    { id: 4, name: "Grilled Vegetables", price: "$12", desc: "Seasonal vegetables, olive oil", tag: "Low Risk", ask: null },
  ],
  caution: [
    { id: 5, name: "Bruschetta", price: "$10", desc: "Tomatoes, basil, garlic", tag: "Ask First", ask: "May offer GF bread option — ask the server" },
    { id: 6, name: "Minestrone Soup", price: "$9", desc: "Vegetables, beans, tomato broth", tag: "Ask First", ask: "Ask if it contains pasta or is made in a shared pot" },
    { id: 7, name: "Panna Cotta", price: "$11", desc: "Cream, vanilla, berry sauce", tag: "Ask First", ask: "Ask if served with a cookie or biscuit garnish" },
    { id: 8, name: "Spaghetti Carbonara", price: "$22", desc: "Eggs, pancetta, pecorino cheese", tag: "High Risk", ask: "Contains wheat pasta" },
    { id: 9, name: "Tiramisu", price: "$12", desc: "Mascarpone, espresso, cocoa", tag: "High Risk", ask: "Ladyfinger cookies contain wheat flour" },
    { id: 10, name: "Focaccia Bread", price: "$6", desc: "Olive oil, rosemary, sea salt", tag: "High Risk", ask: "Made with wheat flour" },
    { id: 11, name: "Penne Arrabbiata", price: "$20", desc: "Tomato, garlic, chili", tag: "High Risk", ask: "Contains wheat pasta" },
    { id: 12, name: "Breaded Veal Cutlet", price: "$32", desc: "Veal, lemon, arugula", tag: "High Risk", ask: "Coated in wheat breadcrumbs" },
  ],
  menuOrder: [
    { type: "heading", text: "Antipasti" },
    { type: "item", id: 2 },
    { type: "item", id: 5 },
    { type: "heading", text: "Soups" },
    { type: "item", id: 6 },
    { type: "heading", text: "Mains" },
    { type: "item", id: 1 },
    { type: "item", id: 8 },
    { type: "item", id: 11 },
    { type: "item", id: 12 },
    { type: "item", id: 3 },
    { type: "heading", text: "Sides" },
    { type: "item", id: 4 },
    { type: "item", id: 10 },
    { type: "heading", text: "Desserts" },
    { type: "item", id: 7 },
    { type: "item", id: 9 },
  ],
};

// ─── Tag badge ────────────────────────────────────────────────────────────────
function Tag({ tag }: { tag: AnalyzedMenuItem["tag"] }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    "Low Risk":  { bg: "#e7eae1", color: "#6d7854", label: "Low Risk" },
    "Ask First": { bg: "#fef4cd", color: "#967903", label: "Ask First" },
    "High Risk": { bg: "#FFF1F1", color: "#DA1E28", label: "Avoid" },
  };
  const s = styles[tag] ?? styles["Ask First"];
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-[12px]" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── Single menu item row ─────────────────────────────────────────────────────
function MenuItem({ item }: { item: AnalyzedMenuItem }) {
  return (
    <button className="w-full text-left py-2 mb-2 last:mb-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-[#100d09] text-[14px]">{item.name}</p>
            {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
          </div>
          <p className="text-[12px] text-[#846848]">{item.desc}</p>
          {item.ask && (
            <p className="text-[12px] text-[#967903] mt-1">
              {item.tag === "High Risk" ? `Contains: ${item.ask}` : `Ask: ${item.ask}`}
            </p>
          )}
        </div>
        <Tag tag={item.tag} />
      </div>
    </button>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function AccordionSection({
  open, toggle, header, count, tagColor, children,
}: {
  open: boolean; toggle: () => void; header: string; count: number;
  tagColor: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-3 border-b border-[#dbcdbd]"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#100d09] text-[14px]">{header} ({count} items)</span>
          <Tag tag={tagColor as AnalyzedMenuItem["tag"]} />
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="pt-2">
          <div className="bg-[#f9ebd2] rounded-lg p-3">{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ScanResults() {
  const nav = useNavigate();
  const location = useLocation();
  const results: AnalysisResult = location.state?.results ?? MOCK_RESULTS;

  const [openSection, setOpenSection] = useState<number>(0);
  const [sortByOriginal, setSortByOriginal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAllergyCard, setShowAllergyCard] = useState(false);

  // Split caution items into "ask first" vs "high risk / avoid"
  const askFirst = results.caution.filter((i) => i.tag === "Ask First");
  const avoid = results.caution.filter((i) => i.tag === "High Risk");

  // Lookup map for menu-order view
  const itemById = new Map<number, AnalyzedMenuItem>(
    [...results.safe, ...results.caution].map((i) => [i.id, i])
  );

  const toggle = (idx: number) => setOpenSection((prev) => (prev === idx ? -1 : idx));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd]">
        <div className="mb-3">
          <button onClick={() => nav("/scan/review")} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
        </div>

        <h1 className="text-[20px] font-semibold text-[#100d09] mb-0">Scanned Results</h1>

        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <h2 className="text-[#100d09]">{results.restaurant}</h2>
          <span className="px-2 py-0.5 rounded text-[13px] bg-[#f3f5f0] text-[#525a3f]">{results.cuisine}</span>
        </div>

        <div className="bg-[#f3f5f0] border border-[#b8c0a5] rounded-lg p-3 mt-2">
          <p className="text-[13px] text-[#373c2a]">{results.banner}</p>
        </div>

        {/* Sort toggle */}
        <div className="mt-3 flex items-center justify-between bg-[#fcf5e9] rounded-lg p-2">
          <span className="text-[13px] text-[#423424]">Display order:</span>
          <div className="flex gap-1 bg-white rounded-md p-0.5">
            {[["By Safety", false], ["Menu Order", true]].map(([label, val]) => (
              <button
                key={String(val)}
                onClick={() => setSortByOriginal(val as boolean)}
                className={`px-3 py-1 rounded text-[12px] transition-colors ${
                  sortByOriginal === val ? "bg-[#525a3f] text-white" : "text-[#423424]"
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {sortByOriginal ? (
          <div className="space-y-2">
            {results.menuOrder
              ? results.menuOrder.map((entry, i) => {
                  if (entry.type === "heading") {
                    return (
                      <p key={`h-${i}`} className="text-[11px] font-semibold text-[#525a3f] uppercase tracking-wider pt-3 pb-1 px-1">
                        {entry.text}
                      </p>
                    );
                  }
                  const item = itemById.get(entry.id!);
                  if (!item) return null;
                  return <MenuItem key={item.id} item={item} />;
                })
              : [...results.safe, ...results.caution].map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
          </div>
        ) : (
          <>
            {results.safe.length > 0 && (
              <AccordionSection
                open={openSection === 0}
                toggle={() => toggle(0)}
                header="✅ Safe Options"
                count={results.safe.length}
                tagColor="Low Risk"
              >
                {results.safe.map((item) => <MenuItem key={item.id} item={item} />)}
              </AccordionSection>
            )}

            {askFirst.length > 0 && (
              <AccordionSection
                open={openSection === 1}
                toggle={() => toggle(1)}
                header="⚠️ Ask First"
                count={askFirst.length}
                tagColor="Ask First"
              >
                {askFirst.map((item) => <MenuItem key={item.id} item={item} />)}
              </AccordionSection>
            )}

            {avoid.length > 0 && (
              <AccordionSection
                open={openSection === 2}
                toggle={() => toggle(2)}
                header="🚫 Avoid"
                count={avoid.length}
                tagColor="High Risk"
              >
                {avoid.map((item) => <MenuItem key={item.id} item={item} />)}
              </AccordionSection>
            )}
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div className="border-t border-[#dbcdbd] px-4 py-3 space-y-3 bg-white">
        <button
          onClick={() => setShowAllergyCard(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#525a3f] rounded-lg text-white text-[15px]"
          style={{ fontWeight: 500 }}
        >
          <Wallet size={18} /> Show My Allergy Card
        </button>
        <button
          onClick={() => setShowChat(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-[#dbcdbd] rounded-lg text-[#100d09] text-[15px]"
          style={{ fontWeight: 500 }}
        >
          <MessageCircle size={16} /> AI Support
        </button>
      </div>

      {showChat && <AISupportScreen onClose={() => setShowChat(false)} />}
      {showAllergyCard && <AllergyCardModal onClose={() => setShowAllergyCard(false)} />}

      <BottomTabs />
    </div>
  );
}

// ─── AI Support screen ────────────────────────────────────────────────────────
function AISupportScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd]">
        <div className="mb-3">
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
        </div>
        <h1 className="text-[20px] font-semibold text-[#100d09]">AI Support</h1>
      </div>
      <div className="flex-1 overflow-auto px-4 py-4">
        <p className="text-[#423424] text-[14px] mb-4">
          I see you're looking at this menu. What would you like to know?
        </p>
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
          {["Is the pasta safe?", "What should I ask the server?", "Translate my allergy card"].map((c) => (
            <span key={c} className="shrink-0 px-3 py-1.5 bg-[#f3f5f0] text-[#525a3f] rounded-full text-[13px]">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-[#dbcdbd] px-4 py-3 pb-10 flex gap-2">
        <input
          className="flex-1 bg-[#fcf5e9] rounded-full px-4 py-2.5 text-[14px] outline-none"
          placeholder="Ask about this menu..."
        />
        <button className="w-10 h-10 rounded-full bg-[#525a3f] flex items-center justify-center text-white">
          ↑
        </button>
      </div>
    </div>
  );
}

// ─── Allergy card modal ───────────────────────────────────────────────────────
function AllergyCardModal({ onClose }: { onClose: () => void }) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => { setIsAnimating(true); }, []);

  return (
    <>
      <div
        className="absolute inset-0 z-50 bg-black transition-opacity duration-[800ms]"
        style={{ opacity: isAnimating ? 0.5 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute inset-0 z-50 flex flex-col bg-white rounded-t-3xl transition-transform duration-[800ms] ease-out"
        style={{ transform: isAnimating ? "translateY(0)" : "translateY(100%)" }}
      >
        <AllergyCard />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f0ede8]"
        >
          <X size={16} className="text-[#100d09]" />
        </button>
      </div>
    </>
  );
}
