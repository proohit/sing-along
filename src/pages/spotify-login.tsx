import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LocalStorage } from "../constants/local-storage";
import { Routes } from "../constants/routes";

export default function SpotifyLogin() {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const params = router.asPath
      .split("#")[1]
      .split("&")
      .reduce((initial: any, item) => {
        if (item) {
          const parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (params.access_token) {
      localStorage.setItem(LocalStorage.AccessToken, params.access_token);
    }

    if (params.expires_in) {
      localStorage.setItem(
        LocalStorage.ExpiresAt,
        (Date.now() + params.expires_in * 1000).toString()
      );
    }

    if (params.access_token && params.expires_in) {
      router.push(Routes.Home);
    } else {
      toast({
        title: "Error",
        description: "There was an error logging in to Spotify",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, []);

  return <></>;
}
