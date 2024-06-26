import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validate = () => {
    const validationErrors = {};
    if (!email.trim() || !validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address ";
    }
    if (!password.trim() || password.length < 6) {
      validationErrors.password = "password must be at least 6 char long";
    }
    setErrors(validationErrors); 
    return Object.keys(validationErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("text")
    chrome.storage.local.set({ "tokenz":"Text" }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error storing token:', chrome.runtime.lastError);
        return;
      }});

    if (!validate()) {
      return; 
    }

    try {
      const response = await fetch("https://api.twitterai.workers.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed"); 
      }

      const data = await response.json();
      const token = data.token;

      // chrome.storage.local.set({ token }, () => {
      //   if (chrome.runtime.lastError) {
      //     console.error('Error storing token:', chrome.runtime.lastError);
      //     return;
      //   }});

      browser.storage.local.set({ token }, () => {
        if (brousers.runtime.lastError) {
          console.error('Error storing token:', brousers.runtime.lastError);
          return;
        }});

      setEmail("");
      setPassword("")
      
    } catch (error) {
      // console.error("Login error:", error); 
      setErrors({ general: "Login failed. Please check your credentials." }); 
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center   text-gray-100`}
    >
      <h1 className="text-2xl font-bold text-center mb-1 mt-4">Login</h1>
      <div className="flex flex-col space-y-6 p-4 rounded-md shadow-md">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-48 text-black rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 ${
              errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-48 text-black rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 ${
              errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-48 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          onClick={handleSubmit}
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">
          Don't have an account?<a href="#" className="text-metal"> Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
