import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import Spinner from "../Spinner";
import useStorage from "../../hook/useStorage";
import useAuth from "../../hook/useAuth";

const Profiles = () => {
  const {
    getProfilesFromStorage,
    fetchProfileDataAndStore,
    profiles: profData,
    loading,
    token,
  } = useStorage();
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAuthenticated } = useAuth();
  const Navigate = useNavigate();

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
  }, [profData, loading]);

  const handleUpdate = (id) => {
    console.log(`Update profile with id: ${id}`);
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("No token found");
      return;
    }
    setIsDeleting(true);
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
      setIsDeleting(false);
      fetchProfileDataAndStore(token);
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  if (loading && !isDeleting) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    alert("Please login to view profile");
    Navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
      <h1 className="text-2xl font-semibold text-blue-500 mb-6">
        User Profiles
      </h1>
      <button className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150">
        <Link to="/profile/create">Add Profile</Link>
      </button>
      {!profiles ? (
        <p className="text-gray-700">No profile found</p>
      ) : profiles.length === 0 ? (
        <p className="text-gray-700">No profile found</p>
      ) : (
        <ul className="w-full max-w-md mb-4 h-full overflow-y-scroll bg-white rounded-lg shadow-md">
          {profiles?.map((profile) => (
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
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-150"
                  disabled={isDeleting}
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition ease-in-out duration-150 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}"
                  disabled={isDeleting}
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
