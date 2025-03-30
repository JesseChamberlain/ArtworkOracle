import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// /server/ files
import { environment, validateEnvironment } from "./config/environment";
import { ArtsyData, ArtistResponse } from "./types/artsy.types";
import { AnthropicMessageResponse } from "./types/anthropic.types";
import { artsyService } from "./services/artsy.service";
import { anthropicService } from "./services/anthropic.service";

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Claude call with gene and artist
// async function getClaudeInsight(geneName: string, artistName: string) {
//   const message: AnthropicMessageResponse =
//     await anthropicService.getArtInsight(geneName, artistName);
//   console.log("Claude insight: ", message.content[0].text);
// }

// // Calls a random gene, and then selects a random artist that represents that gene
// async function getRandomArtistByGene() {
//   const data: ArtsyData = await artsyService.getRandomGeneAndArtist();

//   // Selects random artist from ArtistsByGeneResponse
//   const randomIndex = randomInt(0, data.artists._embedded.artists.length - 1);
//   const artist: ArtistResponse = data.artists._embedded.artists[randomIndex];
//   console.log(`Gene: ${data.gene.name}, Artist: ${artist.name}`);

//   getClaudeInsight(data.gene.name, artist.name);
// }

// getRandomArtistByGene();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../dist")));

// API routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// All remaining requests return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(environment.port, () => {
  console.log(`Server running on port ${environment.nodeEnv}`);
});
