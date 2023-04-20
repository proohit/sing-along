import { useEffect, useState } from "react";
import { PlaybackState } from "../interfaces/SpotifyApi";
import SpotifyApi from "../services/SpotifyApi";

export default () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(
    null
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      window.location = SpotifyApi.getAuthUrl();
    }

    SpotifyApi.getPlaybackState(accessToken).then((res) => {
      setPlaybackState(res);
    });
  }, []);
  console.log(playbackState?.item?.artists);
  return (
    <>
      <p>
        Currently Playing:{" "}
        {playbackState?.item?.artists
          ?.map?.((artist) => artist.name)
          ?.join?.(", ")}{" "}
        - {playbackState?.item?.name}
      </p>
    </>
  );
};
