import React, { useState } from "react";
import { useChromeStorage } from "../../hook/useToken";
import { useNavigate  } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [storedValue, setStoredValue] = useChromeStorage("token");
  const Navigator = useNavigate();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validate = () => {
    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = "Please enter your name";
    }
    if (!email.trim() || !validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    if (!password.trim() || password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Call the API to sign up the user
    try {
      const response = await fetch(
        "https://api.twitterai.workers.dev/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;
      console.log(token); 
      setStoredValue(token);
      console.log(storedValue);
      Navigator("/");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 py-2  rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4 text-orange-600">
          Sign Up
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
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-black mt-4">
          Already have an account?
          <a href="#/login" className="text-orange-600 font-medium">
            {" "}
            Login here
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Signup;
