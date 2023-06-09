import { v4 as uuidv4 } from "uuid";
import { PlaybackState } from "../interfaces/SpotifyApi";

export default class SpotifyApi {
  private static readonly clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  private static readonly redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  private static readonly scope = "user-read-playback-state";

  public static getAuthUrl() {
    const id = uuidv4();
    localStorage.setItem("spotify_auth_state", id);
    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(this.clientId as string);
    url += "&scope=" + encodeURIComponent(this.scope);
    url += "&redirect_uri=" + encodeURIComponent(this.redirectUri as string);
    url += "&state=" + encodeURIComponent(id);
    return url;
  }

  public static async getPlaybackState(
    accessToken: string
  ): Promise<PlaybackState | undefined> {
    const res = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data;
    }
  }
}
