import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, List, MapIcon, Star, Clock, Heart, ChevronRight, Bookmark, MapPin } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../store";

const filters = ["All", "Celiac-Appropriate", "GF Menu", "Near Me", "Good for Groups", "Top Rated", "Open Now"];
const cuisineFilters = ["All Cuisines", "Italian", "Café", "Pizza", "Asian", "American"];
const sortOptions = [
  { key: "rating" as const, label: "Top Rated" },
  { key: "distance" as const, label: "Nearest" },
  { key: "safeItems" as const, label: "Most Safe Items" },
];

// Default to San Francisco
const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lon: number;
  cuisine: string;
  type: "green" | "yellow" | "gray";
  rating: number;
  reviews: number;
  preview: string;
  dist: string;
  image: string;
  deliveryTime: string;
  deliveryFee: string;
  tags: string[];
  priceLevel: string;
  featured: boolean;
  safeItems: number;
}

const badgeConfig: Record<string, { bg: string; fg: string; label: string }> = {
  green: { bg: "#e7eae1", fg: "#6d7854", label: "Celiac-Appropriate" },
  yellow: { bg: "#fef4cd", fg: "#967903", label: "GF Menu Available" },
  gray: { bg: "#fcf5e9", fg: "#846848", label: "Not Rated" },
};

// Mock restaurant data - SF area
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Perbacco",
    lat: 37.7897,
    lon: -122.4023,
    cuisine: "Italian",
    type: "green",
    rating: 4.7,
    reviews: 28,
    preview: "Dedicated GF kitchen. Highly recommended.",
    dist: "0.4 mi",
    image: "https://images.unsplash.com/photo-1712746784067-e9e1bd86c043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJdGFsaWFuJTIwcmVzdGF1cmFudCUyMHBhc3RhJTIwZGlzaHxlbnwxfHx8fDE3NzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "25–35 min",
    deliveryFee: "$0 delivery",
    tags: ["Dedicated GF Kitchen", "Staff Trained"],
    priceLevel: "$$$",
    featured: true,
    safeItems: 12,
  },
  {
    id: "2",
    name: "Flour + Water",
    lat: 37.7599,
    lon: -122.4148,
    cuisine: "Italian",
    type: "green",
    rating: 4.6,
    reviews: 22,
    preview: "Amazing GF pasta options. Chef is knowledgeable.",
    dist: "0.8 mi",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzM1NTAyNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "30–40 min",
    deliveryFee: "$2.99 delivery",
    tags: ["Dedicated GF Kitchen"],
    priceLevel: "$$$",
    featured: false,
    safeItems: 9,
  },
  {
    id: "3",
    name: "The Cheesecake Factory",
    lat: 37.7847,
    lon: -122.4068,
    cuisine: "American",
    type: "yellow",
    rating: 4.3,
    reviews: 15,
    preview: "GF menu available, ask about prep.",
    dist: "0.5 mi",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2VjYWtlfGVufDF8fHx8MTczNTUwMjQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "20–30 min",
    deliveryFee: "$1.99 delivery",
    tags: ["GF Menu"],
    priceLevel: "$$",
    featured: false,
    safeItems: 8,
  },
  {
    id: "4",
    name: "Ristobar",
    lat: 37.7977,
    lon: -122.4082,
    cuisine: "Italian",
    type: "yellow",
    rating: 4.2,
    reviews: 11,
    preview: "GF menu available, ask about prep.",
    dist: "0.6 mi",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXNvdHRvfGVufDF8fHx8MTczNTUwMjQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "25–40 min",
    deliveryFee: "$0 delivery",
    tags: ["GF Menu"],
    priceLevel: "$$",
    featured: false,
    safeItems: 6,
  },
  {
    id: "5",
    name: "Burma Superstar",
    lat: 37.7833,
    lon: -122.4167,
    cuisine: "Asian",
    type: "gray",
    rating: 0,
    reviews: 0,
    preview: "",
    dist: "0.9 mi",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJtZXNlJTIwZm9vZHxlbnwxfHx8fDE3MzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "35–45 min",
    deliveryFee: "$2.49 delivery",
    tags: [],
    priceLevel: "$$",
    featured: false,
    safeItems: 0,
  },
  {
    id: "6",
    name: "Nopa",
    lat: 37.7744,
    lon: -122.4379,
    cuisine: "American",
    type: "green",
    rating: 4.8,
    reviews: 34,
    preview: "Exceptional GF options. Very accommodating.",
    dist: "1.2 mi",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3MzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "30–45 min",
    deliveryFee: "$3.99 delivery",
    tags: ["Dedicated GF Kitchen", "Staff Trained"],
    priceLevel: "$$$",
    featured: false,
    safeItems: 14,
  },
  {
    id: "7",
    name: "Little Star Pizza",
    lat: 37.7622,
    lon: -122.4242,
    cuisine: "Pizza",
    type: "green",
    rating: 4.5,
    reviews: 19,
    preview: "GF deep dish pizza! Separate prep area.",
    dist: "1.0 mi",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwxfHx8fDE3MzU1MDI0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "25–35 min",
    deliveryFee: "$1.49 delivery",
    tags: ["Dedicated GF Kitchen"],
    priceLevel: "$$",
    featured: false,
    safeItems: 5,
  },
  {
    id: "8",
    name: "Blue Plate",
    lat: 37.7488,
    lon: -122.4258,
    cuisine: "American",
    type: "yellow",
    rating: 4.1,
    reviews: 8,
    preview: "GF menu available, ask about prep.",
    dist: "1.3 mi",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnVuY2glMjBmb29kfGVufDF8fHx8MTczNTUwMjQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    deliveryTime: "30–40 min",
    deliveryFee: "$2.99 delivery",
    tags: ["GF Menu"],
    priceLevel: "$$",
    featured: false,
    safeItems: 7,
  },
];

const pinColors: Record<string, string> = { 
  green: "#6d7854", 
  yellow: "#fac905", 
  gray: "#b79b7b" 
};

export function ExploreMap() {
  const nav = useNavigate();
  const { profile } = useApp();
  const [center, setCenter] = useState<[number, number]>([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [activeCuisine, setActiveCuisine] = useState(0);
  const [showList, setShowList] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "safeItems">("rating");
  
  // Pan state
  const [panOffset, setPanOffset] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  
  // Pinch zoom state for touch
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);

  useEffect(() => {
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("User location:", lat, lon);
          // Don't change center - keep showing SF restaurants
        },
        (error) => {
          console.log("Location permission denied or unavailable, using default SF location");
        }
      );
    } else {
      console.log("Geolocation not supported, using default SF location");
    }
    
    // Use mock data
    setRestaurants(MOCK_RESTAURANTS);
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart([e.clientX - panOffset[0], e.clientY - panOffset[1]]);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset([e.clientX - dragStart[0], e.clientY - dragStart[1]]);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom starting
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastPinchDistance(distance);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      // Single touch for panning
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart([touch.clientX - panOffset[0], touch.clientY - panOffset[1]]);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      if (lastPinchDistance !== null) {
        const delta = distance - lastPinchDistance;
        const zoomFactor = 1 + delta * 0.01;
        setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * zoomFactor)));
      }
      
      setLastPinchDistance(distance);
    } else if (e.touches.length === 1 && isDragging) {
      // Single touch panning
      const touch = e.touches[0];
      setPanOffset([touch.clientX - dragStart[0], touch.clientY - dragStart[1]]);
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastPinchDistance(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Check if it's a pinch gesture on trackpad (ctrlKey is set for pinch)
    if (e.ctrlKey) {
      // Trackpad pinch zoom
      const zoomFactor = 1 - e.deltaY * 0.01;
      setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * zoomFactor)));
    } else {
      // Regular scroll wheel zoom
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * zoomFactor)));
    }
  };

  const toggleFavorite = (i: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleSave = (i: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const filteredRestaurants = restaurants
    .map((r, i) => ({ ...r, _i: i }))
    .filter((r) => {
      if (activeFilter === 0) return true; // All
      if (activeFilter === 1) return r.type === "green";
      if (activeFilter === 2) return r.type === "green" || r.type === "yellow";
      if (activeFilter === 3) return true; // Near Me — show all, sorted by distance
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "safeItems") return b.safeItems - a.safeItems;
      return parseFloat(a.dist) - parseFloat(b.dist);
    });

  const pin = restaurants[selected];

  // Calculate map bounds for pins
  const mapWidth = 430; // max-width of container
  const mapHeight = 500; // approximate height
  const latRange = 0.035; // ~2.5 miles
  const lonRange = 0.05;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2">
        {/* Header with avatar */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <h1 className="text-[24px] font-semibold text-[#100d09]">Explore nearby</h1>
          <button
            onClick={() => nav("/profile")}
            className="w-10 h-10 rounded-full bg-[#525a3f] flex items-center justify-center text-white text-[16px] shrink-0"
          >
            {profile.name[0]}
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-[#F2F2F2] rounded-lg px-3 py-2.5">
            <Search size={16} className="text-[#846848]" />
            <input className="flex-1 bg-transparent outline-none text-[14px]" placeholder="Search restaurants, cuisines..." />
          </div>
          <button
            onClick={() => nav("/explore/bookmarks")}
            className="bg-[#F2F2F2] rounded-lg p-2.5 flex items-center justify-center shrink-0"
          >
            <Bookmark size={18} className="text-[#423424]" />
          </button>
        </div>

        {/* Main Filters - combined single bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2 scrollbar-hide">
          {filters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] ${
                i === activeFilter ? "bg-[#525a3f] text-white" : "bg-[#fcf5e9] text-[#423424]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cuisine Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {cuisineFilters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveCuisine(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[13px] border ${
                i === activeCuisine
                  ? "border-[#525a3f] bg-[#f3f5f0] text-[#525a3f]"
                  : "border-[#dbcdbd] bg-white text-[#423424]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map/List toggle button - conditional positioning */}
      {showList ? (
        // In list view: relative positioning inside the scrollable container
        null
      ) : (
        // In map view: fixed positioning that doesn't scroll
        <button
          onClick={() => setShowList(!showList)}
          className="fixed top-[210px] right-4 z-[1001] bg-white rounded-lg px-3 py-2 shadow-md flex items-center gap-1.5 text-[13px] text-[#100d09] pointer-events-auto"
          style={{ fontWeight: 500 }}
        >
          <List size={16} /> List
        </button>
      )}

      {showList ? (
        /* ==================== LIST VIEW ==================== */
        <div className="flex-1 relative overflow-auto">
          {/* Spacing after filter bars */}
          <div className="h-2" />

          {/* Restaurant count with toggle button on same line */}
          <div className="px-4 pb-2 flex items-center justify-between">
            <p className="text-[13px] text-[#846848]">{filteredRestaurants.length} restaurants</p>
            <button
              onClick={() => setShowList(false)}
              className="bg-white rounded-lg px-3 py-2 shadow-md flex items-center gap-1.5 text-[13px] text-[#100d09]"
              style={{ fontWeight: 500 }}
            >
              <MapIcon size={16} /> Map
            </button>
          </div>

          {/* Featured / promoted card */}
          {filteredRestaurants.some((r) => r.featured) && (
            <div className="px-4 pt-3">
              {filteredRestaurants
                .filter((r) => r.featured)
                .map((r) => (
                  <div
                    key={r.name}
                    onClick={() => nav("/explore/restaurant")}
                    className="w-full text-left mb-3"
                  >
                    <div className="relative rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={r.image}
                        alt={r.name}
                        className="w-full h-44 object-cover"
                      />
                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-1 rounded-md text-[11px] bg-[#6d7854] text-white" style={{ fontWeight: 500 }}>
                          ✓ Celiac-Appropriate
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSave(r._i); }}
                          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                        >
                          <Bookmark
                            size={16}
                            className={saved.has(r._i) ? "text-[#525a3f] fill-[#525a3f]" : "text-[#423424]"}
                          />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(r._i); }}
                          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                        >
                          <Heart
                            size={16}
                            className={favorites.has(r._i) ? "text-[#DA1E28] fill-[#DA1E28]" : "text-[#423424]"}
                          />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-1.5" style={{ display: "none" }}>
                        <span className="px-2 py-1 rounded-md text-[11px] bg-black/60 text-white flex items-center gap-1">
                          <Clock size={10} /> {r.deliveryTime}
                        </span>
                        <span className="px-2 py-1 rounded-md text-[11px] bg-black/60 text-white">
                          {r.deliveryFee}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2.5 pb-1">
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
                      <div className="flex gap-1.5 mt-2">
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
          )}

          {/* Restaurant list cards */}
          <div className="px-4">
            {filteredRestaurants
              .filter((r) => !r.featured)
              .map((r) => (
                <div
                  key={r.id}
                  onClick={() => nav("/explore/restaurant")}
                  className="w-full flex gap-3 py-3 border-b border-[#ede6de] text-left cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <ImageWithFallback
                      src={r.image}
                      alt={r.name}
                      className="w-[100px] h-[100px] rounded-xl object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleSave(r._i); }}
                        className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                      >
                        <Bookmark
                          size={12}
                          className={saved.has(r._i) ? "text-[#525a3f] fill-[#525a3f]" : "text-[#846848]"}
                        />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(r._i); }}
                        className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center cursor-pointer"
                      >
                        <Heart
                          size={12}
                          className={favorites.has(r._i) ? "text-[#DA1E28] fill-[#DA1E28]" : "text-[#846848]"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#100d09] text-[15px] truncate" style={{ fontWeight: 600 }}>
                        {r.name}
                      </p>
                      {r.rating > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0 bg-[#fcf5e9] rounded px-1.5 py-0.5">
                          <Star size={11} className="text-[#fac905] fill-[#fac905]" />
                          <span className="text-[12px] text-[#100d09]" style={{ fontWeight: 500 }}>{r.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-[#846848] mt-0.5">
                      {r.cuisine} · {r.priceLevel} · {r.dist}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#423424]" style={{ display: "none" }}>
                      <span className="flex items-center gap-0.5">
                        <Clock size={11} /> {r.deliveryTime}
                      </span>
                      <span>·</span>
                      <span>{r.deliveryFee}</span>
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {r.type !== "gray" && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{ background: badgeConfig[r.type].bg, color: badgeConfig[r.type].fg }}
                        >
                          {badgeConfig[r.type].label}
                        </span>
                      )}
                      {r.safeItems > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#f3f5f0] text-[#525a3f]">
                          {r.safeItems} safe items
                        </span>
                      )}
                      {r.type === "gray" && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#fcf5e9] text-[#846848]">
                          Not rated yet
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#c9b49c] shrink-0 self-center" />
                </div>
              ))}
          </div>

          {/* End spacer */}
          <div className="h-4" />
        </div>
      ) : (
        /* ==================== MAP VIEW ==================== */
        <div 
          className="flex-1 relative overflow-hidden select-none"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Removed duplicate toggle button - using the fixed one above */}
          
          {/* Draggable map container */}
          <div 
            className="absolute"
            style={{
              width: '300%',
              height: '300%',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${panOffset[0]}px), calc(-50% + ${panOffset[1]}px)) scale(${zoom})`,
              backgroundImage: `
                linear-gradient(0deg, #d0e8f0 1px, transparent 1px),
                linear-gradient(90deg, #d0e8f0 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              backgroundColor: '#e8f4f8',
            }}
          >
            {/* Streets overlay - more visible */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
              <defs>
                <pattern id="streets" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#8ab4c6" strokeWidth="3" />
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#8ab4c6" strokeWidth="3" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#b0ccd8" strokeWidth="1.5" />
                  <line x1="0" y1="150" x2="200" y2="150" stroke="#b0ccd8" strokeWidth="1.5" />
                  <line x1="50" y1="0" x2="50" y2="200" stroke="#b0ccd8" strokeWidth="1.5" />
                  <line x1="150" y1="0" x2="150" y2="200" stroke="#b0ccd8" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
            </svg>
            
            {/* Map pins - positioned absolutely with counter-scaling */}
            {restaurants.length > 0 && restaurants.map((restaurant, i) => {
              // Calculate position in the center of our oversized map
              const baseX = 50; // center horizontally in %
              const baseY = 50; // center vertically in %
              
              // Offset from center based on lat/lon
              const layoutCenter = [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
              const lonDiff = restaurant.lon - layoutCenter[1];
              const latDiff = restaurant.lat - layoutCenter[0];
              
              // Convert to percentage offsets (each 0.01 degree ≈ 3.33% of our view)
              const x = baseX + (lonDiff * 200);
              const y = baseY - (latDiff * 200);
              
              const isSelected = i === selected;
              
              return (
                <button
                  key={restaurant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(i);
                  }}
                  className="absolute transition-all z-10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                    transformOrigin: 'center center',
                    width: isSelected ? '40px' : '32px',
                    height: isSelected ? '40px' : '32px',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full border-3 border-white shadow-lg transition-all flex items-center justify-center"
                    style={{
                      backgroundColor: pinColors[restaurant.type],
                      boxShadow: isSelected ? '0 0 0 4px #525a3f, 0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    {isSelected && (
                      <MapPin size={20} className="text-white" fill="white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Restaurant info card at bottom */}
          {pin && (
            <div className="absolute bottom-4 inset-x-4 z-[1000] pointer-events-auto">
              <button
                onClick={() => nav("/explore/restaurant")}
                className="w-full bg-white rounded-xl p-4 shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[#100d09]" style={{ fontWeight: 600 }}>{pin.name}</p>
                  {pin.type === "green" && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#e7eae1] text-[#6d7854]">Celiac-Appropriate</span>
                  )}
                  {pin.type === "yellow" && (
                    <span className="px-2 py-0.5 rounded text-[11px] bg-[#fef4cd] text-[#967903]">GF Menu Available</span>
                  )}
                </div>
                <p className="text-[13px] text-[#846848]">{pin.cuisine} · {pin.dist}</p>
                {pin.reviews > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-[#fac905] fill-[#fac905]" />
                    <span className="text-[13px] text-[#423424]">{pin.rating.toFixed(1)} from {pin.reviews} celiac reviews</span>
                  </div>
                )}
                {pin.preview && <p className="text-[13px] text-[#423424] mt-1">{pin.preview}</p>}
                <p className="text-[13px] text-[#525a3f] mt-2">View Details →</p>
              </button>
            </div>
          )}
        </div>
      )}

      <BottomTabs />
    </div>
  );
}