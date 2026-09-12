import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Send,
  Loader2,
  Check,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { AccessibilityTheme } from '../types';
import { SAMPLE_LESSONS } from '../data/sampleLessons';
import { CameraCaptureModal } from './CameraCaptureModal';

interface InputSectionProps {
  onAnalyze: (payload: { text?: string; imageBase64?: string; mimeType?: string }) => void;
  isLoading: boolean;
  theme: AccessibilityTheme;
  onSelectSample: (lesson: typeof SAMPLE_LESSONS[0]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onAnalyze,
  isLoading,
  theme,
  onSelectSample,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_WORDS = [
    { label: 'Đi (去/走)', text: 'đi' },
    { label: 'Ăn (吃)', text: 'ăn' },
    { label: 'Học (学习)', text: 'học' },
    { label: 'Uống (喝)', text: 'uống' },
    { label: 'Trường học (学校)', text: 'trường học' },
    { label: 'Bạn bè (朋友)', text: 'bạn bè' },
    { label: 'Hoa quả (水果)', text: 'hoa quả' },
    { label: 'Gia đình (家)', text: 'gia đình' },
  ];

  const handleImageUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setImageMime(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCameraCapture = (base64Image: string, mimeType: string) => {
    setSelectedImage(base64Image);
    setImageMime(mimeType);
    setFileName('Ảnh chụp từ máy ảnh');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (isLoading) return;
    if (activeTab === 'image' && selectedImage) {
      onAnalyze({
        imageBase64: selectedImage,
        mimeType: imageMime,
        text: inputText.trim() || undefined,
      });
    } else if (inputText.trim()) {
      onAnalyze({
        text: inputText.trim(),
      });
    }
  };

  return (
    <section
      id="input-learning-section"
      className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all ${
        theme === 'high-contrast'
          ? 'bg-zinc-950 border-yellow-400 text-white'
          : theme === 'night'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : theme === 'warm'
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : theme === 'night'
                  ? 'bg-sky-500 text-slate-950 font-black'
                  : 'bg-red-600 text-white'
              }`}
            >
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Bước 1: Chọn từ hoặc bài muốn học
            </h2>
          </div>
          <p
            className={`text-sm mt-1 font-medium ${
              theme === 'high-contrast'
                ? 'text-yellow-200'
                : theme === 'night'
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            Gõ một từ để vẽ sơ đồ tư duy & câu ngắn, hoặc chụp ảnh trang sách bài đọc
          </p>
        </div>

        {/* Input Type Selector Tabs */}
        <div
          className={`flex p-1.5 rounded-2xl border self-start sm:self-auto ${
            theme === 'high-contrast'
              ? 'bg-zinc-900 border-yellow-400'
              : theme === 'night'
              ? 'bg-slate-950 border-slate-700'
              : theme === 'warm'
              ? 'bg-amber-200/80 border-amber-400'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            id="tab-text-input"
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'text'
                ? theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black font-black'
                  : 'bg-white text-red-600 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Gõ từ / Văn bản</span>
          </button>

          <button
            id="tab-image-input"
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'image'
                ? theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black font-black'
                  : 'bg-white text-red-600 shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Chụp ảnh / Tải ảnh sách</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Text / Word Input */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          {/* Beginner Tip Callout */}
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
              theme === 'high-contrast'
                ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
                : 'bg-blue-50/80 border-blue-200 text-blue-950'
            }`}
          >
            <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold text-blue-800">
                Thích hợp cho người mới học:
              </span>{' '}
              <span className="font-medium">
                Bạn chỉ cần gõ <strong>một từ đơn</strong> (tiếng Việt hoặc tiếng Trung, ví dụ: <em>ăn</em>, <em>học</em>, <em>uống</em>, <em>bạn bè</em>, <em>trường học</em>). AI sẽ tự động vẽ <strong>sơ đồ tư duy các từ có liên quan về mặt ý nghĩa</strong> và tạo các <strong>câu ngắn tương ứng</strong>, rất dễ nhớ và bắt mắt!
              </span>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="input-text-area"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập từ cần học (ví dụ: 'ăn', 'học', 'uống', 'trường học') hoặc gõ câu tiếng Việt / dán đoạn văn tiếng Trung..."
              className={`w-full p-4 text-base sm:text-lg rounded-2xl border-2 transition-all focus:outline-hidden ${
                theme === 'high-contrast'
                  ? 'bg-zinc-900 text-white border-yellow-400 placeholder-zinc-500 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-400'
                  : theme === 'warm'
                  ? 'bg-amber-100/50 text-amber-950 border-amber-300 placeholder-amber-700/60 focus:border-amber-600 focus:ring-2 focus:ring-amber-400'
                  : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              }`}
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-3 top-3 p-1.5 rounded-lg opacity-60 hover:opacity-100 text-sm font-bold"
                title="Xóa nội dung"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Suggested Words Chips */}
          <div>
            <span
              className={`text-xs sm:text-sm font-bold block mb-2 ${
                theme === 'high-contrast' ? 'text-yellow-300' : 'text-slate-600'
              }`}
            >
              Bấm nhanh để học thử từ vựng cơ bản:
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_WORDS.map((item, idx) => (
                <button
                  key={idx}
                  id={`btn-suggested-word-${idx}`}
                  type="button"
                  onClick={() => setInputText(item.text)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${
                    inputText === item.text
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : theme === 'high-contrast'
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                      : theme === 'warm'
                      ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-red-400 hover:text-red-600'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Lessons for Students */}
          <div className="pt-2">
            <span
              className={`text-xs sm:text-sm font-bold block mb-2 ${
                theme === 'high-contrast' ? 'text-yellow-300' : 'text-slate-600'
              }`}
            >
              Hoặc chọn bài học mẫu hoàn chỉnh có sẵn:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_LESSONS.map((sample, idx) => (
                <button
                  key={idx}
                  id={`btn-sample-lesson-${idx}`}
                  onClick={() => onSelectSample(sample)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-left flex items-center gap-2 ${
                    theme === 'high-contrast'
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                      : theme === 'warm'
                      ? 'bg-amber-200/60 border-amber-300 text-amber-900 hover:bg-amber-200'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Image Upload & OCR */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="file-upload-input"
          />

          {!selectedImage ? (
            <div
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-colors ${
                theme === 'high-contrast'
                  ? 'border-yellow-400 bg-zinc-900/60 text-white'
                  : theme === 'warm'
                  ? 'border-amber-400 bg-amber-100/40 text-amber-950'
                  : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-1">
                Chụp ảnh hoặc tải ảnh trang sách tiếng Trung
              </h3>
              <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto mb-5">
                Bấm <strong>"Mở máy ảnh chụp ngay"</strong> để dùng trực tiếp camera của điện thoại/máy tính, hoặc bấm <strong>"Chọn ảnh từ máy"</strong> để tải tệp có sẵn.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Genuine Live Camera Capture */}
                <button
                  type="button"
                  id="btn-trigger-camera"
                  onClick={() => setIsCameraModalOpen(true)}
                  className={`px-5 py-3 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                    theme === 'high-contrast'
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Mở máy ảnh chụp ngay</span>
                </button>

                {/* File picker */}
                <button
                  type="button"
                  id="btn-trigger-upload"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-5 py-3 rounded-2xl font-extrabold text-sm sm:text-base flex items-center gap-2 border shadow-sm transition-all active:scale-95 ${
                    theme === 'high-contrast'
                      ? 'bg-zinc-800 border-yellow-400 text-yellow-300 hover:bg-zinc-700'
                      : theme === 'warm'
                      ? 'bg-amber-200 border-amber-400 text-amber-950 hover:bg-amber-300'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>Chọn ảnh từ máy</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center gap-4 ${
                theme === 'high-contrast'
                  ? 'bg-zinc-900 border-yellow-400'
                  : theme === 'warm'
                  ? 'bg-amber-100/70 border-amber-300'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <div className="relative w-full sm:w-44 h-36 rounded-2xl overflow-hidden border bg-black shrink-0">
                <img
                  src={selectedImage}
                  alt="Ảnh trang sách đã chọn"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-base">Đã nhận ảnh: {fileName || 'Trang sách'}</span>
                </div>
                <p className="text-xs sm:text-sm opacity-80">
                  Ảnh đã sẵn sàng! Bấm nút bên dưới để Gemini nhận diện toàn bộ chữ và lập sơ đồ từ vựng.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                  <button
                    onClick={() => setIsCameraModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 transition-colors border border-blue-200"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Chụp lại bằng camera</span>
                  </button>

                  <button
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1 transition-colors border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hủy ảnh</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optional extra note for image */}
          {selectedImage && (
            <div>
              <label
                htmlFor="image-note"
                className="block text-xs sm:text-sm font-bold mb-1 opacity-80"
              >
                Ghi chú thêm (không bắt buộc):
              </label>
              <input
                id="image-note"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ví dụ: Tập trung vào đoạn thứ hai, hoặc dịch nghĩa sang tiếng Việt..."
                className={`w-full p-3 text-sm rounded-xl border ${
                  theme === 'high-contrast'
                    ? 'bg-zinc-900 text-white border-yellow-400'
                    : 'bg-white text-slate-900 border-slate-300'
                }`}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Submit Button (Step 2 Trigger) */}
      <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm opacity-80">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {activeTab === 'text'
              ? 'AI sẽ tạo sơ đồ tư duy các từ liên quan & câu ngắn cho người mới học'
              : 'AI nhận diện chữ từ ảnh chụp & vẽ sơ đồ từ vựng'}
          </span>
        </div>

        <button
          id="btn-submit-analyze"
          onClick={handleSubmit}
          disabled={isLoading || (activeTab === 'text' && !inputText.trim()) || (activeTab === 'image' && !selectedImage)}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'high-contrast'
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-white'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>AI đang nhận diện & lập sơ đồ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Phân tích & Tạo sơ đồ học ngay</span>
            </>
          )}
        </button>
      </div>

      {/* Dedicated Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        onFallbackToFile={() => fileInputRef.current?.click()}
        theme={theme}
      />
    </section>
  );
};
