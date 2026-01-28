
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Zap, Target, Activity } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please enable camera permissions to use the Field Scanner.");
    }
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        onImageSelect(canvas.toDataURL('image/jpeg', 0.9));
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {!isCameraActive ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={startCamera}
            disabled={isLoading}
            className="group relative h-64 bg-slate-900 rounded-[3rem] border-4 border-slate-800 flex flex-col items-center justify-center gap-4 transition-all hover:border-emerald-500 overflow-hidden"
          >
             <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
             <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
               <Camera size={32} />
             </div>
             <div className="text-center relative z-10">
               <h3 className="text-white font-black text-xl uppercase tracking-tighter">Field Scanner</h3>
               <p className="text-slate-400 text-xs font-bold mt-1">DIRECT OPTICAL FEED</p>
             </div>
          </button>

          <button 
            onClick={() => !isLoading && fileInputRef.current?.click()}
            disabled={isLoading}
            className="group h-64 bg-white rounded-[3rem] border-4 border-slate-100 flex flex-col items-center justify-center gap-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/20"
          >
             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
               <Upload size={32} />
             </div>
             <div className="text-center">
               <h3 className="text-slate-900 font-black text-xl uppercase tracking-tighter">Upload File</h3>
               <p className="text-slate-400 text-xs font-bold mt-1">HIGH-RES LAB DATA</p>
             </div>
             <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </button>
        </div>
      ) : (
        <div className="relative rounded-[3rem] overflow-hidden bg-black aspect-video shadow-2xl border-4 border-slate-900">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover grayscale brightness-110"
          />
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
            <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-2">
              <Activity className="text-emerald-500 animate-pulse" size={16} />
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Direct Sensor Active</span>
            </div>
            <button 
              onClick={stopCamera}
              className="pointer-events-auto w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-1.5 rounded-full border border-white/10">
                <Target size={12} className="text-emerald-400" />
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Optical Alignment Required</span>
             </div>
             <button 
              onClick={captureFrame}
              className="w-20 h-20 rounded-full border-8 border-white/20 bg-emerald-500 shadow-2xl flex items-center justify-center group transition-all active:scale-90"
             >
                <div className="w-full h-full rounded-full border-4 border-white/40 flex items-center justify-center text-white">
                  <Zap size={32} />
                </div>
             </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center p-8">
           <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 border-8 border-emerald-500/20 rounded-full" />
              <div className="absolute inset-0 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className="text-emerald-500 animate-bounce" size={32} />
              </div>
           </div>
           <h3 className="text-3xl font-black text-white uppercase tracking-tighter text-center">Neural Core processing...</h3>
           <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 animate-pulse">Analyzing Morphological Markers</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
