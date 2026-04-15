import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { useApp } from "../store";

export function OnboardingWelcome() {
  const nav = useNavigate();
  const { restoreAccount } = useApp();
  return (
    <div className="flex flex-col h-full bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-[#525a3f] flex items-center justify-center">
          <Shield size={40} className="text-white" />
        </div>
        <h1 className="text-[#100d09] tracking-tight">Sterling</h1>
        <p className="text-[#423424] text-center max-w-[260px]">Dine with confidence.</p>
      </div>
      <div className="pb-10 flex flex-col gap-3">
        <button
          onClick={() => nav("/onboarding/1")}
          className="w-full py-3.5 bg-[#525a3f] text-white rounded-lg"
        >
          Get Started
        </button>
        <button 
          onClick={() => {
            const restored = restoreAccount();
            if (restored) {
              nav("/explore");
            } else {
              nav("/onboarding/1");
            }
          }}
          className="w-full py-3 text-[#525a3f] bg-transparent"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}