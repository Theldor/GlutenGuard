import { useNavigate, useLocation } from "react-router";
import { X, Plus, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { BottomTabs } from "./BottomTabs";
import { analyzeMenuPhotos, toDataURL } from "@/app/lib/analyzeMenu";
import { useApp } from "../store";

export function ScanReview() {
  const nav = useNavigate();
  const location = useLocation();
  const { profile } = useApp();
  const [photos, setPhotos] = useState<string[]>(location.state?.photos || []);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(toDataURL));
    setPhotos((prev) => [...prev, ...urls].slice(0, 4));
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!photos.length || loading) return;
    setError(null);
    setLoading(true);
    try {
      const results = await analyzeMenuPhotos(photos, note, {
        condition: profile.condition,
        customBlockedIngredients: profile.customBlockedIngredients,
        additionalRestrictions: profile.additionalRestrictions,
        symptomatic: profile.symptomatic,
        crossContamination: profile.crossContamination,
        otherDietaryPreferences: profile.otherDietaryPreferences,
      });
      nav("/scan/results", { state: { results } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Check your API key and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto pb-4">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd] mt-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[#100d09] text-[20px]" style={{ fontWeight: 600 }}>
              Review Photos
            </h1>
            <button
              onClick={() => nav("/scan")}
              disabled={loading}
              className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-40"
            >
              <X size={20} className="text-[#100d09]" />
            </button>
          </div>
          <p className="text-[#423424] text-[13px]">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
          </p>
        </div>

        {/* Photo grid */}
        {photos.length === 0 ? (
          <div className="px-4 pt-12 pb-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#fcf5e9] flex items-center justify-center mb-4">
              <X size={32} className="text-[#a4825b]" />
            </div>
            <h3 className="text-[#100d09] text-[16px] mb-2" style={{ fontWeight: 600 }}>
              No Photos
            </h3>
            <p className="text-[#423424] text-[14px] mb-6 max-w-[280px]">
              All photos have been removed. Return to camera to add new photos.
            </p>
            <button
              onClick={() => nav("/scan")}
              className="px-6 py-3 rounded-lg bg-[#525a3f] text-white text-[15px] active:scale-95 transition-transform"
              style={{ fontWeight: 500 }}
            >
              Back to Camera
            </button>
          </div>
        ) : (
          <div className="px-4 pt-4 grid grid-cols-2 gap-3 mb-6">
            {photos.map((photo, index) => (
              <div key={photo} className="relative aspect-[4/3] bg-[#fcf5e9] rounded-lg border border-[#dbcdbd] overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Menu photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Loader2 size={22} className="text-white animate-spin" />
                  </div>
                )}
                {!loading && (
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-[#100d09]/80 rounded-full flex items-center justify-center hover:bg-[#100d09] transition-colors"
                  >
                    <X size={16} className="text-white" />
                  </button>
                )}
              </div>
            ))}

            {/* Add photo slot */}
            {photos.length < 4 && !loading && (
              <button
                onClick={() => addRef.current?.click()}
                className="aspect-[4/3] rounded-lg border-2 border-dashed border-[#c5c0b8] bg-[#f7f4ef] flex flex-col items-center justify-center gap-2 active:opacity-60 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-[#e8e3da] flex items-center justify-center">
                  <Plus size={18} className="text-[#6b6358]" />
                </div>
                <span className="text-[11px] text-[#999]">Add photo</span>
              </button>
            )}
          </div>
        )}

        {/* Notes */}
        {photos.length > 0 && (
          <div className="px-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              placeholder="Any additional dietary needs or context…"
              className="w-full bg-[#fcf5e9] border border-[#dbcdbd] rounded-lg px-4 py-3 text-[#100d09] placeholder:text-[#a4825b] text-[14px] outline-none focus:ring-2 focus:ring-[#525a3f] transition-all resize-none disabled:opacity-60"
              rows={3}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-[12px] text-red-800 leading-snug">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom section with Analyze button - only show if photos exist */}
      {photos.length > 0 && (
        <div className="bg-white border-t border-[#dbcdbd] px-4 py-3">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#525a3f] flex items-center justify-center gap-2 text-white text-[15px] active:scale-95 transition-transform disabled:opacity-70 disabled:scale-100"
            style={{ fontWeight: 500 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              `Analyze (${photos.length})`
            )}
          </button>
        </div>
      )}

      <BottomTabs />
    </div>
  );
}
