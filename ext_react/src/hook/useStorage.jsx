import { useState, useEffect } from "react";

const useStorage = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  // Fetch token from Chrome storage
  useEffect(() => {
    const getToken = async () => {
      console.log("Getting token from storage in useStorage hook");
      try {
        const result = await chrome.storage.local.get(["token"]);
        if (result.token) {
          setToken(result.token);
        } else {
          console.error("Token not found");
          setError("Token not found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        setError("Error retrieving token");
        setLoading(false);
      }
    };

    getToken();
  }, []);

  const fetchDataAndStore = async (token) => {
    console.log("Fetching data and storing in useStorage hook");
    if (!token) return;

    setLoading(true);
    try {
      const [dashboardResponse, profilesResponse] = await Promise.all([
        fetch("https://api.twitterai.workers.dev/auth/dashboard", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }),
        fetch("https://api.twitterai.workers.dev/auth/profile", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }),
      ]);

      if (!dashboardResponse.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      if (!profilesResponse.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const dashboardData = await dashboardResponse.json();
      const profilesData = await profilesResponse.json();

      setDashboard(dashboardData);
      setProfiles(profilesData);

      await chrome.storage.local.set({
        dashboard: dashboardData,
        profiles: profilesData,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      console.log("Data fetched and stored");
      setLoading(false);
    }
  };

  const fetchProfileDataAndStore = async (token) => {
    console.log("Fetching profile data and storing in useStorage hook");
    if (!token) return;

    setLoading(true);
    try {
      const [profilesResponse] = await Promise.all([
        fetch("https://api.twitterai.workers.dev/auth/profile", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }),
      ]);

      if (!profilesResponse.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const profilesData = await profilesResponse.json();

      setProfiles(profilesData);

      await chrome.storage.local.set({
        profiles: profilesData,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      console.log("Profile Data fetched and stored");
      setLoading(false);
    }
  };

  // Retrieve data from Chrome storage
  const getDashboardFromStorage = async () => {
    setLoading(true);
    try {
      const result = await chrome.storage.local.get(["dashboard"]);
      if (result.dashboard) {
        setDashboard(result.dashboard);
      } else {
        console.error("Dashboard not found in storage");
        setError("Dashboard not found in storage");
      }
    } catch (error) {
      console.error("Error retrieving dashboard from storage:", error);
      setError("Error retrieving dashboard from storage");
    } finally {
      setLoading(false);
    }
  };

  const getProfilesFromStorage = async () => {
    setLoading(true);
    try {
      const result = await chrome.storage.local.get(["profiles"]);
      if (result.profiles) {
        setProfiles(result.profiles);
      } else {
        console.error("Profiles not found in storage");
        setError("Profiles not found in storage");
      }
    } catch (error) {
      console.error("Error retrieving profiles from storage:", error);
      setError("Error retrieving profiles from storage");
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    error,
    loading,
    profiles,
    dashboard,
    fetchDataAndStore,
    fetchProfileDataAndStore,
    getDashboardFromStorage,
    getProfilesFromStorage,
  };
};

export default useStorage;
