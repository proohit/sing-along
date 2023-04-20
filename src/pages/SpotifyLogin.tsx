import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const navigate = useNavigate();

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
      localStorage.setItem("expires_in", params.expires_in);
    }

    navigate("/");
  }, [window.location.hash]);

  return <></>;
};
