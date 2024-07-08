import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const [authData, setAuthData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [limit, setLimit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    isAuthenticated,
    login,
    logout: contextLogout,
  } = useContext(AuthContext);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchAuthData = async (token) => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://api.twitterai.workers.dev/auth", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        setAuthData(data);
        login();

        try {
          const response = await fetch(
            "https://api.twitterai.workers.dev/auth/dashboard",
            {
              method: "GET",
              headers: {
                Authorization: token,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch");
          }

          const data = await response.json();
          setUserData(data);
          setLimit(data)
        } catch (err) {
          console.log(err);
          setError(err.message);
        }

        // try {
        //   const response = await fetch(
        //     "https://api.twitterai.workers.dev/auth/quota",
        //     {
        //       method: "GET",
        //       headers: {
        //         Authorization: token,
        //       },
        //     }
        //   );

        //   if (!response.ok) {
        //     throw new Error("Failed to fetch");
        //   }

        //   const data = await response.json();
        //   setLimit(data);
        // } catch (err) {
        //   console.log(err);
        //   setError(err.message);
        // }
      } catch (err) {
        console.log(err);
        setError(err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileData = async (token) => {
      try {
        const response = await fetch(
          "https://api.twitterai.workers.dev/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        try {
          await chrome.storage.local.set({ userProfile: data });
          console.log("Profile stored successfully", data);
        } catch (error) {
          console.error("Error storing profile:", error);
        }

        return data;
      } catch (error) {
        console.error("Error fetching profile data:", error);
        throw error;
      }
    };

    chrome.storage.local.get(["token"], (result) => {
      console.log("Result ", result);
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        const token = result.token;
        if (token) {
          console.log("Token found", token);
          fetchAuthData(token);
          fetchProfileData(token);
        }
      }
    });
  }, [login, contextLogout]);

  const logout = useCallback(() => {
    chrome.storage.local.remove("token", () => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        setAuthData(null);
        contextLogout();
        setError(null);
        Navigate("/");
      }
    });
  }, [contextLogout, Navigate]);

  return { authData, userData, limit, loading, error, isAuthenticated, logout };
};

export default useAuth;
