import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import Spinner from "../Spinner";
import useStorage from "../../hook/useStorage";
import useAuth  from "../../hook/useAuth";

const Profiles = () => {
  const { getProfilesFromStorage, profiles: profData, loading, token } = useStorage();
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      getProfilesFromStorage().then(() => {
        console.log("Profiles fetched", profData);
      });
    } else {
      console.log("Not authenticated");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setProfiles(profData);
    console.log("Profiles set", profData);
  },[profData, loading])


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
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="flex flex-col items-center justify-center h-full  bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">User Profiles</h1>
      <button className="mb-6 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
        <Link to="/profile/create">Add Profile</Link>
      </button>
      {!profiles? (
        <p className="text-gray-700">No profile found</p>
      ) : (
        <ul className="w-full max-w-md mb-2 h-full overflow-y-scroll bg-white rounded-lg shadow-md">
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
