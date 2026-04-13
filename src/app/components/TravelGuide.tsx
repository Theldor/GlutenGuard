import { useState, useEffect } from "react";
import { Plus, Search, MapPin, ArrowLeft, ArrowRight, Info, Check, MoreVertical, Calendar, Pencil, Trash2, X } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp, Trip } from "../store";

type RiskLevel = "safe" | "caution";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  riskLevel: RiskLevel;
  notes: string;
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: "1",
    name: "Spring in Japan",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1673944083714-92ee2061e25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBza3lsaW5lfGVufDF8fHx8MTc3NTQ3MzY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    startDate: "2025-04-01",
    endDate: "2025-04-15",
    restaurants: [
      { id: "r1", name: "Gluten Free T's Kitchen", cuisine: "Japanese", riskLevel: "safe", notes: "100% GF, amazing ramen" },
      { id: "r2", name: "Afuri Ramen", cuisine: "Ramen", riskLevel: "caution", notes: "GF noodles available, shared kitchen" }
    ]
  },
  {
    id: "2",
    name: "Summer Euro Trip",
    location: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1677940064426-b5bb679117d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwaXRhbHklMjBjaXR5fGVufDF8fHx8MTc3NTUwNTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    startDate: "2025-06-20",
    endDate: "2025-07-05",
    restaurants: [
      { id: "r3", name: "Mama Eat", cuisine: "Italian", riskLevel: "safe", notes: "Dedicated GF kitchen area" }
    ]
  }
];

const MOCK_SEARCH_RESULTS: Restaurant[] = [
  { id: "s1", name: "Sushi Zanmai", cuisine: "Sushi", riskLevel: "caution", notes: "Bring your own GF soy sauce" },
  { id: "s2", name: "Soranoiro", cuisine: "Ramen", riskLevel: "safe", notes: "Dedicated GF ramen available" },
  { id: "s3", name: "Pizzeria Soffio", cuisine: "Pizza", riskLevel: "safe", notes: "AIC certified gluten-free" }
];

type ViewState = 'list' | 'create' | 'detail' | 'search' | 'edit';

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return null;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = start.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export function TravelGuide() {
  const { trips, setTrips, addTrip, updateTrip, deleteTrip } = useApp();
  const [view, setView] = useState<ViewState>('list');
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Create/Edit Trip State
  const [tripName, setTripName] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [tripStartDate, setTripStartDate] = useState("");
  const [tripEndDate, setTripEndDate] = useState("");
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  // Initialize with sample trips if empty
  useEffect(() => {
    if (trips.length === 0) {
      setTrips(INITIAL_TRIPS);
    }
  }, []);

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  const handleCreateTrip = () => {
    if (!tripName || !tripLocation) return;
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName,
      location: tripLocation,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb3J0JTIwdHJhdmVsfGVufDF8fHx8MTc3NTQ3MzY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      startDate: tripStartDate || undefined,
      endDate: tripEndDate || undefined,
      restaurants: []
    };
    addTrip(newTrip);
    setTripName("");
    setTripLocation("");
    setTripStartDate("");
    setTripEndDate("");
    setActiveTripId(newTrip.id);
    setView('detail');
  };

  const handleUpdateTrip = () => {
    if (!editingTripId || !tripName || !tripLocation) return;
    updateTrip(editingTripId, {
      name: tripName,
      location: tripLocation,
      startDate: tripStartDate || undefined,
      endDate: tripEndDate || undefined,
    });
    setTripName("");
    setTripLocation("");
    setTripStartDate("");
    setTripEndDate("");
    setEditingTripId(null);
    setView('list');
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTripId(trip.id);
    setTripName(trip.name);
    setTripLocation(trip.location);
    setTripStartDate(trip.startDate || "");
    setTripEndDate(trip.endDate || "");
    setView('edit');
    setMenuOpenId(null);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
      setMenuOpenId(null);
    }
  };

  const handleAddRestaurant = (restaurant: Restaurant) => {
    if (!activeTrip) return;
    // Don't add duplicate
    if (activeTrip.restaurants.some(r => r.id === restaurant.id)) return;
    
    updateTrip(activeTrip.id, {
      restaurants: [...activeTrip.restaurants, restaurant]
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F4F4]">
      <div className="flex-1 overflow-auto bg-white">
        
        {view === 'list' && (
          <div className="p-4">
            <h1 className="text-[24px] font-semibold text-[#161616] mb-6 mt-4">My Trips</h1>
            
            <button 
              onClick={() => setView('create')}
              className="w-full flex items-center justify-between bg-[#0F62FE] text-white p-4 rounded-md mb-6 active:bg-[#0353E9]"
            >
              <span className="font-medium text-[16px]">Create New Trip</span>
              <Plus size={20} />
            </button>

            <div className="space-y-4">
              <h2 className="text-[14px] font-medium text-[#525252] uppercase tracking-wider mb-2">Upcoming & Saved</h2>
              {trips.map(trip => (
                <div 
                  key={trip.id} 
                  className="relative rounded-lg overflow-hidden h-32 shadow-sm group"
                >
                  <div
                    onClick={() => {
                      setActiveTripId(trip.id);
                      setView('detail');
                    }}
                    className="cursor-pointer absolute inset-0"
                  >
                    <ImageWithFallback 
                      src={trip.image} 
                      alt={trip.location} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-12">
                      <h3 className="text-white font-semibold text-[18px] leading-tight">{trip.name}</h3>
                      <div className="flex items-center text-white/80 mt-1 gap-1">
                        <MapPin size={12} />
                        <p className="text-[12px]">{trip.location}</p>
                      </div>
                      {trip.startDate && trip.endDate && (
                        <div className="flex items-center text-white/70 mt-0.5 gap-1">
                          <Calendar size={11} />
                          <p className="text-[11px]">{formatDateRange(trip.startDate, trip.endDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Menu button */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === trip.id ? null : trip.id);
                      }}
                      className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {menuOpenId === trip.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setMenuOpenId(null)}
                        />
                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-[#E0E0E0] overflow-hidden z-30 min-w-[160px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTrip(trip);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-[#161616] hover:bg-[#F4F4F4] transition-colors"
                          >
                            <Pencil size={14} />
                            Edit trip info
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTrip(trip.id);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-[#DA1E28] hover:bg-[#FFF1F1] transition-colors border-t border-[#E0E0E0]"
                          >
                            <Trash2 size={14} />
                            Delete trip
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(view === 'create' || view === 'edit') && (
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 mt-2">
              <button onClick={() => {
                setView('list');
                setEditingTripId(null);
                setTripName("");
                setTripLocation("");
                setTripStartDate("");
                setTripEndDate("");
              }} className="text-[#161616] p-2 -ml-2 rounded-full hover:bg-[#F4F4F4]">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-[20px] font-semibold text-[#161616]">
                {view === 'edit' ? 'Edit Trip' : 'Plan a New Trip'}
              </h1>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-[14px] font-medium text-[#161616] mb-2">Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer in Paris"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full p-4 bg-[#F4F4F4] border-b-2 border-transparent focus:border-[#0F62FE] outline-none text-[16px] text-[#161616]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#161616] mb-2">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252]" />
                  <input 
                    type="text" 
                    placeholder="Search city, region, or country"
                    value={tripLocation}
                    onChange={(e) => setTripLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-[#F4F4F4] border-b-2 border-transparent focus:border-[#0F62FE] outline-none text-[16px] text-[#161616]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#161616] mb-2">
                  Dates <span className="text-[#8D8D8D] font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-[#525252] mb-1">Start Date</label>
                    <input 
                      type="date"
                      value={tripStartDate}
                      onChange={(e) => setTripStartDate(e.target.value)}
                      className="w-full p-3 bg-[#F4F4F4] border-b-2 border-transparent focus:border-[#0F62FE] outline-none text-[14px] text-[#161616]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-[#525252] mb-1">End Date</label>
                    <input 
                      type="date"
                      value={tripEndDate}
                      onChange={(e) => setTripEndDate(e.target.value)}
                      min={tripStartDate}
                      className="w-full p-3 bg-[#F4F4F4] border-b-2 border-transparent focus:border-[#0F62FE] outline-none text-[14px] text-[#161616]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={view === 'edit' ? handleUpdateTrip : handleCreateTrip}
              disabled={!tripName || !tripLocation}
              className="w-full bg-[#0F62FE] text-white p-4 rounded-md font-medium text-[16px] mt-auto disabled:bg-[#C6C6C6] disabled:text-[#8D8D8D]"
            >
              {view === 'edit' ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        )}

        {view === 'detail' && activeTrip && (
          <div className="pb-8">
            <div className="relative h-48">
              <ImageWithFallback src={activeTrip.image} alt={activeTrip.location} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <button 
                onClick={() => setView('list')} 
                className="absolute top-4 left-4 text-white p-2 rounded-full bg-black/20 backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-[24px] font-bold leading-tight">{activeTrip.name}</h2>
                <div className="flex items-center gap-1.5 mt-1 text-white/90">
                  <MapPin size={14} />
                  <p className="text-[14px] font-medium">{activeTrip.location}</p>
                </div>
                {activeTrip.startDate && activeTrip.endDate && (
                  <div className="flex items-center gap-1.5 mt-1 text-white/80">
                    <Calendar size={13} />
                    <p className="text-[13px]">{formatDateRange(activeTrip.startDate, activeTrip.endDate)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Warnings / Tips */}
              <div className="bg-[#FFF8E1] border-l-4 border-[#F1C21B] p-4 rounded-r-md flex gap-3">
                <Info className="text-[#8E6A00] shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-[14px] font-semibold text-[#8E6A00] mb-1">Local Dining Tip</h4>
                  <p className="text-[13px] text-[#8E6A00] leading-relaxed">
                    Always confirm cross-contamination protocols, even at trusted places in {activeTrip.location.split(',')[0]}.
                  </p>
                </div>
              </div>

              {/* Saved Restaurants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold text-[#161616]">Saved Places</h3>
                  <span className="text-[13px] text-[#525252] bg-[#F4F4F4] px-2 py-1 rounded-full">
                    {activeTrip.restaurants.length}
                  </span>
                </div>
                
                {activeTrip.restaurants.length === 0 ? (
                  <div className="bg-[#F4F4F4] p-6 rounded-lg text-center border border-dashed border-[#C6C6C6]">
                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#525252]">
                      <Search size={20} />
                    </div>
                    <p className="text-[14px] text-[#161616] font-medium mb-1">No places added yet</p>
                    <p className="text-[13px] text-[#525252] mb-4">Start discovering safe spots in {activeTrip.location}.</p>
                    <button 
                      onClick={() => setView('search')}
                      className="text-[#0F62FE] text-[14px] font-medium inline-flex items-center gap-1"
                    >
                      Search now <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTrip.restaurants.map(rest => (
                      <div key={rest.id} className="bg-white border border-[#E0E0E0] p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-[16px] font-medium text-[#161616]">{rest.name}</h4>
                            <p className="text-[13px] text-[#525252]">{rest.cuisine}</p>
                          </div>
                          {rest.riskLevel === 'safe' ? (
                            <span className="bg-[#DEFBE6] text-[#198038] text-[12px] font-medium px-2 py-1 rounded-md">Trusted</span>
                          ) : (
                            <span className="bg-[#FFF8E1] text-[#8E6A00] text-[12px] font-medium px-2 py-1 rounded-md">Caution</span>
                          )}
                        </div>
                        <p className="text-[13px] text-[#525252] bg-[#F4F4F4] p-2 rounded mt-2 inline-block w-full">
                          {rest.notes}
                        </p>
                      </div>
                    ))}
                    <button 
                      onClick={() => setView('search')}
                      className="w-full py-3 mt-2 border-2 border-dashed border-[#0F62FE] text-[#0F62FE] rounded-lg font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#0F62FE]/5"
                    >
                      <Plus size={18} /> Add More Places
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'search' && activeTrip && (
          <div className="flex flex-col h-full bg-[#F4F4F4]">
            <div className="bg-white px-4 py-4 shadow-sm z-10">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setView('detail')} className="text-[#161616] p-1 -ml-1 rounded hover:bg-[#F4F4F4]">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-[16px] font-medium text-[#161616]">Search in {activeTrip.location.split(',')[0]}</h2>
              </div>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252]" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Find restaurants, cafes..."
                  className="w-full pl-10 pr-4 py-3 bg-[#F4F4F4] rounded-md outline-none text-[15px] border border-transparent focus:border-[#0F62FE]"
                />
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto space-y-3">
              <p className="text-[13px] text-[#525252] font-medium mb-1 uppercase tracking-wider">Suggested Spots</p>
              {MOCK_SEARCH_RESULTS.map(result => {
                const isAdded = activeTrip.restaurants.some(r => r.id === result.id);
                return (
                  <div key={result.id} className="bg-white p-4 rounded-lg flex items-center justify-between border border-[#E0E0E0]">
                    <div className="flex-1 pr-3">
                      <h4 className="text-[15px] font-medium text-[#161616]">{result.name}</h4>
                      <p className="text-[13px] text-[#525252]">{result.cuisine}</p>
                      {result.riskLevel === 'safe' ? (
                        <span className="inline-block mt-2 text-[#198038] text-[12px] font-medium">✓ Trusted Option</span>
                      ) : (
                        <span className="inline-block mt-2 text-[#8E6A00] text-[12px] font-medium">⚠ Exercise Caution</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddRestaurant(result)}
                      disabled={isAdded}
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isAdded 
                          ? 'bg-[#DEFBE6] text-[#198038]' 
                          : 'bg-[#0F62FE] text-white hover:bg-[#0353E9]'
                      }`}
                    >
                      {isAdded ? <Check size={16} /> : <Plus size={18} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      <BottomTabs />
    </div>
  );
}
