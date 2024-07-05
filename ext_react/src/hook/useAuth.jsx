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
        } catch (err) {
          console.log(err);
          setError(err.message);
        }

        try {
          const response = await fetch(
            "https://api.twitterai.workers.dev/auth/quota",
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
          setLimit(data);
        } catch (err) {
          console.log(err);
          setError(err.message);
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    chrome.storage.local.get(["token"], (result) => {
      console.log("Result ", result);
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      } else {
        const token = result.token;
        fetchAuthData(token);
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
