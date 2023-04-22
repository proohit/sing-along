import "@/styles/globals.css";
import { ChakraProvider, Container } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "../components/Navbar";
import { SpotifyTokenProvider } from "../components/SpotifyTokenProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Navbar />
      <Container>
        <QueryClientProvider client={queryClient}>
          <SpotifyTokenProvider>
            <Component {...pageProps} />
          </SpotifyTokenProvider>
        </QueryClientProvider>
      </Container>
    </ChakraProvider>
  );
}
