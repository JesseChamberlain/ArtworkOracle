import Anthropic from "@anthropic-ai/sdk";
import { environment } from "../config/environment";
import { AnthropicMessageResponse } from "../types/anthropic.types";

class AnthropicService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: environment.anthropicApiKey,
    });
  }

  // Get an insightful response about a gene and artist
  async getArtInsight(
    geneName: string,
    artistName: string,
  ): Promise<AnthropicMessageResponse> {
    try {
      const systemPrompt =
        "Adopt the tone of an erudite art historian speaking to an educated patron. Use precise, scholarly language that reveals nuanced interpretations of artistic works concisely. Weave together contextual historical insights, symbolic analysis, and aesthetic observations with an elegant, measured cadence. Employ sophisticated vocabulary that illuminates the deeper cultural and philosophical significance of the artwork, while maintaining an approachable narrative style. Balance academic depth with narrative accessibility, using carefully constructed sentences that efficiently guide the listener through layers of artistic meaning. Aim to convey complex insights within two paragraphs maximum.";
      const userPrompt = `What can you tell me about the ${geneName}} art movement/genre/technique and the artist ${artistName}?`;
      const tokens = 500;

      const response: AnthropicMessageResponse =
        await this.client.messages.create({
          model: environment.anthropicModel,
          max_tokens: tokens,
          temperature: 1,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: userPrompt,
                },
              ],
            },
          ],
        });

      return response;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw new Error(
        `Failed to get art insights: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export const anthropicService = new AnthropicService();
