import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Wallet, MessageCircle, X } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { AllergyCard } from "./AllergyCard";

const safeItems = [
  { name: "Grilled Branzino", ingredients: "White fish, lemon, olive oil", note: "", price: "$28", originalOrder: 5 },
  { name: "Caprese Salad", ingredients: "Fresh mozzarella, tomato, basil", note: "", price: "$14", originalOrder: 1 },
  { name: "Risotto ai Funghi", ingredients: "Arborio rice, mushrooms, parmesan", note: "Ask: Is the broth gluten-free?", price: "$24", originalOrder: 7 },
  { name: "Grilled Vegetables", ingredients: "Seasonal vegetables, olive oil", note: "", price: "$12", originalOrder: 3 },
];

const cautionItems = [
  { name: "Bruschetta", ingredients: "Tomatoes, basil, garlic", checkFor: "May offer GF bread option", price: "$10", originalOrder: 2 },
  { name: "Minestrone Soup", ingredients: "Vegetables, beans, tomato broth", checkFor: "May contain pasta", price: "$9", originalOrder: 4 },
  { name: "Panna Cotta", ingredients: "Cream, vanilla, berry sauce", checkFor: "Check for cookie crumble garnish", price: "$11", originalOrder: 11 },
];

const avoidItems = [
  { name: "Spaghetti Carbonara", ingredients: "Eggs, pancetta, pecorino cheese", glutenSource: "Wheat pasta", price: "$22", originalOrder: 6 },
  { name: "Tiramisu", ingredients: "Mascarpone, espresso, cocoa", glutenSource: "Ladyfinger cookies (wheat flour)", price: "$12", originalOrder: 12 },
  { name: "Focaccia Bread", ingredients: "Olive oil, rosemary, sea salt", glutenSource: "Wheat flour", price: "$6", originalOrder: 0 },
  { name: "Penne Arrabbiata", ingredients: "Tomato, garlic, chili", glutenSource: "Wheat pasta", price: "$20", originalOrder: 8 },
  { name: "Breaded Veal Cutlet", ingredients: "Veal, lemon, arugula", glutenSource: "Wheat breadcrumbs", price: "$32", originalOrder: 9 },
];

function Tag({ color, label }: { color: string; label: string }) {
  const bg = color === "green" ? "#e7eae1" : color === "yellow" ? "#fef4cd" : "#FFF1F1";
  const fg = color === "green" ? "#6d7854" : color === "yellow" ? "#967903" : "#DA1E28";
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-[12px]" style={{ background: bg, color: fg }}>
      {label}
    </span>
  );
}

export function ScanResults() {
  const nav = useNavigate();
  const [open, setOpen] = useState<number>(0);
  const [showChat, setShowChat] = useState(false);
  const [showAllergyCard, setShowAllergyCard] = useState(false);
  const [sortByOriginal, setSortByOriginal] = useState(false);

  // Sort items if original order is selected
  const sortedSafeItems = sortByOriginal ? [...safeItems].sort((a, b) => a.originalOrder - b.originalOrder) : safeItems;
  const sortedCautionItems = sortByOriginal ? [...cautionItems].sort((a, b) => a.originalOrder - b.originalOrder) : cautionItems;
  const sortedAvoidItems = sortByOriginal ? [...avoidItems].sort((a, b) => a.originalOrder - b.originalOrder) : avoidItems;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        {/* Back button on its own row - at the top */}
        <div className="mb-3">
          <button onClick={() => nav("/scan")} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
        </div>
        
        {/* Page heading */}
        <h1 className="text-[20px] font-semibold text-[#100d09] mb-0">Scanned Results</h1>
        
        {/* Restaurant name and cuisine */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <h2 className="text-[#100d09]">Osteria Francescana</h2>
          <span className="px-2 py-0.5 rounded text-[13px] bg-[#f3f5f0] text-[#525a3f]">Italian</span>
        </div>
        
        <div className="bg-[#f3f5f0] border border-[#b8c0a5] rounded-lg p-3 mt-2">
          <p className="text-[13px] text-[#373c2a]">
            This restaurant has a gluten-free menu. 4 celiac reviews available.
          </p>
        </div>
        
        {/* Sort Toggle */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] text-[#423424]">Display order:</span>
          <div className="flex gap-1 bg-white rounded-md p-0.5">
            <button
              onClick={() => setSortByOriginal(false)}
              className={`px-3 py-1 rounded text-[12px] transition-colors ${
                !sortByOriginal
                  ? "bg-[#525a3f] text-white"
                  : "text-[#423424]"
              }`}
            >
              By Safety
            </button>
            <button
              onClick={() => setSortByOriginal(true)}
              className={`px-3 py-1 rounded text-[12px] transition-colors ${
                sortByOriginal
                  ? "bg-[#525a3f] text-white"
                  : "text-[#423424]"
              }`}
            >
              Menu Order
            </button>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="flex-1 overflow-auto px-4 pb-3">
        {sortByOriginal ? (
          /* ==================== MENU ORDER VIEW ==================== */
          <div className="border border-[#dbcdbd] rounded-2xl overflow-hidden bg-[#FCFCFC]">
            <div className="space-y-4 px-4 py-3">
              {[...safeItems, ...cautionItems, ...avoidItems]
                .sort((a, b) => a.originalOrder - b.originalOrder)
                .map((item) => {
                // Determine item type
                const isSafe = safeItems.includes(item as any);
                const isCaution = cautionItems.includes(item as any);
                const isAvoid = avoidItems.includes(item as any);
                
                const tagColor = isSafe ? "green" : isCaution ? "yellow" : "red";
                const tagLabel = isSafe ? "Low Risk" : isCaution ? "Ask First" : "Avoid";

                  return (
                    <button
                      key={item.name}
                      onClick={() => item.name === "Risotto ai Funghi" && nav("/scan/item")}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[#100d09] text-[14px]">{item.name}</p>
                            {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
                          </div>
                          <p className="text-[12px] text-[#846848]">{item.ingredients}</p>
                          {isSafe && item.note && (
                            <p className="text-[12px] text-[#967903] mt-1">{item.note}</p>
                          )}
                          {isCaution && (item as any).checkFor && (
                            <p className="text-[12px] text-[#967903] mt-1">{(item as any).checkFor}</p>
                          )}
                          {isAvoid && (item as any).glutenSource && (
                            <p className="text-[12px] text-[#967903] mt-1">Contains: {(item as any).glutenSource}</p>
                          )}
                        </div>
                        <Tag color={tagColor} label={tagLabel} />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ) : (
          /* ==================== SAFETY ORDER VIEW (ACCORDION) ==================== */
          <>
        {/* Safe */}
        <AccordionSection
          open={open === 0}
          toggle={() => setOpen(open === 0 ? -1 : 0)}
          header="✅ Safe Options"
          count={4}
          tagColor="green"
          tagLabel="Safe"
        >
          <div>
          {sortedSafeItems.map((item) => (
            <button
              key={item.name}
              onClick={() => item.name === "Risotto ai Funghi" && nav("/scan/item")}
              className="w-full text-left px-4 pb-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#100d09] text-[14px]">{item.name}</p>
                    {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
                  </div>
                  <p className="text-[12px] text-[#846848]">{item.ingredients}</p>
                  {item.note && <p className="text-[12px] text-[#967903] mt-1">{item.note}</p>}
                </div>
                <Tag color="green" label="Low Risk" />
              </div>
            </button>
          ))}
          </div>
        </AccordionSection>

        <AccordionSection
          open={open === 1}
          toggle={() => setOpen(open === 1 ? -1 : 1)}
          header="⚠️ Ask First"
          count={3}
          tagColor="yellow"
          tagLabel="Caution"
        >
          <div>
          {sortedCautionItems.map((item) => (
            <div key={item.name} className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#100d09] text-[14px]">{item.name}</p>
                    {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
                  </div>
                  <p className="text-[12px] text-[#846848]">{item.ingredients}</p>
                  <p className="text-[12px] text-[#967903] mt-1">{item.checkFor}</p>
                </div>
                <Tag color="yellow" label="Ask First" />
              </div>
            </div>
          ))}
          </div>
        </AccordionSection>

        <AccordionSection
          open={open === 2}
          toggle={() => setOpen(open === 2 ? -1 : 2)}
          header="🚫 Avoid"
          count={5}
          tagColor="red"
          tagLabel="Avoid"
        >
          <div>
          {sortedAvoidItems.map((item) => (
            <div key={item.name} className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#100d09] text-[14px]">{item.name}</p>
                    {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
                  </div>
                  <p className="text-[12px] text-[#846848]">{item.ingredients}</p>
                  <p className="text-[12px] text-[#967903] mt-1">Contains: {item.glutenSource}</p>
                </div>
                <Tag color="red" label="Avoid" />
              </div>
            </div>
          ))}
          </div>
        </AccordionSection>
          </>
        )}
      </div>

      {/* Fixed bottom action buttons - matching AllergyCard layout */}
      <div className="border-t border-[#dbcdbd] px-4 py-3 space-y-3 bg-white">
        {/* Primary button - Allergy Card */}
        <button
          onClick={() => setShowAllergyCard(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#525a3f] rounded-lg text-white text-[15px]"
          style={{ fontWeight: 500 }}
        >
          <Wallet size={18} /> Show My Allergy Card
        </button>

        {/* Secondary button - Chat */}
        <button 
          onClick={() => setShowChat(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-[#dbcdbd] rounded-lg text-[#100d09] text-[15px]"
          style={{ fontWeight: 500 }}
        >
          <MessageCircle size={16} /> AI Support
        </button>
      </div>

      {/* AI Support fullscreen */}
      {showChat && <AISupportScreen onClose={() => setShowChat(false)} />}

      {/* Allergy Card Modal with slide-up animation */}
      {showAllergyCard && <AllergyCardModal onClose={() => setShowAllergyCard(false)} />}

      <BottomTabs />
    </div>
  );
}

function AccordionSection({
  open, toggle, header, count, tagColor, tagLabel, children,
}: {
  open: boolean; toggle: () => void; header: string; count: number;
  tagColor: string; tagLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-3 border border-[#dbcdbd] rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#FCF5E8]"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>
            {header} ({count} items)
          </span>
          <Tag color={tagColor} label={tagLabel} />
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="bg-[#FCFCFC]">{children}</div>}
    </div>
  );
}

function AISupportScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd]">
        <div className="mb-3">
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
        </div>
        <h1 className="text-[20px] font-semibold text-[#100d09]">AI Support</h1>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <p className="text-[#423424] text-[14px] mb-4">
          I see you're looking at Osteria Francescana's menu. What would you like to know?
        </p>
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
          {["Is the pasta safe?", "What should I ask the server?", "Compare with another restaurant", "Translate my allergy card"].map((c) => (
            <span key={c} className="shrink-0 px-3 py-1.5 bg-[#f3f5f0] text-[#525a3f] rounded-full text-[13px]">
              {c}
            </span>
          ))}
        </div>

        {/* Chat exchange */}
        <div className="flex justify-end mb-3">
          <div className="bg-[#525a3f] text-white px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%]">
            <p className="text-[14px]">Is the tiramisu safe?</p>
          </div>
        </div>
        <div className="mb-3">
          <div className="bg-[#fcf5e9] px-4 py-3 rounded-2xl rounded-bl-sm max-w-[90%]">
            <Tag color="red" label="Avoid" />
            <p className="text-[14px] text-[#100d09] mt-2">
              Tiramisu contains ladyfinger cookies (wheat flour) and is not safe for celiac.
              There's no practical substitution for this dish. I'd recommend the panna cotta
              instead — it's naturally gluten-free if no cookie crumble is added.
            </p>
            <p className="text-[14px] text-[#423424] mt-2">
              Ask: "Does the panna cotta have any cookie or biscuit garnish?"
            </p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1.5 bg-white border border-[#dbcdbd] rounded-full text-[13px] text-[#100d09]">
                Show allergy card
              </span>
              <span className="px-3 py-1.5 bg-white border border-[#dbcdbd] rounded-full text-[13px] text-[#100d09]">
                Scan another menu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Input at bottom */}
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

function AllergyCardModal({ onClose }: { onClose: () => void }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after mounting
    setIsAnimating(true);
  }, []);

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 z-50 bg-black transition-opacity duration-[800ms]"
        style={{ opacity: isAnimating ? 0.5 : 0 }}
        onClick={onClose}
      />
      
      {/* Sliding card */}
      <div 
        className="absolute inset-0 z-50 flex flex-col bg-white rounded-t-3xl transition-transform duration-[800ms] ease-out"
        style={{ 
          transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <AllergyCard onClose={onClose} />
      </div>
    </>
  );
}