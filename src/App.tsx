import { Container, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { SpotifyTokenProvider } from "./components/SpotifyTokenProvider";
import Home from "./pages/Home";
import SpotifyLogin from "./pages/SpotifyLogin";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Navbar />
      <Container>
        <QueryClientProvider client={queryClient}>
          <SpotifyTokenProvider>
            <BrowserRouter>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/spotify-login" element={<SpotifyLogin />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SpotifyTokenProvider>
        </QueryClientProvider>
      </Container>
    </>
  );
}

export default App;
