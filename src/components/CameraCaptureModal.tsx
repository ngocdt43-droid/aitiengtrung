import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles, SwitchCamera, Upload } from 'lucide-react';
import { AccessibilityTheme } from '../types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, mimeType: string) => void;
  onFallbackToFile: () => void;
  theme: AccessibilityTheme;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onFallbackToFile,
  theme,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Stop camera tracks helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Check if multiple cameras are available
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        })
        .catch(() => {
          setHasMultipleCameras(false);
        });
    }
  }, []);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    stopCameraStream();
    setErrorMessage(null);
    setCapturedImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        'Trình duyệt này không hỗ trợ chụp ảnh camera trực tiếp. Bạn vui lòng sử dụng tính năng "Chọn ảnh từ máy".'
      );
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.error('Lỗi khi phát video:', err);
          });
          setIsStreaming(true);
        };
      }
    } catch (err: any) {
      console.error('Lỗi mở camera:', err);
      let message = 'Không thể mở máy ảnh.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Bạn chưa cấp quyền máy ảnh cho trang web. Vui lòng cho phép quyền Camera trong cài đặt trình duyệt hoặc dùng nút "Chọn ảnh từ máy".';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'Không tìm thấy thiết bị camera hoặc webcam nào trên máy.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'Camera đang được ứng dụng khác sử dụng hoặc bị khóa.';
      }
      setErrorMessage(message);
    }
  }, [facingMode, stopCameraStream]);

  // Open / Close lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCameraStream();
      setCapturedImage(null);
      setErrorMessage(null);
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream]);

  // Toggle between front and back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture current frame from video element
  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video || !isStreaming) return;

    try {
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // If user camera (selfie), mirror it horizontally for natural preview
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCameraStream();
    } catch (err) {
      console.error('Lỗi chụp ảnh canvas:', err);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm photo usage
  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage, 'image/jpeg');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-capture-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="camera-capture-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[95vh] ${
          theme === 'high-contrast'
            ? 'bg-zinc-950 text-white border-yellow-400'
            : 'bg-zinc-900 text-white border-zinc-700'
        }`}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {capturedImage ? 'Xem trước ảnh đã chụp' : 'Máy ảnh chụp trang sách'}
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                {capturedImage
                  ? 'Kiểm tra ảnh rõ chữ rồi bấm "Dùng ảnh này"'
                  : 'Căn thẳng trang sách tiếng Trung vào giữa khung hình'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-camera-modal"
            onClick={onClose}
            aria-label="Đóng máy ảnh"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera Viewfinder or Captured Image Area */}
        <div className="relative bg-black flex-1 min-h-[340px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
          {errorMessage ? (
            <div className="p-6 text-center max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-zinc-300 leading-relaxed">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Thử mở lại máy ảnh</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFallbackToFile();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Chọn ảnh từ máy thay thế</span>
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Review captured photo */
            <div className="relative w-full h-full flex items-center justify-center p-3">
              <img
                src={capturedImage}
                alt="Ảnh vừa chụp"
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-lg border border-zinc-700"
              />
            </div>
          ) : (
            /* Live Camera Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover sm:object-contain ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Target Guidelines */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-sm" />
                  <div className="w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-sm" />
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold tracking-wide backdrop-blur-xs">
                    Đặt trang sách / chữ Hán vào trong khung này
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-sm" />
                  <div className="w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-sm" />
                </div>
              </div>

              {/* Flip camera button if multiple cameras exist */}
              {hasMultipleCameras && (
                <button
                  type="button"
                  id="btn-switch-camera"
                  onClick={handleToggleFacingMode}
                  className="absolute top-4 right-4 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs transition-transform active:scale-90"
                  title="Đổi camera trước / sau"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between gap-3">
          {capturedImage ? (
            /* Review Actions */
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                id="btn-retake-camera-photo"
                onClick={handleRetake}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Chụp lại</span>
              </button>

              <button
                type="button"
                id="btn-confirm-camera-photo"
                onClick={handleConfirmPhoto}
                className="px-6 sm:px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Check className="w-5 h-5" />
                <span>Dùng ảnh này để phân tích</span>
              </button>
            </div>
          ) : (
            /* Viewfinder Actions */
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFallbackToFile();
                }}
                className="text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Chọn ảnh từ máy</span>
              </button>

              {/* Circular Shutter Button */}
              <button
                type="button"
                id="btn-take-shutter-photo"
                disabled={!isStreaming}
                onClick={handleTakePhoto}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90 shadow-xl ${
                  isStreaming
                    ? 'bg-red-600 hover:bg-red-500 cursor-pointer'
                    : 'bg-zinc-700 opacity-50 cursor-not-allowed'
                }`}
                title="Bấm chụp ảnh ngay"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
