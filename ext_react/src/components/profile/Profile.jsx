import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./profile.css";

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
    return (
      <div className="flex flex-col items-center justify-center max-h-screen min-h-full bg-gray-100 p-4">
      {loading && <p className="text-xl text-gray-700">Loading...</p>}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 p-4 hide-scrollbar">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">User Profiles</h1>
      <button className="mb-6 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
        <Link to="/profile/create">Add Profile</Link>
      </button>
      {profiles.length === 0 ? (
        <p className="text-gray-700">No profile found</p>
      ) : (
        <ul className="w-full max-w-md mb-8 bg-white rounded-lg shadow-md">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="p-4 border-b border-gray-200 last:border-0"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-gray-600">{profile.description}</p>
              <div className="flex space-x-2 mt-4">
                <Link
                  to={`/profile/update/${profile.id}/${profile.name}/${profile.description}/${token}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profiles;
