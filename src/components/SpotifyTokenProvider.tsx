import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { LocalStorage } from "../constants/local-storage";
import { Routes } from "../constants/routes";
import SpotifyApi from "../services/SpotifyApi";

type SpotifyTokenContextType = {
  accessToken: string | null;
};

export const SpotifyTokenContext = createContext<SpotifyTokenContextType>({
  accessToken: null,
});

export const SpotifyTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    function syncStorage() {
      const localStorageAccessToken = localStorage.getItem(
        LocalStorage.AccessToken
      );
      const expiresAt = Number(localStorage.getItem(LocalStorage.ExpiresAt));
      const isExpired = expiresAt <= Date.now();
      const validToken = localStorageAccessToken && expiresAt && !isExpired;
      const isLoginPage = router.pathname === Routes.SpotifyLogin;

      if (!validToken && !isLoginPage) {
        setAccessToken(null);
        router.push(SpotifyApi.getAuthUrl());
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

  const contextValue = useMemo(() => ({ accessToken }), [accessToken]);

  return (
    <SpotifyTokenContext.Provider value={contextValue}>
      {children}
    </SpotifyTokenContext.Provider>
  );
};
