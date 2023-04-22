import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { useQuery } from "react-query";
import { SpotifyTokenContext } from "../components/SpotifyTokenProvider";
import { PlaybackState } from "../interfaces/SpotifyApi";
import SpotifyApi from "../services/SpotifyApi";

export default () => {
  const { accessToken } = useContext(SpotifyTokenContext);

  const { data: playbackState, error: playbackStateError } = useQuery<
    PlaybackState,
    Error
  >("playbackState", () => SpotifyApi.getPlaybackState(accessToken as string), {
    enabled: !!accessToken,
    //refetchInterval: 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const toast = useToast();

  if (playbackStateError) {
    toast({
      title: "Error",
      description: `There was an error getting your playback state. ${playbackStateError.message}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    console.error(playbackStateError);
  }

  const songName = playbackState?.item?.name;
  const artistName = playbackState?.item?.artists
    ?.map?.((artist) => artist.name)
    ?.join?.(", ");

  return (
    <>
      <p>
        Currently Playing: {artistName} - {songName}
      </p>
    </>
  );
};
