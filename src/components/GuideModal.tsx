import React from 'react';
import { X, Sparkles, Camera, Keyboard, Volume2, CheckCircle2, BookOpen } from 'lucide-react';
import { AccessibilityTheme } from '../types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AccessibilityTheme;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div
      id="guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="guide-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors max-h-[90vh] overflow-y-auto ${
          theme === 'high-contrast'
            ? 'bg-zinc-950 text-white border-yellow-400'
            : theme === 'warm'
            ? 'bg-amber-50 text-amber-950 border-amber-300'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-red-600 text-white'
              }`}
            >
              📖
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Hướng dẫn 3 bước tự học dễ dàng
              </h2>
              <p
                className={`text-sm ${
                  theme === 'high-contrast' ? 'text-yellow-200' : 'text-slate-600'
                }`}
              >
                Dành riêng cho học sinh mới học, đọc chữ to và luyện gõ Pinyin
              </p>
            </div>
          </div>
          <button
            id="btn-close-guide"
            onClick={onClose}
            aria-label="Đóng bảng hướng dẫn"
            className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-500/50'
                : theme === 'warm'
                ? 'bg-amber-100/70 border-amber-300'
                : 'bg-blue-50/70 border-blue-200'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-extrabold text-base ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-blue-600 text-white'
              }`}
            >
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Bước 1: Chụp ảnh trang sách hoặc gõ từ tiếng Việt
              </h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                Chụp ảnh bài tập, trang sách tiếng Trung (ảnh hơi nghiêng hoặc thiếu sáng AI vẫn đọc được), hoặc chỉ cần gõ từ/câu tiếng Việt muốn học nói sang tiếng Trung.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-500/50'
                : theme === 'warm'
                ? 'bg-amber-100/70 border-amber-300'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-extrabold text-base ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-amber-600 text-white'
              }`}
            >
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-amber-600" />
                Bước 2: Kiểm tra lại chữ Hán và xem Pinyin
              </h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                AI sẽ nhận diện và hiển thị chữ Hán cỡ lớn kèm phiên âm Pinyin rõ ràng. Bạn có thể bấm nút sửa lại chữ nếu muốn trước khi học tiếp.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-500/50'
                : theme === 'warm'
                ? 'bg-amber-100/70 border-amber-300'
                : 'bg-emerald-50/70 border-emerald-200'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-extrabold text-base ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                Bước 3: Luyện nghe đọc to & Xem sơ đồ tư duy gõ phím
              </h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                Bấm nút <strong>Phát</strong> để nghe giọng đọc chuẩn và máy sẽ làm nổi bật từng câu đang đọc. Xem mẹo nhớ mặt chữ và hướng dẫn gõ Pinyin trên điện thoại để nhắn tin dễ dàng!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t flex justify-end">
          <button
            id="btn-understand-guide"
            onClick={onClose}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
              theme === 'high-contrast'
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-white'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Tôi đã hiểu, bắt đầu học ngay!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
