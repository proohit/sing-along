import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const params = window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial: any, item) => {
        if (item) {
          const parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (params.access_token) {
      localStorage.setItem("access_token", params.access_token);
    }

    if (params.expires_in) {
      localStorage.setItem(
        "expires_at",
        (Date.now() + params.expires_in * 1000).toString()
      );
    }

    if (params.access_token && params.expires_in) {
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "There was an error logging in to Spotify",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [window.location.hash]);

  return <></>;
};
