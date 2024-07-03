import React, { useState, useEffect } from "react";

const CreateProfileForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      console.log('Getting token from storage');
      try {
        const result = await chrome.storage.local.get(['token']);
        if (result.token) {
          setToken(result.token);
          console.log('Token found:', result.token);
        } else {
          console.error('Token not found');
          setError('Token not found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        setError('Error retrieving token');
        setLoading(false);
      }
    };

    getToken();
  }, []);

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

    const createProfiles = async () => {
      if (!token) return;

      console.log('Fetching profiles');
      try {
        const response = await fetch(
          "https://api.twitterai.workers.dev/auth/profile",
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: JSON.stringify({ name, description }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to Create profiles");
        }
        return true;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    let status = createProfiles();
    if(status){
      console.log('Profile created successfully');
      setName("");
      setDescription("");
    }else{
      console.log('Profile creation failed');
      setError('Profile creation failed');
    }
    
    
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen  bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4 text-orange-600">Create Profile</h1>
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
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
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
            className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfileForm;
