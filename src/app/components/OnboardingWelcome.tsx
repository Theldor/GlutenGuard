import { useNavigate } from "react-router";
import { Shield } from "lucide-react";

export function OnboardingWelcome() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col h-full bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-[#0F62FE] flex items-center justify-center">
          <Shield size={40} className="text-white" />
        </div>
        <h1 className="text-[#161616] tracking-tight">GlutenGuard</h1>
        <p className="text-[#525252] text-center max-w-[260px]">Dine with confidence.</p>
      </div>
      <div className="pb-10 flex flex-col gap-3">
        <button
          onClick={() => nav("/onboarding/1")}
          className="w-full py-3.5 bg-[#0F62FE] text-white rounded-lg"
        >
          Get Started
        </button>
        <button 
          onClick={() => nav("/explore")}
          className="w-full py-3 text-[#0F62FE] bg-transparent"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}