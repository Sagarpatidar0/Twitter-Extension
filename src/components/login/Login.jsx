import React, { useEffect, useState } from "react";
import { useChromeStorage } from "../../hook/useToken";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import useStorage from "../../hook/useStorage";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [storedValue, setStoredValue] = useChromeStorage("token");
  const { fetchDataAndStore } = useStorage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    if (!password.trim() || password.length < 4) {
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

    setLoading(true);

    try {
      const response = await fetch("https://api.twitterai.workers.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "User not exists") {
        if (data.status === "Invalid password") {
          setErrors({ password: "Invalid password" });
        } else if (data.status === "User not exists") {
          setErrors({ email: "User does not exist" });
        } else {
          setErrors({
            general: "Login failed. Please check your credentials.",
          });
        }
        throw new Error("Login failed");
      }

      const token = data.token;
      if (data.status === "Logged In" && data.token) {
        setStoredValue(token);
        fetchDataAndStore(token).then(() => {
          console.log("Logged In");
          navigate("/");
        });
      } else {
        console.log(data.status);
        console.log(data);
      }

      
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center h-full bg-gray-100 p-4">
      <div className="bg-white p-8 mt-10 rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-500">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errors.general && (
            <p className="text-red-500 text-xs text-center">{errors.general}</p>
          )}
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
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
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
              className={`mt-1 px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
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
            className={`w-full py-2 rounded-md text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="w-5 h-5 mr-3 text-white animate-spin"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center text-black text-sm mt-4">
          Don't have an account?
          <a href="#/signup" className="text-blue-500 font-medium">
            {" "}
            Sign up here
          </a>
          .
        </p>
      </div>
    </div>
  );
  
};

export default LoginForm;
