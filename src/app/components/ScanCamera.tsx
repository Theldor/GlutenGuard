import { useNavigate } from "react-router";
import { Image, X } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { useState, useRef } from "react";
import { toDataURL } from "@/app/lib/analyzeMenu";

export function ScanCamera() {
  const nav = useNavigate();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (!files.length) return;
    const urls = await Promise.all(files.map(toDataURL));
    setSelectedPhotos((prev) => [...prev, ...urls].slice(0, 4));
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFiles}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 pt-8 px-6 z-10 bg-gradient-to-b from-black/90 via-black/70 to-transparent pb-12">
          <h1 className="text-white text-[28px] font-semibold mb-3">Scan your menu</h1>
          <p className="text-white/80 text-[15px] leading-snug">
            Take a photo of the menu. We'll analyze it and highlight items that match your dietary needs.
          </p>
        </div>

        {/* Camera viewfinder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-[280px] h-[280px] relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg"></div>
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-white"></div>
                <div className="border-r border-white"></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo thumbnails */}
        {selectedPhotos.length > 0 && (
          <div className="absolute bottom-32 left-6 flex gap-2">
            {selectedPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <div className="w-14 h-14 bg-[#2d3748] rounded-lg border border-white/20 overflow-hidden">
                  <img
                    src={photo}
                    alt={`Menu thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4183d] rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-6 px-6">
          <div className="relative flex items-center justify-center">
            {/* Gallery button */}
            <button
              onClick={() => galleryRef.current?.click()}
              className="absolute left-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Image size={20} className="text-white" />
            </button>

            {/* Camera shutter */}
            <button
              onClick={() => cameraRef.current?.click()}
              className="w-16 h-16 rounded-full bg-white border-4 border-[#525a3f] active:scale-95 transition-transform"
            />

            {/* Advance to review */}
            {selectedPhotos.length > 0 && (
              <button
                onClick={() => nav("/scan/review", { state: { photos: selectedPhotos } })}
                className="absolute right-0 h-12 px-5 rounded-full bg-[#899669] flex items-center justify-center text-white text-[14px] font-semibold active:scale-95 transition-transform"
              >
                Next ({selectedPhotos.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
