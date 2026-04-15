import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Wallet, MessageCircle, ImagePlus, Loader2, Send } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { AllergyCard } from "./AllergyCard";
import { useApp } from "../store";
import { buildSystemPrompt } from "../utils/profileContext";
import type { AnalysisResult, AnalyzedMenuItem } from "@/app/lib/analyzeMenu";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_RESULTS: AnalysisResult = {
  restaurant: "Osteria Francescana",
  cuisine: "Italian",
  banner: "This restaurant has a gluten-free menu. 4 celiac reviews available.",
  safe: [
    { id: 1, name: "Grilled Branzino",   price: "$28", desc: "White fish, lemon, olive oil",                tag: "Low Risk",  ask: null },
    { id: 2, name: "Caprese Salad",      price: "$14", desc: "Fresh mozzarella, tomato, basil",             tag: "Low Risk",  ask: null },
    { id: 3, name: "Risotto ai Funghi",  price: "$24", desc: "Arborio rice, mushrooms, parmesan",           tag: "Low Risk",  ask: "Is the broth gluten-free?" },
    { id: 4, name: "Grilled Vegetables", price: "$12", desc: "Seasonal vegetables, olive oil",              tag: "Low Risk",  ask: null },
  ],
  caution: [
    { id: 5,  name: "Bruschetta",           price: "$10", desc: "Tomatoes, basil, garlic",           tag: "Ask First", ask: "May offer GF bread — ask the server" },
    { id: 6,  name: "Minestrone Soup",      price: "$9",  desc: "Vegetables, beans, tomato broth",   tag: "Ask First", ask: "Ask if it contains pasta or shared pot" },
    { id: 7,  name: "Panna Cotta",          price: "$11", desc: "Cream, vanilla, berry sauce",        tag: "Ask First", ask: "Ask if served with a biscuit garnish" },
    { id: 8,  name: "Spaghetti Carbonara",  price: "$22", desc: "Eggs, pancetta, pecorino",           tag: "High Risk", ask: "Contains wheat pasta" },
    { id: 9,  name: "Tiramisu",             price: "$12", desc: "Mascarpone, espresso, cocoa",        tag: "High Risk", ask: "Ladyfinger cookies contain wheat flour" },
    { id: 10, name: "Focaccia Bread",       price: "$6",  desc: "Olive oil, rosemary, sea salt",      tag: "High Risk", ask: "Made with wheat flour" },
    { id: 11, name: "Penne Arrabbiata",     price: "$20", desc: "Tomato, garlic, chili",              tag: "High Risk", ask: "Contains wheat pasta" },
    { id: 12, name: "Breaded Veal Cutlet",  price: "$32", desc: "Veal, lemon, arugula",               tag: "High Risk", ask: "Coated in wheat breadcrumbs" },
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
  const map: Record<string, { bg: string; color: string; label: string }> = {
    "Low Risk":  { bg: "#e7eae1", color: "#6d7854", label: "Low Risk" },
    "Ask First": { bg: "#fef4cd", color: "#967903", label: "Ask First" },
    "High Risk": { bg: "#FFF1F1", color: "#DA1E28", label: "Avoid" },
  };
  const s = map[tag] ?? map["Ask First"];
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded text-[12px] shrink-0"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

// ─── Single menu item row ─────────────────────────────────────────────────────
function MenuItem({ item }: { item: AnalyzedMenuItem }) {
  return (
    <div className="w-full text-left py-2 last:pb-0">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-[#100d09] text-[14px]">{item.name}</p>
            {item.price && <span className="text-[12px] text-[#846848]">{item.price}</span>}
          </div>
          <p className="text-[12px] text-[#846848]">{item.desc}</p>
          {item.ask && (
            <p className="text-[12px] text-[#967903] mt-0.5">
              {item.tag === "High Risk" ? `Contains: ${item.ask}` : `Ask: ${item.ask}`}
            </p>
          )}
        </div>
        <Tag tag={item.tag} />
      </div>
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function AccordionSection({
  open, toggle, header, count, tag, children,
}: {
  open: boolean;
  toggle: () => void;
  header: string;
  count: number;
  tag: AnalyzedMenuItem["tag"];
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 border border-[#dbcdbd] rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#FCF5E8]"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#100d09] text-[15px]" style={{ fontWeight: 500 }}>
            {header} ({count})
          </span>
          <Tag tag={tag} />
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="bg-[#FCFCFC] px-4 py-2">{children}</div>}
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

  const askFirst = results.caution.filter((i) => i.tag === "Ask First");
  const avoid    = results.caution.filter((i) => i.tag === "High Risk");

  const itemById = new Map<number, AnalyzedMenuItem>(
    [...results.safe, ...results.caution].map((i) => [i.id, i]),
  );

  const toggle = (idx: number) =>
    setOpenSection((prev) => (prev === idx ? -1 : idx));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="mb-3">
          <button
            onClick={() => nav("/scan/review")}
            className="flex items-center justify-center w-8 h-8"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <h1 className="text-[20px] font-semibold text-[#100d09] mb-0">
          Scanned Results
        </h1>

        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <h2 className="text-[#100d09]">{results.restaurant}</h2>
          <span className="px-2 py-0.5 rounded text-[13px] bg-[#f3f5f0] text-[#525a3f]">
            {results.cuisine}
          </span>
        </div>

        <div className="bg-[#f3f5f0] border border-[#b8c0a5] rounded-lg p-3 mt-2">
          <p className="text-[13px] text-[#373c2a]">{results.banner}</p>
        </div>

        {/* Sort toggle */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] text-[#423424]">Display order:</span>
          <div className="flex gap-1 bg-white rounded-md p-0.5">
            {(["By Safety", "Menu Order"] as const).map((label, i) => (
              <button
                key={label}
                onClick={() => setSortByOriginal(i === 1)}
                className={`px-3 py-1 rounded text-[12px] transition-colors ${
                  sortByOriginal === (i === 1)
                    ? "bg-[#525a3f] text-white"
                    : "text-[#423424]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-3">
        {sortByOriginal ? (
          /* ── Menu Order view ── */
          <div className="border border-[#dbcdbd] rounded-2xl overflow-hidden bg-[#FCFCFC]">
            <div className="space-y-3 px-4 py-3">
              {results.menuOrder.map((entry, idx) => {
                if (entry.type === "heading") {
                  return (
                    <p
                      key={`h-${idx}`}
                      className="text-[13px] text-[#846848] pt-2 first:pt-0"
                      style={{ fontWeight: 600 }}
                    >
                      {entry.text}
                    </p>
                  );
                }
                const item = itemById.get(entry.id!);
                if (!item) return null;
                return <MenuItem key={item.id} item={item} />;
              })}
            </div>
          </div>
        ) : (
          /* ── By Safety view ── */
          <>
            <AccordionSection
              open={openSection === 0}
              toggle={() => toggle(0)}
              header="Safe Options"
              count={results.safe.length}
              tag="Low Risk"
            >
              {results.safe.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </AccordionSection>

            <AccordionSection
              open={openSection === 1}
              toggle={() => toggle(1)}
              header="Ask First"
              count={askFirst.length}
              tag="Ask First"
            >
              {askFirst.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </AccordionSection>

            <AccordionSection
              open={openSection === 2}
              toggle={() => toggle(2)}
              header="Avoid"
              count={avoid.length}
              tag="High Risk"
            >
              {avoid.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </AccordionSection>
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

      {showChat && <AISupportScreen results={results} onClose={() => setShowChat(false)} />}
      {showAllergyCard && (
        <AllergyCardModal onClose={() => setShowAllergyCard(false)} />
      )}

      <BottomTabs />
    </div>
  );
}

// ─── Build menu summary for the system prompt ────────────────────────────────
function menuSummaryForPrompt(r: AnalysisResult): string {
  const lines = [`Restaurant: ${r.restaurant} (${r.cuisine})`];
  if (r.safe.length)
    lines.push(`Safe items: ${r.safe.map((i) => i.name).join(", ")}`);
  const ask = r.caution.filter((i) => i.tag === "Ask First");
  if (ask.length)
    lines.push(`Ask-first items: ${ask.map((i) => `${i.name} — ${i.ask}`).join("; ")}`);
  const avoid = r.caution.filter((i) => i.tag === "High Risk");
  if (avoid.length)
    lines.push(`Avoid items: ${avoid.map((i) => `${i.name} — ${i.ask}`).join("; ")}`);
  return lines.join("\n");
}

function generateSuggestions(r: AnalysisResult): string[] {
  const suggestions: string[] = [];
  const askItems = r.caution.filter((i) => i.tag === "Ask First");
  const avoidItems = r.caution.filter((i) => i.tag === "High Risk");

  if (askItems.length > 0)
    suggestions.push(`Is the ${askItems[0].name} safe for me?`);
  if (r.safe.length > 1)
    suggestions.push(`Which safe dish do you recommend?`);
  if (askItems.length > 0)
    suggestions.push(`What should I ask the server about ${askItems[Math.min(1, askItems.length - 1)].name}?`);
  if (avoidItems.length > 0)
    suggestions.push(`Any substitute for ${avoidItems[0].name}?`);
  if (suggestions.length < 3)
    suggestions.push("What should I tell the server about my needs?");

  return suggestions.slice(0, 3);
}

// ─── Chat message types ──────────────────────────────────────────────────────
type ChatRole = "user" | "assistant";
interface ChatMsg {
  role: ChatRole;
  content: string;
  image?: string;
}

// ─── AI Support overlay ──────────────────────────────────────────────────────
function AISupportScreen({
  results,
  onClose,
}: {
  results: AnalysisResult;
  onClose: () => void;
}) {
  const { profile } = useApp();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const suggestions = generateSuggestions(results);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const sendMessage = async (text: string) => {
    if ((!text.trim() && !pendingImage) || loading) return;

    const userMsg: ChatMsg = { role: "user", content: text.trim(), image: pendingImage ?? undefined };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setPendingImage(null);
    setLoading(true);
    scrollToBottom();

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const systemPrompt = [
      buildSystemPrompt(profile),
      "",
      "Here is the scanned menu the user is currently looking at:",
      menuSummaryForPrompt(results),
      "",
      "Answer questions about this menu. Be concise (2-4 sentences). If a dish might contain gluten, always err on the side of caution.",
    ].join("\n");

    const apiMessages: Array<{ role: string; content: unknown }> = [
      { role: "system", content: systemPrompt },
    ];

    for (const m of next) {
      if (m.role === "user") {
        if (m.image) {
          apiMessages.push({
            role: "user",
            content: [
              { type: "text", text: m.content || "What can you tell me about this?" },
              { type: "image_url", image_url: { url: m.image, detail: "low" } },
            ],
          });
        } else {
          apiMessages.push({ role: "user", content: m.content });
        }
      } else {
        apiMessages.push({ role: "assistant", content: m.content });
      }
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: apiMessages,
          max_tokens: 512,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "API error");
      }

      const data = await res.json();
      const reply = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd]">
        <div className="mb-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <h1 className="text-[20px] font-semibold text-[#100d09]">AI Support</h1>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {/* Intro */}
        <p className="text-[#423424] text-[14px]">
          I see you're looking at {results.restaurant}'s menu. What would you like to know?
        </p>

        {/* Dynamic suggestions */}
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 px-3 py-1.5 bg-[#f3f5f0] text-[#525a3f] rounded-full text-[13px] active:bg-[#e7eae1] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                m.role === "user"
                  ? "bg-[#525a3f] text-white rounded-br-md"
                  : "bg-[#f3f5f0] text-[#100d09] rounded-bl-md"
              }`}
            >
              {m.image && (
                <img
                  src={m.image}
                  alt="Uploaded"
                  className="w-full max-w-[200px] rounded-lg mb-2"
                />
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f3f5f0] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#525a3f]" />
              <span className="text-[13px] text-[#846848]">Thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#dbcdbd]">
            <img src={pendingImage} alt="Pending" className="w-full h-full object-cover" />
            <button
              onClick={() => setPendingImage(null)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4183d] rounded-full flex items-center justify-center"
            >
              <span className="text-white text-[10px] leading-none font-bold">✕</span>
            </button>
          </div>
          <span className="text-[12px] text-[#846848]">Image attached</span>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-[#dbcdbd] px-4 py-3 pb-6 flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImagePick}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="w-10 h-10 shrink-0 rounded-full bg-[#fcf5e9] flex items-center justify-center active:bg-[#f3f5f0] transition-colors disabled:opacity-40"
        >
          <ImagePlus size={18} className="text-[#525a3f]" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 bg-[#fcf5e9] rounded-full px-4 py-2.5 text-[14px] outline-none disabled:opacity-60"
          placeholder="Ask about this menu…"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || (!input.trim() && !pendingImage)}
          className="w-10 h-10 shrink-0 rounded-full bg-[#525a3f] flex items-center justify-center text-white disabled:opacity-40 active:scale-95 transition-transform"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Allergy card modal ───────────────────────────────────────────────────────
function AllergyCardModal({ onClose }: { onClose: () => void }) {
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    setIsAnimating(true);
  }, []);

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
        <AllergyCard onClose={onClose} />
      </div>
    </>
  );
}
