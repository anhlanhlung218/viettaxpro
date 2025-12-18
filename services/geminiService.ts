import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GOOGLE_API_KEY environment variable is not set");
}

const client = new GoogleGenerativeAI(apiKey);

export const geminiService = {
  async generateContent(prompt: string) {
    try {
      const model = client.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  },
};
