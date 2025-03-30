import { environment } from "../config/environment";
import {
  GeneResponse,
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

  // Calls the Artsy API to retrieve a random gene and then artist
  async getRandomGeneAndArtist(): Promise<ArtsyData> {
    try {
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
          .getResource(
            (error: Error | null, gene: GeneResponse, traversal: any) => {
              if (error) {
                return reject(error);
              }

              if (!gene) {
                return reject(
                  new Error("Invalid gene response from Artsy API"),
                );
              }

              // Utilize traversal to make second API call
              traversal
                .continue()
                .follow("artists")
                .withRequestOptions({
                  headers: {
                    "X-Xapp-Token": environment.artsyToken,
                    Accept: "application/vnd.artsy-v2+json",
                  },
                  qs: { gene_id: gene.id },
                })
                .getResource(
                  (error: Error | null, artists: ArtistsByGeneResponse) => {
                    if (error) {
                      return reject(error);
                    }

                    if (!artists || !artists._embedded.artists.length) {
                      return reject(
                        new Error("No artists found for this gene"),
                      );
                    }

                    // Return the gene and artists as an ArstyData type
                    resolve({ gene, artists });
                  },
                );
            },
          );
      });
    } catch (error) {
      console.log("Error getting random gene and artist: ", error);
      throw error;
    }
  }
}

export const artsyService = new ArtsyService();
