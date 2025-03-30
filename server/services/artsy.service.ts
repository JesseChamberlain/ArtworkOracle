import { randomInt } from "crypto";
import { environment } from "../config/environment";
import {
  GeneResponse,
  ArtistResponse,
  ArtistsByGeneResponse,
  ArtsyData,
} from "../types/artsy.types";

const traverson = require("traverson");
const JsonHalAdapter = require("traverson-hal");

// Register the HAL adapter for Artsy API
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);

class ArtsyService {
  private api: any;

  constructor() {
    this.api = traverson.from(environment.artsyBaseUrl).jsonHal();
  }

  // Gets a random gene from the Artsy API
  async getRandomGene(): Promise<GeneResponse> {
    return new Promise((resolve, reject) => {
      this.api
        .newRequest()
        .follow("genes")
        .withRequestOptions({
          headers: {
            "X-Xapp-Token": environment.artsyToken,
            Accept: "application/vnd.artsy-v2+json",
          },
          qs: { sample: "true" },
        })
        .getResource((error: Error | null, gene: GeneResponse) => {
          if (error) {
            return reject(error);
          }
          if (!gene) {
            return reject(new Error("Invalid gene response from Artsy API"));
          }
          resolve(gene);
        });
    });
  }

  // Gets a list of artists by gene and returns one at random
  async getRandomArtistByGene(geneId: string): Promise<ArtistResponse> {
    console.log("Gene ID: ", geneId);
    return new Promise((resolve, reject) => {
      this.api
        .newRequest()
        .follow("artists")
        .withRequestOptions({
          headers: {
            "X-Xapp-Token": environment.artsyToken,
            Accept: "application/vnd.artsy-v2+json",
          },
          qs: { gene_id: geneId },
        })
        .getResource((error: Error | null, response: ArtistsByGeneResponse) => {
          console.log("ArtistsByGene: ", response);
          if (error) {
            return reject(error);
          }
          if (!response || !response._embedded.artists.length) {
            return reject(new Error("No artists found for this gene"));
          }

          const artists = response._embedded.artists;
          console.log("Artists: ", artists);
          const randomIndex = randomInt(0, artists.length - 1);
          const artist: ArtistResponse = artists[randomIndex];
          console.log("Artist: ", artist);
          resolve(artist);
        });
    });
  }

  // Calls the Artsy API to retrieve a random gene and artist
  async getRandomGeneAndArtist(): Promise<ArtsyData> {
    try {
      const gene: GeneResponse = await this.getRandomGene();
      console.log("Gene: ", gene);
      const artist: ArtistResponse = await this.getRandomArtistByGene(gene.id);
      return { gene, artist };
    } catch (error) {
      console.log("Error getting random gene and artist: ", error);
      throw error;
    }
  }
}

export const artsyService = new ArtsyService();
