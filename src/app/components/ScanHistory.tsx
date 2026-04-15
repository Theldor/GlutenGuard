import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { useApp, type ScanHistoryEntry } from "../store";
import { BottomTabs } from "./BottomTabs";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function HistoryRow({ entry }: { entry: ScanHistoryEntry }) {
  const nav = useNavigate();

  return (
    <button
      onClick={() => nav("/scan/results", { state: { results: entry.results } })}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-[#dbcdbd] text-left hover:bg-[#FCF5E8] active:scale-[0.98] transition-all"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-[#100d09] truncate" style={{ fontWeight: 600 }}>
          {entry.restaurant}
        </p>
        <p className="text-[12px] text-[#846848] mt-0.5 flex items-center gap-1">
          <Clock size={12} className="shrink-0" />
          {formatDate(entry.scannedAt)}
          {entry.cuisine ? ` · ${entry.cuisine}` : ""}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {entry.safeCount > 0 && (
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#e8f0dc] text-[#3d5a1e]" style={{ fontWeight: 500 }}>
              {entry.safeCount} safe
            </span>
          )}
          {entry.cautionCount > 0 && (
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#FFF3D0] text-[#92700c]" style={{ fontWeight: 500 }}>
              {entry.cautionCount} risky
            </span>
          )}
          {entry.avoidCount > 0 && (
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#FFE0E0] text-[#9b1c1c]" style={{ fontWeight: 500 }}>
              {entry.avoidCount} avoid
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={20} className="text-[#A6A6A6] shrink-0" />
    </button>
  );
}

export function ScanHistory() {
  const nav = useNavigate();
  const { scanHistory } = useApp();

  return (
    <div className="flex flex-col h-full bg-[#faf8f5]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => nav(-1)}
          className="p-1.5 rounded-full hover:bg-[#FCF5E8] transition-colors"
        >
          <ArrowLeft size={22} className="text-[#100d09]" />
        </button>
        <h1 className="text-[20px] text-[#100d09]" style={{ fontWeight: 700 }}>
          Scanned History
        </h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {scanHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-60">
            <Clock size={40} className="text-[#A6A6A6]" />
            <p className="text-[15px] text-[#846848]" style={{ fontWeight: 500 }}>
              No scanned menus yet
            </p>
            <p className="text-[13px] text-[#A6A6A6]">
              Scan a restaurant menu to see it here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {scanHistory.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}
