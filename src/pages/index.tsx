import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Link,
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
  const [songLyrics, setSongLyrics] = useState<{
    lyrics: string;
    fullTitle: string;
    url: string;
  } | null>(null);

  const { data: playbackState, error: playbackStateError } = useQuery<
    PlaybackState | undefined,
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

  const emptyPlayer = songName && artistName ? false : true;

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
      <Card bgColor={"gray.600"}>
        <CardHeader>
          <Heading color="whiteAlpha.800">
            {emptyPlayer &&
              "Currently no song is playing. Start doodling on Spotify to sing along!"}
            {!emptyPlayer && (
              <Link href={songLyrics?.url} isExternal>
                {songLyrics?.fullTitle}
              </Link>
            )}
          </Heading>
        </CardHeader>
        <Divider color="whiteAlpha.800" />
        <CardBody>
          <Text whiteSpace="pre-line" color="whiteAlpha.800">
            {songLyrics?.lyrics}
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
