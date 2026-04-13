import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Globe, ChevronDown, ChevronUp, Pencil, Sparkles, Info } from "lucide-react";
import { BottomTabs } from "./BottomTabs";

const defaultMessage = `Dear Trattoria Vesuvio,

My name is [Your Name], and I have severe celiac disease. I'm planning to dine at your restaurant and wanted to reach out in advance to ensure a safe experience.

Due to my condition, I must strictly avoid all sources of gluten, including wheat, barley, rye, spelt, and any derivatives such as soy sauce, malt vinegar, or flour-dusted surfaces. Even trace amounts of cross-contact can cause serious health complications for me.

I'd be grateful if you could help me understand:

1. Do you have a dedicated gluten-free preparation area or kitchen?
2. Are your staff trained on celiac disease and cross-contamination protocols?
3. Can sauces, marinades, and dressings be confirmed gluten-free?
4. Is shared frying oil or cooking water used for both gluten and gluten-free items?
5. Are gluten-free pasta, bread, or dessert options available?

I truly appreciate your time and care. I'm happy to provide additional medical documentation or discuss any accommodations in advance.

Warm regards,
[Your Name]`;

const languages = [
  "Italian (auto-detected)",
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Japanese",
];

export function ContactRestaurant() {
  const nav = useNavigate();
  const [toEmail, setToEmail] = useState("info@trattoriavesuvio.it");
  const [channel, setChannel] = useState<"Email" | "Call">("Email");
  const [language, setLanguage] = useState("Italian (auto-detected)");
  const [langOpen, setLangOpen] = useState(false);
  const [subject, setSubject] = useState("Dining with severe celiac disease — a few questions");
  const [message, setMessage] = useState(defaultMessage);
  const [sharingOpen, setSharingOpen] = useState(false);

  const chipButtons = ["Rewrite", "Make shorter", "More formal", "Suggest questions"];

  return (
    <div className="flex flex-col h-full bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-[#e0e0e0]">
        <button onClick={() => nav(-1)} className="mb-3">
          <ArrowLeft size={20} className="text-[#161616]" />
        </button>
        <h1 className="text-[#161616] text-[20px]" style={{ fontWeight: 600 }}>Contact Trattoria Vesuvio</h1>
        <p className="text-[13px] text-[#6f6f6f] mt-1">We'll help you reach out. You review and send.</p>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Restaurant card */}
        <div className="mx-4 mt-4 bg-white rounded-lg p-3 border border-[#e0e0e0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#161616] text-[15px]" style={{ fontWeight: 600 }}>Trattoria Vesuvio</p>
              <p className="text-[13px] text-[#6f6f6f] mt-0.5">Italian · Rome, Italy</p>
            </div>
            <span className="px-2 py-0.5 bg-[#FFF8E1] text-[#B28600] rounded text-[12px]" style={{ fontWeight: 500 }}>Unverified</span>
          </div>
        </div>

        {/* Form */}
        <div className="px-4 mt-4 space-y-4 pb-4">
          {/* To */}
          <div>
            <label className="block text-[12px] text-[#6f6f6f] mb-1">To</label>
            <input
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2.5 text-[14px] text-[#161616] outline-none focus:border-[#0F62FE]"
            />
          </div>

          {/* Channel */}
          <div>
            <label className="block text-[12px] text-[#6f6f6f] mb-1">Channel</label>
            <div className="flex bg-[#e0e0e0] rounded p-0.5">
              {(["Email", "Call"] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`flex-1 py-2 rounded text-[14px] transition-colors ${channel === ch ? "bg-white text-[#161616] shadow-sm" : "text-[#6f6f6f]"}`}
                  style={{ fontWeight: channel === ch ? 500 : 400 }}
                >
                  {ch}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6f6f6f] mt-1">Switch to a live AI-assisted call anytime.</p>
          </div>

          {/* Language */}
          <div className="relative">
            <label className="block text-[12px] text-[#6f6f6f] mb-1">Language</label>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2.5 text-[14px] text-[#161616] flex items-center gap-2 outline-none"
            >
              <Globe size={16} className="text-[#6f6f6f] shrink-0" />
              <span className="flex-1 text-left">{language}</span>
              <ChevronDown size={16} className="text-[#6f6f6f]" />
            </button>
            {langOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-[#e0e0e0] rounded shadow-lg max-h-48 overflow-auto">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLanguage(l); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-[14px] hover:bg-[#f4f4f4] ${language === l ? "text-[#0F62FE]" : "text-[#161616]"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[#6f6f6f] mt-1">We'll translate your message automatically.</p>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[12px] text-[#6f6f6f] mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2.5 text-[14px] text-[#161616] outline-none focus:border-[#0F62FE]"
            />
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] text-[#6f6f6f]">Message</label>
              <span className="px-1.5 py-0.5 bg-[#E0E0E0] text-[#6f6f6f] rounded text-[11px]">Draft</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2.5 text-[14px] text-[#161616] outline-none focus:border-[#0F62FE] resize-none"
            />
          </div>

          {/* AI toolbar */}
          <div className="flex flex-wrap gap-2">
            {chipButtons.map((label) => (
              <button
                key={label}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-[#e0e0e0] rounded-full text-[12px] text-[#393939] hover:bg-[#e8e8e8] transition-colors"
              >
                <Sparkles size={12} className="text-[#0F62FE]" />
                {label}
              </button>
            ))}
          </div>

          {/* Sharing section */}
          <div className="bg-white border border-[#e0e0e0] rounded">
            <button
              onClick={() => setSharingOpen(!sharingOpen)}
              className="w-full flex items-center justify-between px-3 py-3"
            >
              <span className="text-[14px] text-[#161616]" style={{ fontWeight: 500 }}>What we're sharing about you</span>
              {sharingOpen ? <ChevronUp size={18} className="text-[#6f6f6f]" /> : <ChevronDown size={18} className="text-[#6f6f6f]" />}
            </button>
            {sharingOpen && (
              <div className="border-t border-[#e0e0e0] px-3 py-2 space-y-3">
                {[
                  { label: "Severity", value: "Severe celiac disease" },
                  { label: "Must-avoid list", value: "Wheat, barley, rye, spelt, malt, soy sauce" },
                  { label: "Preferred proof points", value: "Medical documentation, allergy card" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] text-[#6f6f6f]">{item.label}</p>
                      <p className="text-[14px] text-[#161616]">{item.value}</p>
                    </div>
                    <button className="mt-1 p-1">
                      <Pencil size={14} className="text-[#6f6f6f]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info banner */}
          <div className="flex gap-2.5 bg-[#EDF5FF] rounded p-3">
            <Info size={16} className="text-[#0F62FE] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#161616]">
              You'll review the final message before it's sent. GlutenGuard never sends anything without your OK.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="bg-white border-t border-[#e0e0e0] px-4 py-3 flex gap-3">
        <button className="flex-1 py-3 rounded border border-[#0F62FE] text-[#0F62FE] text-[14px]" style={{ fontWeight: 500 }}>
          Save draft
        </button>
        <button className="flex-1 py-3 rounded bg-[#0F62FE] text-white text-[14px]" style={{ fontWeight: 500 }}>
          Review &amp; send
        </button>
      </div>

      <BottomTabs />
    </div>
  );
}
