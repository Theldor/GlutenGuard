import { useNavigate } from "react-router";
import { ArrowLeft, Bookmark, Share2, Star, Copy, Mail, Phone, Wallet, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const IMG = "https://images.unsplash.com/photo-1630567396007-eb0fb467f49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJdGFsaWFuJTIwcmVzdGF1cmFudCUyMGludGVyaW9yJTIwd2FybXxlbnwxfHx8fDE3NzU0OTcyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const reviews = [
  { name: "Sarah M.", severity: "Severe celiac", rating: 5, text: "Best GF restaurant I've ever been to. Staff is incredibly knowledgeable." },
  { name: "Marco R.", severity: "Moderate celiac", rating: 5, text: "Dedicated kitchen means zero worry. The pasta is indistinguishable from regular." },
];

const menuHighlights = [
  { name: "GF Pasta Carbonara", desc: "Corn-based pasta", risk: "Low Risk" },
  { name: "Grilled Sea Bass", desc: "Fresh catch, lemon butter", risk: "Low Risk" },
  { name: "Tiramisu GF", desc: "Made with GF ladyfingers", risk: "Low Risk" },
];

export function RestaurantDetail() {
  const nav = useNavigate();

  // Email template for contacting restaurant
  const emailSubject = "Questions about gluten-free dining options";
  const emailBody = `Hello,

I have celiac disease and am interested in dining at your restaurant. I wanted to reach out ahead of time to ensure a safe dining experience. Could you please help me with the following questions?

1. Do you have a dedicated gluten-free kitchen or separate prep areas?
2. How do you prevent cross-contamination with gluten-containing ingredients?
3. Are your staff members trained on celiac disease and gluten-free food handling?
4. Do you have gluten-free options for pasta, bread, and desserts?
5. Can you accommodate special requests for those with severe gluten allergies?

Thank you for your time. I look forward to hearing from you and hopefully dining at your establishment.

Best regards`;

  const mailtoLink = `mailto:restaurant@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const phoneNumber = "tel:+1234567890";

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="relative">
        <ImageWithFallback src={IMG} alt="Restaurant" className="w-full h-48 object-cover" />
        <button onClick={() => nav(-1)} className="absolute top-4 left-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[#161616]">Senza Gluten</h2>
          <span className="px-2 py-0.5 bg-[#EDF5FF] text-[#0F62FE] rounded text-[12px]">Italian</span>
          <span className="text-[13px] text-[#6f6f6f]">0.3 mi</span>
        </div>

        <div className="bg-[#DEFBE6] rounded-lg p-3 mt-3 mb-4">
          <p className="text-[#198038] text-[14px]" style={{ fontWeight: 600 }}>Celiac-Appropriate</p>
          <p className="text-[13px] text-[#198038] mt-1">
            Verified: Dedicated gluten-free kitchen, separate prep areas, staff trained on cross-contamination.
          </p>
        </div>

        <Section title="What celiac diners say">
          {reviews.map((r) => (
            <div key={r.name} className="bg-[#F4F4F4] rounded-lg p-3 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-[#F1C21B] fill-[#F1C21B]" />
                  ))}
                </div>
                <span className="text-[12px] text-[#6f6f6f]">{r.severity}</span>
              </div>
              <p className="text-[14px] text-[#161616]" style={{ fontWeight: 500 }}>{r.name}</p>
              <p className="text-[13px] text-[#525252] mt-1">{r.text}</p>
            </div>
          ))}
        </Section>

        <Section title="Menu highlights">
          {menuHighlights.map((m) => (
            <div key={m.name} className="flex justify-between items-center bg-[#F4F4F4] rounded-lg p-3 mb-2">
              <div>
                <p className="text-[14px] text-[#161616]">{m.name}</p>
                <p className="text-[12px] text-[#6f6f6f]">{m.desc}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] bg-[#DEFBE6] text-[#198038]">{m.risk}</span>
            </div>
          ))}
        </Section>

        <Section title="Before you go">
          <p className="text-[14px] text-[#161616] mb-2" style={{ fontWeight: 500 }}>Check with the restaurant:</p>
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => nav("/explore/contact")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#EDF5FF] text-[#0F62FE] rounded-lg text-[14px]"
              style={{ fontWeight: 500 }}
            >
              <Mail size={16} /> Email Questions
            </button>
            <a 
              href={phoneNumber}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e0e0e0] rounded-lg text-[#161616] text-[14px]"
              style={{ fontWeight: 500 }}
            >
              <Phone size={16} /> Call
            </a>
          </div>
          
          <p className="text-[14px] text-[#161616] mb-2" style={{ fontWeight: 500 }}>Questions to ask when you arrive:</p>
          <ol className="list-decimal list-inside text-[13px] text-[#525252] space-y-1 mb-4">
            <li>Can you confirm you have a dedicated GF kitchen?</li>
            <li>Are your GF pasta dishes prepared separately?</li>
          </ol>
          <p className="text-[14px] text-[#161616] mb-2" style={{ fontWeight: 500 }}>Reservation note:</p>
          <div className="bg-[#F4F4F4] rounded-lg p-3 flex items-start gap-2">
            <p className="text-[13px] text-[#525252] flex-1">
              One guest has celiac disease and requires gluten-free preparation with no cross-contamination.
            </p>
            <button className="shrink-0 text-[#0F62FE]"><Copy size={16} /></button>
          </div>
        </Section>
      </div>

      {/* Fixed bottom action buttons - matching AllergyCard layout */}
      <div className="border-t border-[#e0e0e0] px-4 py-3 space-y-3 bg-white">
        {/* Primary button - Allergy Card */}
        <button
          onClick={() => nav("/allergy-card")}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F62FE] rounded-lg text-white text-[15px]"
          style={{ fontWeight: 500 }}
        >
          <Wallet size={18} /> View My Allergy Card
        </button>

        {/* Secondary buttons - Chat and other actions */}
        <div className="flex gap-3">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#e0e0e0] rounded-lg text-[#161616] text-[15px]"
            style={{ fontWeight: 500 }}
          >
            <MessageCircle size={16} /> Chat
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#161616]">
            <Bookmark size={18} />
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[#e0e0e0] rounded-lg text-[#161616]">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[#161616] mb-2" style={{ fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  );
}