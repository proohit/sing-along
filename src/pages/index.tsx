import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { SpotifyTokenContext } from "../components/SpotifyTokenProvider";
import { PlaybackState } from "../interfaces/SpotifyApi";
import LyricsApi from "../services/LyricsApi";
import SpotifyApi from "../services/SpotifyApi";

export default function Home() {
  const { accessToken } = useContext(SpotifyTokenContext);
  const [songLyrics, setSongLyrics] = useState<string | null>(null);

  const { data: playbackState, error: playbackStateError } = useQuery<
    PlaybackState,
    Error
  >("playbackState", () => SpotifyApi.getPlaybackState(accessToken as string), {
    enabled: !!accessToken,
    refetchInterval: 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const toast = useToast();

  const songName = playbackState?.item?.name;
  const artistName = playbackState?.item?.artists
    ?.map?.((artist) => artist.name)
    ?.join?.(", ");

  useEffect(() => {
    async function getLyrics() {
      if (songName && artistName) {
        const lyrics = await LyricsApi.getLyrics(artistName, songName);
        setSongLyrics(lyrics);
      }
    }

    getLyrics();
  }, [songName, artistName]);

  useEffect(() => {
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
  }, [playbackStateError, toast]);

  return (
    <Box m={2}>
      <Card bgColor={"gray.500"}>
        <CardHeader>
          <Heading color="whiteAlpha.800">
            {artistName} - {songName}
          </Heading>
        </CardHeader>
        <CardBody>
          <Text whiteSpace="pre-line" color="whiteAlpha.800">
            {songLyrics}
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
