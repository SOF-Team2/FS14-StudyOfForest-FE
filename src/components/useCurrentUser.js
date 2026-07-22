import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/users/me", {
          signal: controller.signal,
        });

        setCurrentUser(response.data?.data ?? null);
      } catch (error) {
        if (
          error.name !== "AbortError" &&
          error.name !== "CanceledError" &&
          error.code !== "ERR_CANCELED"
        ) {
          setCurrentUser(null);
        }
      }
    };

    fetchCurrentUser();

    return () => controller.abort();
  }, []);

  return currentUser;
}

export default useCurrentUser;
