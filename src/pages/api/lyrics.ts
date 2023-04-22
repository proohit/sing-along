// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  lyrics: string;
};

class GeniusApi {
  private static readonly baseUrl = "https://api.genius.com";
  private static readonly token = process.env.GENIUS_ACCESS_TOKEN;

  public static async searchSongs(artistName: string, songName: string) {
    const url = `${this.baseUrl}/search?q=${artistName} ${songName}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const data = await response.json();
    return data;
  }
}

async function searchLyrics(artistName: string, songName: string) {
  const result = await GeniusApi.searchSongs(artistName, songName);
  const song = result.response.hits[0].result;
  const songUrl = song.url;

  const songUrlRes = await fetch(songUrl);
  const songUrlHtml = await songUrlRes.text();
  const $ = cheerio.load(songUrlHtml);
  const lyrics = $("[data-lyrics-container]")
    .find("br")
    .replaceWith("\n")
    .end()
    .text();
  return lyrics;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { artistName, songName } = req.body;
  const lyrics = await searchLyrics(artistName as string, songName as string);
  res.status(200).json({ lyrics });
}
