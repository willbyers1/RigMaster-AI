
// @google/genai guidelines: Always use process.env.API_KEY directly and exclusively.
import { GoogleGenAI, Type } from "@google/genai";
import { FPSResult, RigProfile } from "../types";
import { useStore } from "../store";

export class GeminiService {
  private getClient() {
    // Exclusively obtain the API key from the environment variable process.env.API_KEY.
    // Create a new instance right before making an API call for consistency.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private handleError(error: any): never {
    const message = error?.message || "";
    // If the request fails with 401/invalid or "Requested entity was not found", reset the state.
    if (message.includes("401") || message.includes("invalid") || message.includes("Requested entity was not found")) {
      useStore.getState().disconnect();
      throw new Error("Invalid System Key. Please check your project credentials and billing status.");
    }
    throw error;
  }

  async predictFPS(rig: RigProfile, gameTitle: string): Promise<FPSResult> {
    try {
      const ai = this.getClient();
      // Using gemini-3-pro-preview for complex reasoning tasks such as performance benchmarks.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a hardware benchmark expert. Estimate the average FPS for "${gameTitle}" at "${rig.resolution}" resolution with the following hardware: CPU: ${rig.cpu}, GPU: ${rig.gpu}, RAM: ${rig.ram}GB. Consider that it's a ${rig.type}. Return the results as a JSON object with keys "low", "medium", "ultra" (numbers) and "bottleneck" (string describing the primary bottleneck).`,
        config: {
          // Setting a thinking budget for detailed reasoning in complex performance estimations.
          thinkingConfig: { thinkingBudget: 4096 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              low: { type: Type.NUMBER },
              medium: { type: Type.NUMBER },
              ultra: { type: Type.NUMBER },
              bottleneck: { type: Type.STRING }
            },
            required: ["low", "medium", "ultra", "bottleneck"]
          }
        }
      });

      // Directly access the .text property (it is a getter, not a method).
      const jsonStr = response.text || '{}';
      const data = JSON.parse(jsonStr);
      return { ...data, confidence: 0.95 };
    } catch (e) {
      return this.handleError(e);
    }
  }

  async getMaintenanceWizardSteps(task: 'PASTE' | 'FAN', rigType: string): Promise<string[]> {
    try {
      const ai = this.getClient();
      // Using gemini-3-flash-preview for general text instruction tasks.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a 5-step concise guide for ${task === 'PASTE' ? 'replacing thermal paste' : 'cleaning fans'} on a ${rigType}. Return as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // Correctly access the .text property.
      const jsonStr = response.text || '[]';
      return JSON.parse(jsonStr);
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const geminiService = new GeminiService();
