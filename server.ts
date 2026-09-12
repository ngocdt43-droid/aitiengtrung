import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser for JSON with base64 images
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Lazy initialize GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AI học tiếng trung cùng em" });
});

// Primary OCR and Mind Map Analysis Endpoint
app.post("/api/analyze-chinese", async (req, res) => {
  try {
    const { text, imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({
        error: "Vui lòng nhập văn bản hoặc tải lên hình ảnh trang sách/bài đọc.",
      });
    }

    const ai = getGeminiClient();

    const systemPrompt = `
Bạn là "AI học tiếng trung cùng em" — trợ lý giáo dục chuyên biệt giúp học sinh (12-15 tuổi), người mới bắt đầu học tiếng Trung, học sinh đọc chậm hoặc thị lực yếu tự học tại nhà.

MỤC TIÊU XỬ LÝ:

1. NẾU ĐẦU VÀO LÀ TỪ VỰNG HOẶC CỤM TỪ NGẮN (Ví dụ: "ăn", "học", "trường học", "hoa quả", "uống", "bạn bè", "gia đình", "mèo", hoặc chữ Hán như "吃", "学习", "喝"):
   - ĐẶC BIỆT QUAN TRỌNG: Hãy biến từ này thành "Từ trung tâm" (centralTopic).
   - TẠO SƠ ĐỒ TƯ DUY TỪ VỰNG MỞ RỘNG (MIND MAP) gồm 4-6 từ có liên quan mật thiết về mặt ngữ nghĩa (từ đồng nghĩa, từ ghép liên quan, từ cùng trường nghĩa hoặc trái nghĩa thông dụng nhất).
   - VỚI MỖI TỪ TRONG SƠ ĐỒ TƯ DUY:
     + BẮT BUỘC TẠO CÂU NGẮN TƯƠNG ỨNG (exampleSentence), RẤT ĐƠN GIẢN, THÍCH HỢP CHO NGƯỜI MỚI HỌC (chỉ dài 4 - 8 chữ Hán, cấu trúc căn bản như: "我想吃苹果。", "米饭很好吃。", "今天我们去学校。"). Tránh hoàn toàn các câu phức tạp, dài dòng!
     + Kèm Pinyin chuẩn có thanh điệu và dịch nghĩa tiếng Việt dễ hiểu, gần gũi.
     + Hướng dẫn gõ Pinyin trên điện thoại/máy tính (typingGuide, ví dụ: "Gõ pinyin: chi -> chọn chữ 吃").
     + Mẹo nhớ mặt chữ (radicalOrStrokes): giải thích bộ thủ hoặc hình tượng sinh động.
     + 2-3 từ liên quan rẽ nhánh nhỏ hơn (relatedWords).
   - Viết bài đọc ngắn (recognizedText) xoay quanh từ trung tâm này (khoảng 3-5 câu ngắn cho người mới học) để học sinh luyện đọc và nghe.

2. NẾU ĐẦU VÀO LÀ ĐOẠN VĂN TIẾNG VIỆT HOẶC TIẾNG TRUNG:
   - Dịch/chuẩn hóa thành bài đọc tiếng Trung mạch lạc, dễ hiểu cho học sinh.
   - Trích xuất 4-5 từ vựng nòng cốt để làm sơ đồ tư duy, mỗi từ cũng kèm CÂU NGẮN đơn giản cho người mới học.

3. NẾU ĐẦU VÀO LÀ ẢNH (OCR):
   - Đọc kỹ toàn bộ văn bản trong ảnh (kể cả ảnh chụp hơi nghiêng, ánh sáng yếu, chữ in mờ).
   - Trích xuất nguyên văn tiếng Trung, dịch nghĩa tiếng Việt, và tạo sơ đồ tư duy từ vựng kèm câu ví dụ ngắn.

4. BẢN TÓM TẮT (summary):
   - Tóm tắt 3-5 câu cô đọng, dễ hiểu.
   - Kèm 3-4 điểm kiến thức cần ghi nhớ.

5. TÁCH TỪNG CÂU (sentences):
   - Tách toàn bộ bài thành từng câu riêng biệt (có chữ Hán, Pinyin và tiếng Việt) để phát âm và làm nổi bật theo thời gian thực.

Hãy trả về kết quả đúng định dạng JSON theo schema đã chỉ định.`;

    const contentsPayload: any = [];

    let userPrompt = "Hãy phân tích và tạo nội dung học tập tiếng Trung theo hướng dẫn.";

    if (imageBase64) {
      // Clean base64 string if data URL prefix exists
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      contentsPayload.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      });
      userPrompt += `\nĐầu vào là ảnh chụp tài liệu/trang sách (có thể hơi nghiêng hoặc thiếu sáng). Hãy nhận diện toàn bộ chữ (OCR), trích xuất chính xác và phân tích.`;
    }

    if (text && text.trim()) {
      const trimmedText = text.trim();
      const wordCount = trimmedText.split(/\s+/).length;
      if (wordCount <= 5 && trimmedText.length <= 25) {
        userPrompt += `\nNgười dùng nhập TỪ VỰNG: "${trimmedText}".
YÊU CẦU ĐẶC BIỆT:
1. Đặt "${trimmedText}" làm từ trung tâm (centralTopic).
2. Tạo sơ đồ tư duy minh họa 4-6 từ vựng có liên quan mật thiết về ngữ nghĩa với từ này (các từ cùng trường nghĩa, từ ghép, từ đồng nghĩa hoặc hành động đi kèm).
3. Với MỖI từ trong sơ đồ tư duy, BẮT BUỘC tạo CÂU NGẮN TƯƠNG ỨNG (exampleSentence) thật ngắn gọn (4-8 chữ Hán), cấu trúc đơn giản, cực kỳ thích hợp cho người mới bắt đầu học tiếng Trung.`;
      } else {
        userPrompt += `\nNội dung văn bản đầu vào: "${trimmedText}".`;
      }
    }

    contentsPayload.push({
      text: userPrompt,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Tiêu đề bài học ngắn gọn (tiếng Việt và chữ Hán, ví dụ: 'Học về Trường học - 学校生活')",
            },
            recognizedText: {
              type: Type.STRING,
              description: "Toàn bộ văn bản tiếng Trung (nhận diện từ OCR hoặc chuyển đổi từ tiếng Việt)",
            },
            vietnameseTranslation: {
              type: Type.STRING,
              description: "Bản dịch nghĩa tiếng Việt đầy đủ của văn bản tiếng Trung",
            },
            fullPinyin: {
              type: Type.STRING,
              description: "Toàn bộ phiên âm Pinyin có dấu thanh điệu tương ứng của văn bản tiếng Trung",
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                chinese: { type: Type.STRING, description: "Bản tóm tắt ngắn (3-5 câu tiếng Trung)" },
                pinyin: { type: Type.STRING, description: "Pinyin của bản tóm tắt" },
                vietnamese: { type: Type.STRING, description: "Nghĩa tiếng Việt của bản tóm tắt" },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-4 điểm cần nhớ chính của bài",
                },
              },
              required: ["chinese", "pinyin", "vietnamese", "keyPoints"],
            },
            mindmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  word: { type: Type.STRING, description: "Chữ Hán mục tiêu (ví dụ: 学校)" },
                  pinyin: { type: Type.STRING, description: "Pinyin có dấu (ví dụ: xué xiào)" },
                  meaning: { type: Type.STRING, description: "Nghĩa tiếng Việt" },
                  typingGuide: {
                    type: Type.STRING,
                    description: "Hướng dẫn gõ bàn phím điện thoại (ví dụ: Gõ 'xuexiao' trên bàn phím Pinyin -> chọn 学校)",
                  },
                  radicalOrStrokes: {
                    type: Type.STRING,
                    description: "Bộ thủ hoặc mẹo liên tưởng nhớ mặt chữ dễ nhớ",
                  },
                  exampleSentence: {
                    type: Type.STRING,
                    description: "Câu ví dụ minh họa bằng tiếng Trung",
                  },
                  examplePinyin: {
                    type: Type.STRING,
                    description: "Pinyin của câu ví dụ",
                  },
                  exampleMeaning: {
                    type: Type.STRING,
                    description: "Dịch nghĩa tiếng Việt của câu ví dụ",
                  },
                  relatedWords: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        word: { type: Type.STRING },
                        pinyin: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                      },
                      required: ["word", "pinyin", "meaning"],
                    },
                    description: "2-3 từ liên tưởng/từ ghép rẽ nhánh",
                  },
                },
                required: [
                  "id",
                  "word",
                  "pinyin",
                  "meaning",
                  "typingGuide",
                  "exampleSentence",
                  "examplePinyin",
                  "exampleMeaning",
                  "relatedWords",
                ],
              },
              description: "Danh sách 3-5 từ nòng cốt tạo thành sơ đồ tư duy",
            },
            centralTopic: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING, description: "Từ khóa trung tâm (chữ Hán)" },
                pinyin: { type: Type.STRING, description: "Pinyin của từ trung tâm" },
                meaning: { type: Type.STRING, description: "Nghĩa tiếng Việt của từ trung tâm" },
                category: { type: Type.STRING, description: "Phân loại chủ đề/từ loại" },
              },
              required: ["word", "pinyin", "meaning"],
              description: "Thông tin từ khóa trung tâm",
            },
            sentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  chinese: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  vietnamese: { type: Type.STRING },
                },
                required: ["id", "chinese", "pinyin", "vietnamese"],
              },
              description: "Từng câu riêng lẻ để highlight và đồng bộ giọng đọc",
            },
          },
          required: [
            "title",
            "recognizedText",
            "vietnameseTranslation",
            "fullPinyin",
            "summary",
            "mindmap",
            "sentences",
          ],
        },
      },
    });

    const rawText = response.text || "{}";
    const parsedData = JSON.parse(rawText);

    return res.json({
      success: true,
      data: {
        ...parsedData,
        originalInput: text || (imageBase64 ? "[Ảnh trang sách tải lên]" : ""),
        inputType: imageBase64 ? "image" : "text",
        createdDate: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Lỗi khi phân tích bằng Gemini:", error);
    return res.status(500).json({
      error: error.message || "Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại!",
    });
  }
});

// Endpoint: Giải thích từ khó bằng câu đơn giản cho học sinh THCS
app.post("/api/explain-word", async (req, res) => {
  try {
    const { word, contextSentence } = req.body;
    if (!word || !word.trim()) {
      return res.status(400).json({ error: "Thiếu từ cần giải thích." });
    }

    const prompt = `Bạn là giáo viên tiếng Trung thân thiện chuyên dạy học sinh cấp 2 (THCS).
Hãy giải thích từ vựng tiếng Trung sau đây thật ngắn gọn, dễ hiểu, dùng ngôn từ bình dị, sinh động:
Từ cần giải thích: "${word.trim()}"
${contextSentence ? `Trong ngữ cảnh câu: "${contextSentence.trim()}"` : ""}

YÊU CẦU:
- word: Chữ Hán của từ
- pinyin: Phiên âm Pinyin kèm dấu thanh điệu chuẩn
- meaning: Nghĩa tiếng Việt ngắn gọn (1-2 từ)
- simpleExplanation: Lời giải thích từ 1-2 câu cực kỳ đơn giản, trực quan, phù hợp với học sinh THCS (dùng ví dụ đời thường, giải thích bộ phận hoặc mẹo nhớ vui nhộn).
- example: 1 câu ví dụ tiếng Trung siêu ngắn (dưới 7 chữ).
- exampleMeaning: Dịch nghĩa tiếng Việt của câu ví dụ đó.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ text: prompt }],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            pinyin: { type: Type.STRING },
            meaning: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            example: { type: Type.STRING },
            exampleMeaning: { type: Type.STRING },
          },
          required: ["word", "pinyin", "meaning", "simpleExplanation", "example", "exampleMeaning"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error("Lỗi giải thích từ khó:", err);
    return res.status(500).json({
      error: err.message || "Không thể giải thích từ vào lúc này. Vui lòng thử lại!",
    });
  }
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
}

startServer();
