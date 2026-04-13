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
  green: { bg: "#e7eae1", fg: "#6d7854", label: "Celiac-Appropriate" },
  yellow: { bg: "#fef4cd", fg: "#967903", label: "GF Menu Available" },
  gray: { bg: "#fcf5e9", fg: "#846848", label: "Not Rated" },
};

export function Bookmarks() {
  const nav = useNavigate();
  
  // Toggle this to see empty state
  const hasBookmarks = MOCK_BOOKMARKED_RESTAURANTS.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => nav("/explore")} className="flex items-center justify-center w-8 h-8">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[20px] font-semibold text-[#100d09]">Bookmarked Restaurants</h2>
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
                    <span className="px-2 py-1 rounded-md text-[11px] bg-[#6d7854] text-white" style={{ fontWeight: 500 }}>
                      ✓ Celiac-Appropriate
                    </span>
                  )}
                  {r.type === "yellow" && (
                    <span className="px-2 py-1 rounded-md text-[11px] bg-[#967903] text-white" style={{ fontWeight: 500 }}>
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
                      className="text-[#525a3f] fill-[#525a3f]"
                    />
                  </button>
                </div>
              </div>
              <div className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-[#100d09] text-[15px]" style={{ fontWeight: 600 }}>{r.name}</p>
                  <div className="flex items-center gap-1 bg-[#fcf5e9] rounded-md px-1.5 py-0.5">
                    <Star size={12} className="text-[#fac905] fill-[#fac905]" />
                    <span className="text-[13px] text-[#100d09]" style={{ fontWeight: 500 }}>{r.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-[#846848]">({r.reviews})</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#846848] mt-0.5">
                  {r.cuisine} · {r.priceLevel} · {r.dist}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {r.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[11px] bg-[#e7eae1] text-[#6d7854]">
                      {t}
                    </span>
                  ))}
                  {r.safeItems > 0 && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#f3f5f0] text-[#525a3f]">
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
          <div className="w-20 h-20 rounded-full bg-[#fcf5e9] flex items-center justify-center mb-4">
            <Bookmark size={32} className="text-[#b79b7b]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#100d09] mb-2">No bookmarks yet</h3>
          <p className="text-[14px] text-[#846848] text-center mb-6">
            Start bookmarking restaurants you want to visit by tapping the bookmark icon on restaurant cards.
          </p>
          <button
            onClick={() => nav("/explore")}
            className="px-6 py-3 bg-[#525a3f] text-white rounded-lg text-[15px]"
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
