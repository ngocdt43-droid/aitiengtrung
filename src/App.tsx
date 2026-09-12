import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { SpeechController } from './components/SpeechController';
import { RecognizedTextEditor } from './components/RecognizedTextEditor';
import { MindMapSection } from './components/MindMapSection';
import { SummarySection } from './components/SummarySection';
import { SentencesReader } from './components/SentencesReader';
import { GuideModal } from './components/GuideModal';
import { HistoryModal } from './components/HistoryModal';
import { WordExplanationModal } from './components/WordExplanationModal';
import { TextSelectionToolbar } from './components/TextSelectionToolbar';
import {
  AccessibilityTheme,
  AnalysisResult,
  LessonHistoryItem,
  ReadingMode,
  TextSizeLevel,
  DyslexiaFontFamily,
  HighlightTrackingMode,
  WordExplanation,
} from './types';
import { SAMPLE_LESSONS } from './data/sampleLessons';
import { speakChineseText, stopSpeech, pauseSpeech, resumeSpeech } from './utils/speech';
import { AlertCircle, ArrowUpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Accessibility and Theme State
  const [theme, setTheme] = useState<AccessibilityTheme>(() => {
    return (localStorage.getItem('ai_chinese_theme') as AccessibilityTheme) || 'light';
  });

  // Dyslexia & Easy-Reading Font Family
  const [fontFamily, setFontFamily] = useState<DyslexiaFontFamily>(() => {
    return (localStorage.getItem('ai_chinese_font_family') as DyslexiaFontFamily) || 'standard';
  });

  // Default font size is 'large' (22px) ensuring >= 18px minimum requirement
  const [textSize, setTextSize] = useState<TextSizeLevel>(() => {
    return (localStorage.getItem('ai_chinese_text_size') as TextSizeLevel) || 'large';
  });

  // Tracking Mode: By sentence vs. By word
  const [highlightTrackingMode, setHighlightTrackingMode] = useState<HighlightTrackingMode>(() => {
    return (localStorage.getItem('ai_chinese_tracking_mode') as HighlightTrackingMode) || 'word';
  });

  // Word Boundary Tracking index for real-time word highlighting
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  // Difficult Word Explanation Modal State
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [selectedWordForExplanation, setSelectedWordForExplanation] = useState<string>('');
  const [wordExplanation, setWordExplanation] = useState<WordExplanation | null>(null);
  const [isExplainingLoading, setIsExplainingLoading] = useState(false);
  const [explainErrorMessage, setExplainErrorMessage] = useState<string | null>(null);

  // Main Analysis Data (prefilled with sample lesson for immediate delight)
  const [analysis, setAnalysis] = useState<AnalysisResult>(() => {
    const saved = localStorage.getItem('ai_chinese_current_lesson');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_LESSONS[0];
      }
    }
    return SAMPLE_LESSONS[0];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Speech Synthesis Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [readingMode, setReadingMode] = useState<ReadingMode>('full');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [currentReadingSnippet, setCurrentReadingSnippet] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // History State
  const [history, setHistory] = useState<LessonHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('ai_chinese_study_history');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'hist-sample-1',
        title: SAMPLE_LESSONS[0].title,
        date: new Date().toISOString(),
        excerpt: SAMPLE_LESSONS[0].recognizedText,
        data: SAMPLE_LESSONS[0],
      },
    ];
  });

  // Check if first-time user to show guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('ai_chinese_has_seen_guide');
    if (!hasSeenGuide) {
      setIsGuideOpen(true);
      localStorage.setItem('ai_chinese_has_seen_guide', 'true');
    }
  }, []);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('ai_chinese_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ai_chinese_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('ai_chinese_text_size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('ai_chinese_tracking_mode', highlightTrackingMode);
  }, [highlightTrackingMode]);

  // Sync current analysis to localStorage
  useEffect(() => {
    if (analysis) {
      localStorage.setItem('ai_chinese_current_lesson', JSON.stringify(analysis));
    }
  }, [analysis]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('ai_chinese_study_history', JSON.stringify(history));
  }, [history]);

  // Handle OCR and Analysis API call
  const handleAnalyze = async (payload: {
    text?: string;
    imageBase64?: string;
    mimeType?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    stopReading();

    try {
      const response = await fetch('/api/analyze-chinese', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Không thể phân tích dữ liệu. Vui lòng thử lại!');
      }

      const result: AnalysisResult = data.data;
      setAnalysis(result);
      setSuccessMessage(
        (data.data as any)?.sourceNotice || 'Tạo sơ đồ tư duy và bài học thành công!'
      );

      // Add to history
      const newHistoryItem: LessonHistoryItem = {
        id: `lesson-${Date.now()}`,
        title: result.title || 'Bài học tiếng Trung mới',
        date: new Date().toISOString(),
        excerpt: result.recognizedText.slice(0, 80) + '...',
        data: result,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 29)]);

      setTimeout(() => {
        const resultsEl = document.getElementById('lesson-results-container');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } catch (error: any) {
      console.error('Error analyzing content:', error);
      let msg = error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
      if (
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('quota') ||
        msg.includes('rate-limit')
      ) {
        msg =
          'Hệ thống AI đang nhận nhiều lượt yêu cầu cùng lúc (giới hạn 20 lượt gọi tạm thời của Gemini). Vui lòng đợi 5-10 giây rồi thử lại, hoặc chọn các bài học mẫu có sẵn để học ngay!';
      } else if (msg.trim().startsWith('{') && msg.includes('"message"')) {
        try {
          const parsed = JSON.parse(msg);
          msg = parsed.error?.message || parsed.message || msg;
        } catch {
          // ignore
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a preset sample lesson
  const handleSelectSample = (sample: AnalysisResult) => {
    stopReading();
    setAnalysis(sample);
    setErrorMessage(null);
    setSuccessMessage(`Đã nạp bài mẫu: ${sample.title}`);

    // Add to history if not present
    if (!history.some((h) => h.title === sample.title)) {
      setHistory((prev) => [
        {
          id: `sample-${Date.now()}`,
          title: sample.title,
          date: new Date().toISOString(),
          excerpt: sample.recognizedText.slice(0, 80) + '...',
          data: sample,
        },
        ...prev,
      ]);
    }

    setTimeout(() => {
      const resultsEl = document.getElementById('lesson-results-container');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Update recognized text manually
  const handleUpdateText = (newText: string) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      recognizedText: newText,
    });
    setSuccessMessage('Đã cập nhật lại văn bản tiếng Trung!');
  };

  // Speech Synthesis Controller Logic
  const activeReadingIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  const stopReading = () => {
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(null);
    setActiveCharIndex(null);
    setCurrentReadingSnippet('');
    isPlayingRef.current = false;
  };

  const pauseReading = () => {
    pauseSpeech();
    setIsPaused(true);
  };

  const resumeReading = () => {
    resumeSpeech();
    setIsPaused(false);
  };

  // Play based on current ReadingMode
  const startReading = () => {
    if (!analysis) return;

    if (isPaused) {
      resumeReading();
      return;
    }

    stopSpeech();
    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;

    if (readingMode === 'summary') {
      // Read summary
      setCurrentReadingSnippet(analysis.summary.chinese);
      setActiveSentenceIndex(null);
      setActiveCharIndex(null);
      speakChineseText(
        analysis.summary.chinese,
        playbackRate,
        selectedVoice,
        (charIdx) => {
          setActiveCharIndex(charIdx);
        },
        () => {
          stopReading();
        },
        () => {
          stopReading();
        }
      );
    } else if (readingMode === 'mindmap') {
      // Read vocabulary mind map sequentially
      let currentWordIdx = 0;
      const playNextWord = () => {
        if (!isPlayingRef.current || currentWordIdx >= analysis.mindmap.length) {
          stopReading();
          return;
        }

        const node = analysis.mindmap[currentWordIdx];
        const speechContent = `${node.word}。${node.exampleSentence}`;
        setCurrentReadingSnippet(`${node.word} (${node.meaning})`);

        speakChineseText(
          speechContent,
          playbackRate,
          selectedVoice,
          undefined,
          () => {
            currentWordIdx++;
            if (isPlayingRef.current) {
              setTimeout(playNextWord, 600);
            }
          },
          () => {
            stopReading();
          }
        );
      };

      playNextWord();
    } else {
      // Default: Read full text sentence-by-sentence with active highlight
      const sentences = analysis.sentences;
      if (!sentences || sentences.length === 0) {
        // Fallback to recognizedText directly
        setCurrentReadingSnippet(analysis.recognizedText);
        speakChineseText(
          analysis.recognizedText,
          playbackRate,
          selectedVoice,
          (charIdx) => setActiveCharIndex(charIdx),
          stopReading,
          stopReading
        );
        return;
      }

      activeReadingIndexRef.current = 0;

      const playNextSentence = () => {
        if (!isPlayingRef.current || activeReadingIndexRef.current >= sentences.length) {
          stopReading();
          return;
        }

        const idx = activeReadingIndexRef.current;
        const currentSentence = sentences[idx];
        setActiveSentenceIndex(idx);
        setActiveCharIndex(0);
        setCurrentReadingSnippet(currentSentence.chinese);

        speakChineseText(
          currentSentence.chinese,
          playbackRate,
          selectedVoice,
          (charIdx) => {
            setActiveCharIndex(charIdx);
          },
          () => {
            activeReadingIndexRef.current++;
            if (isPlayingRef.current) {
              setTimeout(playNextSentence, 400);
            }
          },
          () => {
            stopReading();
          }
        );
      };

      playNextSentence();
    }
  };

  // Speak a custom string immediately (e.g. clicking a single word or sentence)
  const speakIndividualText = (text: string) => {
    stopSpeech();
    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
    setCurrentReadingSnippet(text);

    speakChineseText(
      text,
      playbackRate,
      selectedVoice,
      (charIdx) => {
        setActiveCharIndex(charIdx);
      },
      () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentReadingSnippet('');
        setActiveCharIndex(null);
      },
      () => {
        stopReading();
      }
    );
  };

  // Click a specific sentence from SentencesReader
  const handleSentenceClick = (index: number) => {
    if (!analysis || !analysis.sentences[index]) return;
    setActiveSentenceIndex(index);
    setActiveCharIndex(0);
    speakIndividualText(analysis.sentences[index].chinese);
  };

  // Request AI Explain for a selected word
  const handleExplainWord = async (word: string, contextSentence?: string) => {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    setSelectedWordForExplanation(cleanWord);
    setIsExplainModalOpen(true);
    setIsExplainingLoading(true);
    setExplainErrorMessage(null);
    setWordExplanation(null);

    try {
      const res = await fetch('/api/explain-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: cleanWord,
          contextSentence: contextSentence || analysis?.recognizedText || '',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Không thể giải thích từ vào lúc này');
      }

      setWordExplanation(json.data);
    } catch (err: any) {
      console.error('Lỗi khi giải thích từ:', err);
      setExplainErrorMessage(err.message || 'Lỗi khi gọi AI giải thích từ khó');
    } finally {
      setIsExplainingLoading(false);
    }
  };

  const fontClass =
    fontFamily === 'dyslexic-wide'
      ? 'font-dyslexic-wide'
      : fontFamily === 'spacious-sans'
      ? 'font-spacious-sans'
      : 'font-standard';

  return (
    <div
      id="app-root-container"
      className={`min-h-screen transition-colors duration-200 ${fontClass} ${
        theme === 'high-contrast'
          ? 'bg-black text-white theme-high-contrast'
          : theme === 'night'
          ? 'bg-slate-950 text-slate-100 theme-night'
          : theme === 'warm'
          ? 'bg-amber-50 text-amber-950 theme-warm'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* App Main Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        textSize={textSize}
        setTextSize={setTextSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Learning Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Flash Notifications */}
        {errorMessage && (
          <div
            id="error-notification"
            className="p-4 rounded-2xl bg-red-100 border-2 border-red-400 text-red-900 flex items-center gap-3 animate-shake font-bold"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm sm:text-base flex-1">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs px-2 py-1 bg-red-200 hover:bg-red-300 rounded-lg"
            >
              Đóng
            </button>
          </div>
        )}

        {successMessage && (
          <div
            id="success-notification"
            className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 flex items-center gap-3 font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm sm:text-base flex-1">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs px-2 py-1 bg-emerald-200 hover:bg-emerald-300 rounded-lg"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Step 1: Input Section */}
        <InputSection
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          theme={theme}
          onSelectSample={handleSelectSample}
        />

        {/* Results Workspace: Step 2, Step 3, Sentences Reader & Summary */}
        {analysis && (
          <div id="lesson-results-container" className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Pronunciation & Audio Speed Controller with Word Tracking Switch */}
            <SpeechController
              isPlaying={isPlaying}
              isPaused={isPaused}
              onPlay={startReading}
              onPause={pauseReading}
              onStop={stopReading}
              playbackRate={playbackRate}
              setPlaybackRate={setPlaybackRate}
              readingMode={readingMode}
              setReadingMode={setReadingMode}
              highlightTrackingMode={highlightTrackingMode}
              setHighlightTrackingMode={setHighlightTrackingMode}
              currentReadingText={currentReadingSnippet}
              theme={theme}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />

            {/* Step 2: Recognized Text & Edit Verification */}
            <RecognizedTextEditor
              recognizedText={analysis.recognizedText}
              pinyin={analysis.fullPinyin}
              vietnamese={analysis.vietnameseTranslation}
              onUpdateText={handleUpdateText}
              onSpeak={speakIndividualText}
              onExplainSelectedWord={(w) => handleExplainWord(w, analysis.recognizedText)}
              theme={theme}
              textSize={textSize}
              activeSentenceIndex={activeSentenceIndex}
            />

            {/* Step 3: Vocabulary Mind Map with Context Example Sentences */}
            <MindMapSection
              nodes={analysis.mindmap}
              centralTopic={analysis.centralTopic}
              onSpeak={speakIndividualText}
              theme={theme}
              textSize={textSize}
            />

            {/* Interactive Sentence-by-Sentence Synchronized Reading with Word-by-Word Highlight */}
            {analysis.sentences && analysis.sentences.length > 0 && (
              <SentencesReader
                sentences={analysis.sentences}
                activeSentenceIndex={activeSentenceIndex}
                activeCharIndex={activeCharIndex}
                highlightTrackingMode={highlightTrackingMode}
                onSentenceClick={handleSentenceClick}
                onWordExplainRequest={(w, ctx) => handleExplainWord(w, ctx)}
                theme={theme}
                textSize={textSize}
              />
            )}

            {/* 3-5 Sentences Summary with Disclaimer */}
            <SummarySection
              summary={analysis.summary}
              onSpeak={speakIndividualText}
              theme={theme}
              textSize={textSize}
            />
          </div>
        )}
      </main>

      {/* Floating Toolbar when user selects any Chinese text */}
      <TextSelectionToolbar
        onExplainWord={(word) => handleExplainWord(word)}
        onSpeakWord={(word) => speakIndividualText(word)}
        theme={theme}
      />

      {/* Modal: Giải thích từ khó bằng câu đơn giản cho học sinh THCS */}
      <WordExplanationModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        word={selectedWordForExplanation}
        explanation={wordExplanation}
        isLoading={isExplainingLoading}
        errorMessage={explainErrorMessage}
        onSpeak={speakIndividualText}
        theme={theme}
      />

      {/* 3-Step Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        theme={theme}
      />

      {/* Saved Lessons History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectLesson={(item) => handleSelectSample(item.data)}
        onClearHistory={() => setHistory([])}
        onDeleteLesson={(id) => setHistory((prev) => prev.filter((item) => item.id !== id))}
        theme={theme}
      />

      {/* Footer */}
      <footer
        className={`mt-12 py-8 border-t text-center text-xs sm:text-sm font-medium transition-colors ${
          theme === 'high-contrast'
            ? 'bg-black border-yellow-400 text-yellow-300'
            : theme === 'night'
            ? 'bg-slate-950 border-slate-800 text-slate-400'
            : theme === 'warm'
            ? 'bg-amber-100/60 border-amber-300 text-amber-900'
            : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-sm">
            AI học tiếng trung cùng em — Trợ lý học tập thân thiện cho học sinh & phụ huynh
          </p>
          <p className="opacity-80">
            Hỗ trợ chữ to, đọc nổi bật từng từ, giải thích từ khó THCS, phông chữ chống nhầm lẫn chữ, chế độ ban đêm & tương phản cao.
          </p>
        </div>
      </footer>
    </div>
  );
}
