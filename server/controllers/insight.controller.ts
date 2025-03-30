import { randomInt } from "crypto";
import { Request, Response, NextFunction } from "express";
import { artsyService } from "../services/artsy.service";
import { anthropicService } from "../services/anthropic.service";
import { HttpError } from "../middleware/error.middleware";
import { ArtsyData, ArtistResponse, GeneResponse } from "../types/artsy.types";
import { AnthropicMessageResponse } from "../types/anthropic.types";

interface ArtistGeneData {
  gene: GeneResponse;
  artist: ArtistResponse;
  message: AnthropicMessageResponse;
}

export const getRandomInsight = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get random gene and artist
    const data: ArtsyData = await artsyService.getRandomGeneAndArtist();

    if (
      !data ||
      !data.artists ||
      !data.artists._embedded ||
      !data.artists._embedded.artists.length
    ) {
      throw new HttpError(404, "No artists found for the selected gene");
    }

    // Selects random artist from ArtistsByGeneResponse
    const randomIndex = randomInt(0, data.artists._embedded.artists.length - 1);
    const artist: ArtistResponse = data.artists._embedded.artists[randomIndex];

    // Get Claude's insights
    const message: AnthropicMessageResponse =
      await anthropicService.getArtInsight(data.gene.name, artist.name);

    // Format and return response
    const response: ArtistGeneData = {
      gene: data.gene,
      artist: artist,
      message: message,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
};
