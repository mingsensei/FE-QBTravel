import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Service for chatbot responses
 * Handles communication with Google's Generative AI API
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generate a response about Quang Binh, Vietnam
   * @param prompt - User's question or prompt
   * @returns Promise<string> - AI response
   */
  async generateResponse(prompt: string): Promise<string> {
    try {
      const context = `You are a knowledgeable tour guide specializing in Quang Binh Province, Vietnam. 
      You can provide detailed information about famous places, attractions, culture, history, and travel tips in Quang Binh.
      
      Famous places in Quang Binh include:
      - Phong Nha-Ke Bang National Park (UNESCO World Heritage Site)
      - Son Tra Cave (Paradise Cave)
      - Phong Nha Cave
      - Dark Cave (Hang Toi)
      - Chay River - Dark Cave
      - Dong Hoi City
      - Nhat Le Beach
      - Quang Phu Sand Dunes
      - Ho Chi Minh Trail
      - Vinh Moc Tunnels
      - And many other beautiful limestone caves and natural attractions
      
      Please provide helpful, accurate, and engaging information about these places. 
      If asked about places outside of Quang Binh, politely redirect the conversation back to Quang Binh attractions.
      
      User question: ${prompt}`;

      const result = await this.model.generateContent(context);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }
}