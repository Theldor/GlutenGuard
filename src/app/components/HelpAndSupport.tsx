import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { BottomTabs } from "./BottomTabs";

const sections: { title: string; body: string }[] = [
  {
    title: "What Sterling does",
    body: "Sterling helps you communicate your celiac needs to restaurants and gather information about their practices. We translate your safety profile, ask the right questions, and organize what we learn so you can make informed decisions about where to eat.",
  },
  {
    title: "What we can't guarantee",
    body: "The information in Sterling comes from restaurant staff, public menus, and community reports. We don't inspect kitchens, and we can't verify that a restaurant follows through on what they tell us. A \u201Cceliac-appropriate\u201D label means a restaurant gave answers consistent with safe celiac practices \u2014 not that we've certified them.",
  },
  {
    title: "About translations",
    body: "When Sterling writes to a restaurant in another language, we do our best to accurately convey cross-contamination terms and celiac-specific vocabulary. Translation is not perfect, and specialized food preparation terms may vary by region. If you're unsure, we recommend confirming key details in person when you arrive.",
  },
  {
    title: "This is not medical advice",
    body: "Sterling is a communication and research tool. It is not a medical device, diagnostic service, or substitute for guidance from your doctor or dietitian. Always follow the advice of your healthcare provider.",
  },
  {
    title: "You make the final call",
    body: "Every message Sterling sends is reviewed and approved by you first. We never contact a restaurant without your permission, and we encourage you to use your own judgment alongside the information we provide \u2014 especially for your first visit to a new restaurant.",
  },
  {
    title: "Information can change",
    body: "Restaurants update menus, change suppliers, and rotate staff. Information in Sterling reflects what was reported at the time of contact. We recommend re-confirming with the restaurant if your last outreach was more than a few weeks ago.",
  },
  {
    title: "If something doesn't seem right",
    body: "If you receive information through Sterling that turns out to be inaccurate, or if you have a reaction after dining at a restaurant in our database, please let us know through the \u201CReport an issue\u201D button on any restaurant page. Your reports help keep the community safe.",
  },
];

export function HelpAndSupport() {
  const nav = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#faf8f5]">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => nav(-1)}
          className="p-1.5 rounded-full hover:bg-[#FCF5E8] transition-colors"
        >
          <ArrowLeft size={22} className="text-[#100d09]" />
        </button>
        <h1 className="text-[20px] text-[#100d09]" style={{ fontWeight: 700 }}>
          Help & Support
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2
                className="text-[16px] text-[#100d09] mb-2"
                style={{ fontWeight: 600 }}
              >
                {section.title}
              </h2>
              <p className="text-[14px] text-[#423424] leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
