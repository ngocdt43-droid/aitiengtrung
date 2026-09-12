export interface MindMapNode {
  id: string;
  word: string; // Chinese character(s)
  pinyin: string; // Tone marks (e.g. xué xiào)
  meaning: string; // Vietnamese meaning
  typingGuide: string; // Gợi ý cách gõ bàn phím điện thoại (e.g. "Gõ xuexiao -> chọn 学校")
  radicalOrStrokes?: string; // Mẹo nhớ mặt chữ / bộ thủ
  exampleSentence: string; // Câu ví dụ tiếng Trung
  examplePinyin: string; // Pinyin của câu ví dụ
  exampleMeaning: string; // Dịch nghĩa câu ví dụ
  relatedWords: Array<{
    word: string;
    pinyin: string;
    meaning: string;
  }>;
}

export interface SentenceItem {
  id: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export interface AnalysisResult {
  title: string;
  originalInput: string;
  inputType: 'text' | 'image';
  recognizedText: string;
  vietnameseTranslation: string;
  fullPinyin: string;
  summary: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
    keyPoints: string[];
  };
  mindmap: MindMapNode[];
  centralTopic?: {
    word: string;
    pinyin: string;
    meaning: string;
    category?: string;
  };
  sentences: SentenceItem[];
  createdDate: string;
}

export interface LessonHistoryItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  data: AnalysisResult;
}

export type AccessibilityTheme = 'light' | 'warm' | 'night' | 'high-contrast';
export type TextSizeLevel = 'normal' | 'large' | 'extra-large' | 'huge';
export type ReadingMode = 'full' | 'summary' | 'mindmap';
export type DyslexiaFontFamily = 'standard' | 'dyslexic-wide' | 'spacious-sans';
export type HighlightTrackingMode = 'sentence' | 'word';

export interface WordExplanation {
  word: string;
  pinyin: string;
  meaning: string;
  simpleExplanation: string; // Câu giải thích siêu dễ hiểu cho học sinh THCS
  example: string;
  exampleMeaning: string;
}
