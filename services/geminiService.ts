
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Sentence } from '../types';

// The API key MUST be obtained exclusively from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible in the execution context.
// Initialize GoogleGenAI client directly with process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates content using the Gemini API.
 * @param prompt The text prompt to send to the model.
 * @returns The generated text content or an error message.
 */
export const generateTextFromGemini = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    if (text) {
      return text;
    } else {
      console.warn("Gemini response.text was empty or undefined.", response);
      return "No text content received from Gemini.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error generating content: ${error.message}`;
    }
    return "An unknown error occurred while generating content.";
  }
};

/**
 * Generates content with system instructions.
 */
export const generateTextWithSystemInstruction = async (prompt: string, systemInstruction: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Example config
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API with system instruction:", error);
    if (error instanceof Error) {
        return `Error generating content with system instruction: ${error.message}`;
    }
    return "An unknown error occurred while generating content with system instruction.";
  }
};

/**
 * Example of generating JSON response from Gemini.
 */
export const getStructuredDataFromGemini = async (promptForJson: string): Promise<object | string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptForJson,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ```
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e, "Raw string:", jsonStr);
      return "Failed to parse JSON response.";
    }
  } catch (error) {
    console.error("Error calling Gemini API for JSON:", error);
    if (error instanceof Error) {
        return `Error fetching structured data: ${error.message}`;
    }
    return "An unknown error occurred while fetching structured data.";
  }
};


/**
 * Generates practice sentences using the Gemini API.
 * @param gradeLevel The target grade level name (e.g., "中学1年生").
 * @param unitFocus A description of the grammar or topic focus, typically derived from unit title and tags.
 * @param count The number of sentences to generate.
 * @param gradeId The ID of the grade (e.g., "grade1") for unique ID generation.
 * @param unitIdForAi The ID of the unit (e.g., "ai-unit1") for unique ID generation.
 * @returns A promise that resolves to an array of Sentence objects or null if an error occurs.
 */
export const generatePracticeSentences = async (
  gradeLevel: string, // e.g., "中学1年生" (name of the grade)
  unitFocus: string,  // e.g., "Unit 1 – New School, New Friends (be動詞、一般動詞など) の内容に基づいて"
  count: number,
  gradeId: string, 
  unitIdForAi: string // e.g. "ai-unit1" to signify AI context for this specific unit
): Promise<Sentence[] | null> => {
  const prompt = `
あなたは日本の${gradeLevel}向けの英語文法練習問題を作成するAIアシスタントです。
以下の指示に従って、${count}個のユニークな英語の練習問題を指定されたJSON形式で生成してください。

指示：
1.  各問題は、英語の文章とその日本語訳（翻訳タスクとして提示）、そして文法事項の簡単な解説を含みます。
2.  問題の英語レベルは${gradeLevel}に合わせ、特に「${unitFocus}」で示される内容に関連する文法事項や語彙を中心にしてください。
3.  出力は、指定されたJSONオブジェクトの配列形式でなければなりません。他のテキストや説明は含めないでください。

JSONオブジェクトの構造：
{
  "id": "gemini-${gradeId}-${unitIdForAi}-連番 (例: gemini-grade1-ai-unit1-0)",
  "japaneseQuestion": "「[日本語の文]」を英語で表現しましょう。",
  "words": ["[単語1]", "[単語2]", ".", "?"], // 正しい語順の英単語配列（句読点も含む）
  "grammarTag": "文法タグ (例: be動詞の疑問文)",
  "explanation": "簡単な日本語の解説（50字以内）"
}

生成する問題数: ${count}個

例：
{
  "id": "gemini-grade1-ai-unit1-0",
  "japaneseQuestion": "「これは新しい本です。」を英語で表現しましょう。",
  "words": ["This", "is", "a", "new", "book", "."],
  "grammarTag": "This is ~.",
  "explanation": "「これは～です」と近くの物を指す時に使います。"
}

上記の形式で、有効なJSON配列を返してください。配列の前後には何も記述しないでください。
`;

  try {
    const result = await getStructuredDataFromGemini(prompt);
    if (typeof result === 'string') {
      console.error("Gemini did not return valid JSON object for sentences:", result);
      throw new Error("AIからの応答が不正です（JSON形式ではありません）。");
    }

    if (!Array.isArray(result)) {
      console.error("Gemini response is not an array:", result);
      throw new Error("AIからの応答が不正です（配列ではありません）。");
    }

    const sentences: Sentence[] = [];
    for (let i = 0; i < result.length; i++) {
      const item = result[i] as any;
      if (
        item.id && // Gemini might generate its own ID, we will override it
        typeof item.japaneseQuestion === 'string' &&
        Array.isArray(item.words) &&
        item.words.every((w: any) => typeof w === 'string') &&
        typeof item.grammarTag === 'string' &&
        typeof item.explanation === 'string'
      ) {
        // Ensure ID is unique as per our format
        const uniqueId = `gemini-${gradeId}-${unitIdForAi}-${i}`;
        sentences.push({
          id: uniqueId, 
          japaneseQuestion: item.japaneseQuestion,
          words: item.words,
          grammarTag: item.grammarTag,
          explanation: item.explanation,
        });
      } else {
        console.warn("Invalid sentence item from Gemini:", item);
      }
    }
    
    if (sentences.length === 0 && count > 0 && result.length > 0) {
        console.error("AI response contained items, but none were valid sentence structures.");
        throw new Error("AIからの応答には有効な問題形式が含まれていませんでした。");
    }
    
    return sentences;
  } catch (error) {
    console.error("Error in generatePracticeSentences:", error);
    return null;
  }
};
