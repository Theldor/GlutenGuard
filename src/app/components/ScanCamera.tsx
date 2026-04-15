import { useNavigate } from "react-router";
import { Image, X, Camera, FlipHorizontal } from "lucide-react";
import { BottomTabs } from "./BottomTabs";
import { useState, useRef, useEffect, useCallback } from "react";

type PermState = "idle" | "requesting" | "granted" | "denied";

export function ScanCamera() {
  const nav = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [perm, setPerm] = useState<PermState>("idle");
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async (facingMode: "environment" | "user") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setPerm("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPerm("granted");
    } catch {
      setPerm("denied");
    }
  }, []);

  useEffect(() => {
    startCamera(facing);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera, facing]);

  const flipCamera = () =>
    setFacing((f) => (f === "environment" ? "user" : "environment"));

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || perm !== "granted") return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setPhotos((prev) => [...prev, url]);
        saveToAlbum(blob, `menu-${Date.now()}.jpg`);
      },
      "image/jpeg",
      0.92,
    );
  };

  const saveToAlbum = async (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: "image/jpeg" });
    // Web Share API — saves to camera roll on iOS / Android
    if (
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], title: "Menu photo" });
        return;
      } catch {
        // User dismissed share sheet — photo is still captured in-app
      }
    }
    // Desktop fallback: trigger a download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
    e.target.value = "";
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex-1 relative overflow-hidden">
        {/* Live camera stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Permission denied overlay */}
        {perm === "denied" && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center px-8 text-center z-20">
            <Camera size={48} className="text-white/50 mb-4" />
            <h2 className="text-white text-[20px] font-semibold mb-2">
              Camera access required
            </h2>
            <p className="text-white/70 text-[14px] leading-relaxed mb-6">
              Allow camera access in your browser or device settings, then try
              again.
            </p>
            <button
              onClick={() => startCamera(facing)}
              className="px-6 py-3 rounded-full bg-[#525a3f] text-white text-[15px] font-medium active:scale-95 transition-transform"
            >
              Try again
            </button>
          </div>
        )}

        {/* Requesting overlay */}
        {perm === "requesting" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <p className="text-white/80 text-[15px]">Requesting camera…</p>
          </div>
        )}

        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 pt-8 px-6 z-10 bg-gradient-to-b from-black/90 via-black/70 to-transparent pb-12">
          <h1 className="text-white text-[28px] font-semibold mb-3">
            Scan your menu
          </h1>
          <p className="text-white/80 text-[15px] leading-snug">
            Take photos directly from above the menu (not at an angle). If the
            menu is long, capture it in chunks so each photo is clear.
          </p>
        </div>

        {/* Viewfinder brackets */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-[280px] h-[280px] relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
          </div>
        </div>

        {/* Captured photo thumbnails */}
        {photos.length > 0 && (
          <div className="absolute bottom-32 left-6 flex gap-2 z-10">
            {photos.map((photo, i) => (
              <div key={photo} className="relative">
                <div className="w-14 h-14 rounded-lg border border-white/20 overflow-hidden">
                  <img
                    src={photo}
                    alt={`Capture ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4183d] rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-6 px-6 z-10">
          <div className="relative flex items-center justify-center">
            {/* Gallery / upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
            >
              <Image size={20} className="text-white" />
            </button>

            {/* Shutter button */}
            <button
              onClick={capturePhoto}
              disabled={perm !== "granted"}
              className="w-16 h-16 rounded-full bg-white border-4 border-[#525a3f] active:scale-95 transition-transform disabled:opacity-40"
            />

            {/* Flip camera (right of shutter) */}
            <button
              onClick={flipCamera}
              className="absolute right-20 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
            >
              <FlipHorizontal size={18} className="text-white" />
            </button>

            {/* Next → review step */}
            {photos.length > 0 && (
              <button
                onClick={() =>
                  nav("/scan/review", { state: { photos } })
                }
                className="absolute right-0 h-12 px-5 rounded-full bg-[#899669] flex items-center justify-center text-white text-[14px] font-semibold active:scale-95 transition-transform"
              >
                Next ({photos.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
