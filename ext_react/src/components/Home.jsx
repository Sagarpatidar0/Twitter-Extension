import React, { useContext, useEffect } from "react";
import useAuth from "../hook/useAuth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { authData, userData, limit, loading, error, logout } = useAuth();
  const { isAuthenticated } = useContext(AuthContext);
  const Navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      Navigate("/login");
    }
  }, [isAuthenticated]);


  return (
    <div className="flex flex-col items-center justify-center max-h-screen min-h-full bg-gray-100 p-4">
      {loading && <p className="text-xl text-gray-700"></p>}
      {error && <p className="text-red-500">{error}</p>}
      {isAuthenticated && !loading ? (
        <>
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4 text-orange-600">
              Welcome {userData.name}
            </h1>
            <p className="text-gray-700">
              Email: <span className="text-black">{authData.email}</span>
            </p>
            {userData.verified ? (
              <p className="text-green-500">Status: Verified</p>
            ) : (
              <p className="text-red-500">Status: Not Verified</p>
            )}
            {limit && (
              <p className="text-gray-700">
                Search Token Remaining:{" "}
                <span className="text-black">{limit.remaining_quota}</span>
              </p>
            )}
            <button
              onClick={logout}
              className="mt-4 py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
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
