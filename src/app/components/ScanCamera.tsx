import { useNavigate } from "react-router";
import { Image, X } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { useState, useRef } from "react";
import menuPhoto from "@/assets/c9357aea2b88ca7fa509d1ef31ae7ab326906e6f.png";

export function ScanCamera() {
  const nav = useNavigate();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleAlbumClick = () => {
    // Trigger the file input click to open photo gallery
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // Simulate taking a photo
    const newPhoto = `photo-${Date.now()}`;
    setSelectedPhotos(prev => [...prev, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Hidden file input for photo selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelect}
        className="hidden"
      />
      
      <div className="flex-1 relative">
        {/* Header with title and instructions - top left */}
        <div className="absolute top-0 left-0 right-0 pt-8 px-6 z-10 bg-gradient-to-b from-black/90 via-black/70 to-transparent pb-12">
          <h1 className="text-white text-[28px] font-semibold mb-3">Scan your menu</h1>
          <p className="text-white/80 text-[15px] leading-snug">
            Take a photo of the menu. We'll analyze it and highlight items that match your dietary needs.
          </p>
        </div>

        {/* Camera viewfinder placeholder - center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Viewfinder frame - iPhone style */}
            <div className="w-[280px] h-[280px] relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg"></div>
              
              {/* Grid lines - rule of thirds */}
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

        {/* Selected photos thumbnails - horizontal row above album button */}
        {selectedPhotos.length > 0 && (
          <div className="absolute bottom-32 left-6 flex gap-2">
            {selectedPhotos.map((photo, index) => (
              <div key={photo} className="relative">
                <div className="w-14 h-14 bg-[#2d3748] rounded-lg border border-white/20 overflow-hidden">
                  <img 
                    src={photo.startsWith('photo-') ? menuPhoto : photo}
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

        {/* Bottom overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-6 px-6">
          {/* Camera controls */}
          <div className="relative flex items-center justify-center">
            {/* Album button - left side */}
            <button 
              onClick={handleAlbumClick}
              className="absolute left-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Image size={20} className="text-white" />
            </button>
            
            {/* Camera button - centered */}
            <button
              onClick={handleTakePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-[#0F62FE] active:scale-95 transition-transform"
            />
            
            {/* Analyze button - right side */}
            {selectedPhotos.length > 0 && (
              <button
                onClick={() => nav("/scan/review", { state: { photos: selectedPhotos } })}
                className="absolute right-0 h-12 px-5 rounded-full bg-[#42be65] flex items-center justify-center text-white text-[14px] font-semibold active:scale-95 transition-transform"
              >
                Analyze ({selectedPhotos.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}