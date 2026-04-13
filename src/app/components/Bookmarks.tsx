import { useNavigate } from "react-router";
import { ArrowLeft, Star, Bookmark } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Mock bookmarked restaurants - will be empty initially
const MOCK_BOOKMARKED_RESTAURANTS = [
  {
    id: "1",
    name: "Perbacco",
    cuisine: "Italian",
    type: "green" as const,
    rating: 4.7,
    reviews: 28,
    dist: "0.4 mi",
    image: "https://images.unsplash.com/photo-1712746784067-e9e1bd86c043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJdGFsaWFuJTIwcmVzdGF1cmFudCUyMHBhc3RhJTIwZGlzaHxlbnwxfHx8fDE3NzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Dedicated GF Kitchen", "Staff Trained"],
    priceLevel: "$$$",
    safeItems: 12,
  },
  {
    id: "6",
    name: "Nopa",
    cuisine: "American",
    type: "green" as const,
    rating: 4.8,
    reviews: 34,
    dist: "1.2 mi",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3MzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Dedicated GF Kitchen", "Staff Trained"],
    priceLevel: "$$$",
    safeItems: 14,
  },
];

const badgeConfig: Record<string, { bg: string; fg: string; label: string }> = {
  green: { bg: "#DEFBE6", fg: "#198038", label: "Celiac-Appropriate" },
  yellow: { bg: "#FFF8E1", fg: "#8E6A00", label: "GF Menu Available" },
  gray: { bg: "#F4F4F4", fg: "#6f6f6f", label: "Not Rated" },
};

export function Bookmarks() {
  const nav = useNavigate();
  
  // Toggle this to see empty state
  const hasBookmarks = MOCK_BOOKMARKED_RESTAURANTS.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => nav("/explore")} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[20px] font-semibold text-[#161616]">Bookmarked Restaurants</h2>
        </div>
      </div>

      {hasBookmarks ? (
        /* ==================== BOOKMARKED RESTAURANTS LIST ==================== */
        <div className="flex-1 overflow-auto px-4 pt-4 pb-24">
          {MOCK_BOOKMARKED_RESTAURANTS.map((r) => (
            <div
              key={r.id}
              onClick={() => nav("/explore/restaurant")}
              className="w-full mb-4 cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                <ImageWithFallback
                  src={r.image}
                  alt={r.name}
                  className="w-full h-44 object-cover"
                />
                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {r.type === "green" && (
                    <span className="px-2 py-1 rounded-md text-[11px] bg-[#198038] text-white" style={{ fontWeight: 500 }}>
                      ✓ Celiac-Appropriate
                    </span>
                  )}
                  {r.type === "yellow" && (
                    <span className="px-2 py-1 rounded-md text-[11px] bg-[#8E6A00] text-white" style={{ fontWeight: 500 }}>
                      GF Menu Available
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <Bookmark
                      size={16}
                      className="text-[#0F62FE] fill-[#0F62FE]"
                    />
                  </button>
                </div>
              </div>
              <div className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-[#161616] text-[15px]" style={{ fontWeight: 600 }}>{r.name}</p>
                  <div className="flex items-center gap-1 bg-[#F4F4F4] rounded-md px-1.5 py-0.5">
                    <Star size={12} className="text-[#F1C21B] fill-[#F1C21B]" />
                    <span className="text-[13px] text-[#161616]" style={{ fontWeight: 500 }}>{r.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-[#6f6f6f]">({r.reviews})</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#6f6f6f] mt-0.5">
                  {r.cuisine} · {r.priceLevel} · {r.dist}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {r.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[11px] bg-[#DEFBE6] text-[#198038]">
                      {t}
                    </span>
                  ))}
                  {r.safeItems > 0 && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#EDF5FF] text-[#0F62FE]">
                      {r.safeItems} safe items
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ==================== EMPTY STATE ==================== */
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24">
          <div className="w-20 h-20 rounded-full bg-[#F4F4F4] flex items-center justify-center mb-4">
            <Bookmark size={32} className="text-[#a8a8a8]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#161616] mb-2">No bookmarks yet</h3>
          <p className="text-[14px] text-[#6f6f6f] text-center mb-6">
            Start bookmarking restaurants you want to visit by tapping the bookmark icon on restaurant cards.
          </p>
          <button
            onClick={() => nav("/explore")}
            className="px-6 py-3 bg-[#0F62FE] text-white rounded-lg text-[15px]"
            style={{ fontWeight: 500 }}
          >
            Explore Restaurants
          </button>
        </div>
      )}

      <BottomTabs />
    </div>
  );
}
