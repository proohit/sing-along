import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import SpotifyApi from "../services/SpotifyApi";

type SpotifyTokenContextType = {
  accessToken: string | null;
};

export const SpotifyTokenContext = createContext<SpotifyTokenContextType>({
  accessToken: null,
});

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    function syncStorage() {
      const localStorageAccessToken = localStorage.getItem("access_token");
      const expiresAt = Number(localStorage.getItem("expires_at"));

      if (!localStorageAccessToken || !expiresAt || expiresAt <= Date.now()) {
        setAccessToken(null);
        window.location.href = SpotifyApi.getAuthUrl();
      } else {
        setAccessToken(localStorageAccessToken);
      }
    }

    window.addEventListener("storage", syncStorage);
    syncStorage();

    return () => {
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  return (
    <SpotifyTokenContext.Provider value={{ accessToken }}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};

export const useSpotifyToken = () => useContext(SpotifyTokenContext);
