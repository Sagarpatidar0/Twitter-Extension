import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStorage from "../../hook/useStorage";
import useAuth from "../../hook/useAuth";

const CreateProfileForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(3);
  const { fetchDataAndStore, loading: fetchLoading } = useStorage();
  const { isAuthenticated } = useAuth();
  const Navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      console.log("Getting token from storage");
      try {
        const result = await chrome.storage.local.get(["token"]);
        if (result.token) {
          setToken(result.token);
          console.log("Token found:", result.token);
        } else {
          console.error("Token not found");
          setError("Token not found");
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        setError("Error retrieving token");
      }
    };

    getToken();
  }, [isAuthenticated]);

  const validate = () => {
    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = "Please enter your name";
    }
    if (!description.trim()) {
      validationErrors.description = "Please enter a description";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const createProfile = async () => {
    if (!token) return;

    setLoading(true);
    console.log("Creating profile");
    try {
      const response = await fetch(
        "https://api.twitterai.workers.dev/auth/profile",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      fetchDataAndStore(token).then(() => {
        Navigate("/profile");
        setName("");
        setDescription("");
      });

      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      if (!fetchLoading) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const status = await createProfile();
    if (status) {
      console.log("Profile created successfully");
    } else {
      console.log("Profile creation failed");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    setTimeout(() => {
      Navigate("/login");
    }, 3000);
    return (
      <div className="flex flex-col items-center justify-center h-full  bg-gray-100 p-4">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <h1 className="text-2xl font-bold text-center mb-4 text-orange-600">
            Create Profile
          </h1>
          <p className="text-red-500 text-xs mt-2">Please login to create profile</p>
          <p className="text-red-500 text-xs mt-2">Redirect to login page in {timer}</p>
        </div>
      </div>
    );
    
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-500">
          Create Profile
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 flex items-center justify-center ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Create Profile"
            )}
          </button>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
  
  
};

export default CreateProfileForm;
