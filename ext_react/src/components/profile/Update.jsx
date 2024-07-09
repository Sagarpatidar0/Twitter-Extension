import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStorage from "../../hook/useStorage";

const UpdateProfileForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState({});
  const { id, buname, budescription, token } = useParams();
  const { fetchDataAndStore } = useStorage();

  const Navigate = useNavigate();

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

  useEffect(() => {
    if (buname && budescription) {
      setName(buname);
      setDescription(budescription);
      console.log("Name and description updated successfully");
    } else {
      console.log("Name and description not updated");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!token) {
      setError("No token found");
      return;
    }

    try {
      console.log("Updating profile", { id: Number(id), name });
      const response = await fetch(
        `https://api.twitterai.workers.dev/auth/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: JSON.stringify({ id: Number(id), name, description }),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }
      if (response.ok) {
        console.log("Profile updated successfully");
        fetchDataAndStore(token).then(() => {
          Navigate("/profile");
        });
      }
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message);
      console.log("Profile not updated");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen  bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4 text-orange-600">
          Update Profile
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
              className={`mt-1 px-3 py-2 max-h-32 min-h-16 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
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
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
