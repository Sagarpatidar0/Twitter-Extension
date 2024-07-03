import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      console.log("Getting token from storage");
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

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!token) return;

      console.log("Fetching profiles");
      try {
        const response = await fetch(
          "https://api.twitterai.workers.dev/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token]);

  const handleUpdate = (id) => {
    console.log(`Update profile with id: ${id}`);
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch(
        `https://api.twitterai.workers.dev/auth/profile`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      setProfiles(profiles.filter((profile) => profile.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Profiles</h1>
      {profiles.length === 0 ? (
        <p>No profile found</p>
      ) : (
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id}>
              <h2>{profile.name}</h2>
              <p>{profile.description}</p>
              <button onClick={() => handleUpdate(profile.id)}>
                <Link
                  to={`/profile/update/${profile.id}/${profile.name}/${profile.description}/${token}`}
                >
                  Update
                </Link>
              </button>
              <button onClick={() => handleDelete(profile.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profiles;
