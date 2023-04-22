export default class LyricsApi {
  public static async getLyrics(artistName: string, songName: string) {
    const lyricsRes = await fetch("/api/lyrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artistName,
        songName,
      }),
    });

    const lyricsJson = await lyricsRes.json();
    return lyricsJson;
  }
}
