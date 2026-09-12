import React from 'react';
import { X, History, Trash2, BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { AccessibilityTheme, LessonHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: LessonHistoryItem[];
  onSelectLesson: (item: LessonHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteLesson: (id: string) => void;
  theme: AccessibilityTheme;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectLesson,
  onClearHistory,
  onDeleteLesson,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="history-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border transition-colors max-h-[90vh] flex flex-col ${
          theme === 'high-contrast'
            ? 'bg-zinc-950 text-white border-yellow-400'
            : theme === 'warm'
            ? 'bg-amber-50 text-amber-950 border-amber-300'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Bài học đã lưu trong phiên
              </h2>
              <p
                className={`text-xs sm:text-sm ${
                  theme === 'high-contrast' ? 'text-yellow-200' : 'text-slate-600'
                }`}
              >
                Không cần đăng nhập • Bấm vào để mở lại bài học bất kỳ lúc nào
              </p>
            </div>
          </div>
          <button
            id="btn-close-history"
            onClick={onClose}
            aria-label="Đóng lịch sử"
            className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of lessons */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 opacity-70 space-y-2">
              <BookOpen className="w-12 h-12 mx-auto stroke-1" />
              <p className="font-bold text-base">Chưa có bài học nào được lưu</p>
              <p className="text-xs">
                Khi bạn phân tích một bài học hoặc đoạn văn, hệ thống sẽ tự động lưu lại tại đây.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  theme === 'high-contrast'
                    ? 'bg-zinc-900 border-yellow-400/60 hover:border-yellow-300'
                    : theme === 'warm'
                    ? 'bg-amber-100/60 border-amber-300 hover:border-amber-400'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white'
                }`}
              >
                <div
                  className="flex-1 cursor-pointer space-y-1"
                  onClick={() => {
                    onSelectLesson(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base sm:text-lg text-red-600 truncate">
                      {item.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                        theme === 'high-contrast'
                          ? 'bg-zinc-800 text-yellow-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.data.inputType === 'image' ? '📸 Ảnh sách' : '✍️ Văn bản'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm opacity-80 line-clamp-1 font-chinese">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      onSelectLesson(item);
                      onClose();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 ${
                      theme === 'high-contrast'
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <span>Mở bài này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLesson(item.id);
                    }}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    title="Xóa bài này khỏi lịch sử"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <button
              id="btn-clear-all-history"
              onClick={onClearHistory}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold opacity-70 hover:opacity-100"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
