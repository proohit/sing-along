import { Container, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SpotifyLogin from "./pages/SpotifyLogin";

function App() {
  return (
    <>
      <Navbar />
      <Container>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/spotify-login" element={<SpotifyLogin />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
