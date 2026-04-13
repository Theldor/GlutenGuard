import { useNavigate, useLocation } from "react-router";
import { Camera, Map, Plane, User } from "lucide-react";

const tabs = [
  { path: "/scan", label: "Scan", icon: Camera },
  { path: "/explore", label: "Explore", icon: Map },
  { path: "/travel", label: "Trips", icon: Plane },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomTabs() {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div className="flex items-center justify-around border-t border-[#dbcdbd] bg-white py-2 shrink-0">
      {tabs.map((t) => {
        const active = loc.pathname.startsWith(t.path);
        return (
          <button
            key={t.path}
            onClick={() => nav(t.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${active ? "text-[#525a3f]" : "text-[#846848]"}`}
          >
            <t.icon size={22} />
            <span className="text-[11px]">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}