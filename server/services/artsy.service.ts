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
                  (error: Error | null, response: ArtistsByGeneResponse) => {
                    if (error) {
                      return reject(error);
                    }

                    if (!response || !response._embedded.artists.length) {
                      return reject(
                        new Error("No artists found for this gene"),
                      );
                    }

                    // Selects random artist from ArtistsByGeneResponse
                    const randomIndex = randomInt(
                      0,
                      response._embedded.artists.length - 1,
                    );
                    const artist: ArtistResponse =
                      response._embedded.artists[randomIndex];

                    // Return the gene and artist as an ArstyData type
                    const artsyData: ArtsyData = { gene, artist };
                    console.log(
                      `Gene: ${artsyData.gene.name}, Artist: ${artsyData.artist.name}`,
                    );
                    resolve(artsyData);
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
