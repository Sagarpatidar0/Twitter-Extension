import React, { useContext, useEffect } from "react";
import useAuth from "../hook/useAuth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import useStorage from "../hook/useStorage";

export default function Home() {
  const { error, logout } = useAuth();
  const { dashboard, getDashboardFromStorage, loading } = useStorage();
  const { isAuthenticated } = useContext(AuthContext);
  const Navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getDashboardFromStorage();
      console.log("Dashboard fetched", dashboard);
    } else {
      Navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
      {loading && (
        <div className="text-xl text-gray-700">
          <Spinner />
        </div >
      )}
      {error && <p className="text-red-500">{error}</p>}
      {isAuthenticated && !loading && dashboard ? (
        <>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-lg font-semibold mb-6 text-blue-500">
              Welcome, {dashboard.name}
              {console.log(dashboard)}
            </h1>
            <div className="text-left">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <span className="text-black">{dashboard.email}</span>
              </p>
              {dashboard.verified ? (
                <p className="text-green-500 mb-2"><strong>Status:</strong> Verified</p>
              ) : (
                <p className="text-red-500 mb-2"><strong>Status:</strong> Not Verified</p>
              )}
              <p className="text-gray-700 mb-4">
                <strong>Search Token Remaining:</strong> <span className="text-black">{dashboard.remaining_quota}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-6 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition ease-in-out duration-150"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        !loading &&
        !error &&
        !isAuthenticated && (
          <p className="text-xl text-gray-700">Please login</p>
        )
      )}
    </div>
  );
  
}
