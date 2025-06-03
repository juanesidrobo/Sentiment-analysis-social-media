const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface SentimentRequest {
  text: String;
}

export interface SentimentResponse {
  text: string;
  sentiment: string;
  confidence: number;      // Cambiar a number
  method: string;          // Agregar method
  polarity?: number;       // Opcional
  subjectivity?: number;   // Opcional
}

export interface SentimentAnalysisService {
  analyzeSentiment: (text: string) => Promise<SentimentResponse>;
}

class SentimentService implements SentimentAnalysisService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error("Unknown network error occurred");
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentResponse> {
    if (!text.trim()) {
      throw new Error("Text cannot be empty");
    }

    const requestData: SentimentRequest = { text };

    return this.makeRequest<SentimentResponse>("/sentiment/analyze", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }
}

export const sentimentService = new SentimentService();
