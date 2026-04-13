import { useNavigate, useLocation } from "react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { BottomTabs } from "./BottomTabs";
import menuPhoto from "@/assets/c9357aea2b88ca7fa509d1ef31ae7ab326906e6f.png";

export function ScanReview() {
  const nav = useNavigate();
  const location = useLocation();
  // Get photos from navigation state or use mock data
  const [photos, setPhotos] = useState<string[]>(location.state?.photos || ["photo-1", "photo-2", "photo-3"]);
  const [note, setNote] = useState("");

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto pb-[168px]">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd] mt-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[#100d09] text-[20px]" style={{ fontWeight: 600 }}>Review Photos</h1>
            <button 
              onClick={() => nav("/scan")}
              className="w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X size={20} className="text-[#100d09]" />
            </button>
          </div>
          <p className="text-[#423424] text-[13px]">{photos.length} photo{photos.length !== 1 ? 's' : ''} selected</p>
        </div>

        {/* Photo grid - 2 per row or empty state */}
        {photos.length === 0 ? (
          <div className="px-4 pt-12 pb-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#fcf5e9] flex items-center justify-center mb-4">
              <X size={32} className="text-[#a4825b]" />
            </div>
            <h3 className="text-[#100d09] text-[16px] mb-2" style={{ fontWeight: 600 }}>No Photos</h3>
            <p className="text-[#423424] text-[14px] mb-6 max-w-[280px]">All photos have been removed. Return to camera to add new photos.</p>
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
                {/* Actual photo */}
                <img 
                  src={menuPhoto} 
                  alt={`Menu photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* X button - top right */}
                <button 
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#100d09]/80 rounded-full flex items-center justify-center hover:bg-[#100d09] transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notes section - only show if photos exist */}
        {photos.length > 0 && (
          <div className="px-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter any additional information/needs"
              className="w-full bg-[#fcf5e9] border border-[#dbcdbd] rounded-lg px-4 py-3 text-[#100d09] placeholder:text-[#a4825b] text-[14px] outline-none focus:ring-2 focus:ring-[#525a3f] transition-all resize-none"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Fixed bottom section with Analyze button - only show if photos exist */}
      {photos.length > 0 && (
        <div className="fixed bottom-[60px] inset-x-0 bg-white border-t border-[#dbcdbd] px-4 py-3">
          <button
            onClick={() => nav("/scan/results")}
            className="w-full py-3 rounded-lg bg-[#525a3f] flex items-center justify-center text-white text-[15px] active:scale-95 transition-transform"
            style={{ fontWeight: 500 }}
          >
            Analyze ({photos.length})
          </button>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0">
        <BottomTabs />
      </div>
    </div>
  );
}