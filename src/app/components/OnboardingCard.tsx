import { useNavigate } from "react-router";
import { useApp } from "../store";
import { ArrowLeft } from "lucide-react";

const symptomLabels = ["Rarely", "Sometimes", "Always", "Severely"];
const symptomColors = ["#6d7854", "#fac905", "#c8a104", "#DA1E28"];

export function OnboardingCard() {
  const nav = useNavigate();
  const { profile, setOnboardingComplete } = useApp();
  const symptomLevel = Math.max(0, profile.symptomatic);
  const color = symptomColors[symptomLevel];

  const back = () => {
    nav("/onboarding/4");
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 pt-6">
      {/* Back button */}
      <button
        onClick={back}
        className="flex items-center gap-2 text-[#525a3f] mb-4 -ml-2 p-2"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h2 className="text-[#100d09] mb-6">Here's your allergy card.</h2>

      <div className="flex-1 overflow-auto">
        <div className="rounded-xl border border-[#dbcdbd] overflow-hidden shadow-sm">
          <div className="h-2" style={{ background: color }} />
          <div className="p-5">
            <p className="text-[#846848] text-[13px] mb-1">Name</p>
            <p className="text-[#100d09] mb-4">{profile.name}</p>

            <div className="flex gap-1 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full"
                  style={{ background: i <= symptomLevel ? color : "#dbcdbd" }}
                />
              ))}
            </div>
            <p className="text-[13px] text-[#846848] mb-4">
              Symptomatic: {symptomLabels[symptomLevel]}
            </p>

            <p className="text-[#100d09] mb-3" style={{ fontWeight: 600 }}>
              {profile.condition || "I have celiac disease"}
            </p>
            <p className="text-[#423424] text-[14px] mb-3">
              I cannot eat anything containing wheat, barley, rye, or oats.
              Cross-contamination is dangerous for me.
            </p>

            <p className="text-[#100d09] text-[14px] mb-1" style={{ fontWeight: 500 }}>
              What I CAN eat:
            </p>
            <p className="text-[#423424] text-[14px]">
              Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#fcf5e9] rounded-full">
              <span className="text-[13px]">🇬🇧</span>
              <span className="text-[13px] text-[#423424]">English</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4 flex flex-col gap-2">
        <button
          onClick={() => {
            setOnboardingComplete(true);
            nav("/scan");
          }}
          className="w-full py-3.5 bg-[#525a3f] text-white rounded-lg"
        >
          Looks good — let's go
        </button>
        <button
          onClick={() => nav("/edit-card")}
          className="w-full py-3 text-[#525a3f] bg-transparent"
        >
          Edit my card
        </button>
      </div>
    </div>
  );
}
