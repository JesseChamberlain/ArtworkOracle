import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Environment {
  nodeEnv: string;
  port: number;
  artsyBaseUrl: string;
  artsyToken: string;
  anthropicApiKey: string;
  anthropicModel: string;
}

export const environment: Environment = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  artsyBaseUrl: process.env.ARTSY_API_URL || "https://api.artsy.net/api",
  artsyToken: process.env.ARTSY_TEMP_TOKEN || "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  anthropicModel: process.env.ANTHROPIC_MODEL || "claude-3-7-sonnet-20250219",
};

// Validate required environment variables
export function validateEnvironment(): void {
  const requiredVars = ["ARTSY_TEMP_TOKEN", "ANTHROPIC_API_KEY"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}
