// Anthropic API response types

// Usage statistics
interface UsageStats {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
}

// Message response type
export interface AnthropicMessageResponse {
  id: string;
  type: string;
  role: "assistant" | "user" | "system";
  model: string;
  content: {
    type: "text";
    text: string;
  };
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | null;
  stop_sequence: string | null;
  usage: UsageStats;
}
