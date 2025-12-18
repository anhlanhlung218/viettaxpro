
import { GoogleGenAI } from "@google/genai";
import { TaxResult } from "../types";

export const getTaxAdvice = async (result: TaxResult) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Dựa trên kết quả tính thuế thu nhập cá nhân tại Việt Nam sau đây:
    - Lương Gross: ${result.grossSalary.toLocaleString()} VND
    - Lương Net: ${result.netSalary.toLocaleString()} VND
    - Thuế TNCN phải nộp: ${result.personalIncomeTax.toLocaleString()} VND
    - Các khoản bảo hiểm: ${(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance).toLocaleString()} VND
    - Giảm trừ gia cảnh: ${(result.selfDeduction + result.dependentDeduction).toLocaleString()} VND
    - Thu nhập tính thuế: ${result.taxableIncome.toLocaleString()} VND

    Hãy đưa ra 3 lời khuyên ngắn gọn, chuyên nghiệp và thân thiện về:
    1. Cách tối ưu thuế TNCN hợp pháp (ví dụ: người phụ thuộc, từ thiện, bảo hiểm hưu trí tự nguyện).
    2. Giải thích nhanh tại sao họ phải đóng mức thuế này.
    3. Một nhận xét về mức thu nhập này so với mặt bằng chung tại Việt Nam hiện nay (mang tính khích lệ).
    
    Yêu cầu trả về bằng tiếng Việt, định dạng Markdown, không quá 200 từ.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể kết nối với chuyên gia AI lúc này. Vui lòng thử lại sau.";
  }
};
