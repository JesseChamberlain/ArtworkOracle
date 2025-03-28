import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { randomInt } from "crypto";
const traverson = require("traverson");
const JsonHalAdapter = require("traverson-hal");

// Register the HAL adapter
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
const artsyApi = traverson.from("https://api.artsy.net/api").jsonHal();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interfaces

// Calls a random gene, and then selects a random artist that represents that gene
async function getRandomArtistByGene() {
  try {
    artsyApi
      .newRequest()
      .follow("genes")
      .withRequestOptions({
        headers: {
          "X-Xapp-Token": process.env.ARTSY_TEMP_TOKEN,
          Accept: "application/vnd.artsy-v2+json",
        },
      })
      .withTemplateParameters({ sample: "true" })
      .getResource(function (error: Error | null, gene: any, traversal: any) {
        if (gene && typeof gene === "object") {
          console.log("Gene name: ", gene.name);

          traversal
            .continue()
            .follow("artists")
            .withTemplateParameters({ gene_id: gene.id })
            .getResource(function (error: Error | null, artists: any) {
              const artist =
                artists._embedded.artists[
                  randomInt(artists._embedded.artists.length - 1)
                ];

              console.log("Random Artist: ", artist.name);
            });
        }
      });
  } catch (err) {
    console.error("Failed to connect to Artsy:", err);
    process.exit(1);
  }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
