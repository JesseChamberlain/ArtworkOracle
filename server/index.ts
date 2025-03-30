import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { randomInt } from "crypto";
const traverson = require("traverson");
const JsonHalAdapter = require("traverson-hal");
import Anthropic from "@anthropic-ai/sdk";

import { environment, validateEnvironment } from "./config/environment";
import { AnthropicMessageResponse } from "./types/anthropic.types";
import {
  GeneResponse,
  ArtistResponse,
  ArtistsByGeneResponse,
  ArtsyData,
} from "./types/artsy.types";
import { artsyService } from "./services/artsy.service";

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

// Register the HAL adapter and set Artsy API
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
const artsyApi = traverson.from(environment.artsyBaseUrl).jsonHal();

// Configure Anthropic connection
const claude = new Anthropic();

// Claude call with gene and artist
async function claudeWithContext(gene: string, artistName: string) {
  try {
    const systemMsg =
      "Adopt the tone of an erudite art historian speaking to an educated patron. Use precise, scholarly language that reveals nuanced interpretations of artistic works concisely. Weave together contextual historical insights, symbolic analysis, and aesthetic observations with an elegant, measured cadence. Employ sophisticated vocabulary that illuminates the deeper cultural and philosophical significance of the artwork, while maintaining an approachable narrative style. Balance academic depth with narrative accessibility, using carefully constructed sentences that efficiently guide the listener through layers of artistic meaning. Aim to convey complex insights within two paragraphs maximum.";
    const prompt = `What can you tell me about the ${gene}} art movement/genre/technique and the artist ${artistName}?`;
    const tokens = 1000;

    const msg = await claude.messages.create({
      model: environment.anthropicModel,
      max_tokens: tokens,
      temperature: 1,
      system: systemMsg,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });
    console.log(msg);
  } catch (err) {
    console.error("Failed to connect to Anthropic:", err);
    process.exit(1);
  }
}

// Calls a random gene, and then selects a random artist that represents that gene
async function getRandomArtistByGene() {
  const data: ArtsyData = await artsyService.getRandomGeneAndArtist();
  claudeWithContext(data.gene.name, data.artist.name);
  // try {
  //   artsyApi
  //     .newRequest()
  //     .follow("genes")
  //     .withRequestOptions({
  //       headers: {
  //         "X-Xapp-Token": environment.artsyToken,
  //         Accept: "application/vnd.artsy-v2+json",
  //       },
  //     })
  //     .withTemplateParameters({ sample: "true" })
  //     .getResource(function (
  //       error: Error | null,
  //       gene: GeneResponse,
  //       traversal: any,
  //     ) {
  //       if (gene) {
  //         console.log("Gene name: ", gene.name);

  //         traversal
  //           .continue()
  //           .follow("artists")
  //           .withTemplateParameters({ gene_id: gene.id })
  //           .getResource(function (
  //             error: Error | null,
  //             artists: ArtistsByGeneResponse,
  //           ) {
  //             const artist =
  //               artists._embedded.artists[
  //                 randomInt(artists._embedded.artists.length - 1)
  //               ];

  //             console.log("Random Artist: ", artist.name);
  //             claudeWithContext(gene.name, artist.name);
  //           });
  //       }
  //     });
  // } catch (err) {
  //   console.error("Failed to connect to Artsy:", err);
  //   process.exit(1);
  // }
}

getRandomArtistByGene();

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
