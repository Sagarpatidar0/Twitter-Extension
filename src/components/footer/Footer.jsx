import React, { useContext, useEffect, useState } from "react";
import "flowbite";
import "./Footer.css";
import useAuth from "../../hook/useAuth";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useStorage from "../../hook/useStorage";

export default function Footer() {

  const [activeTab, setActiveTab] = useState("home");
  const { isAuthenticated } = useContext(AuthContext);
  const { limit, loading, logout } = useAuth();
  const { getDashboardFromStorage, dashboard } = useStorage();
  const Navigate = useNavigate();


  useEffect(() => {
    const { initFlowbite } = require("flowbite");
    initFlowbite();

    getDashboardFromStorage();

  }, []);

  const handleClick = () => {
    Navigate("/")
    setActiveTab('home')
  }

  return (
    <div id="footer" className="bg-gray-50">
      <div className="footer-item">
        {!isAuthenticated ? (
          <a href="#/login">
            <button
              onClick={() => setActiveTab('home')}
              data-popover-target="popover-top-1"
              data-popover-placement="top"
              type="button"
              className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
            >
              <img className="w-5" src={activeTab == "home" ? "images/user-solid.svg" : "images/user-regular.svg"} alt="Home" />
            </button>
          </a>
        ) : (
          <button
            data-popover-target="popover-top-1"
            data-popover-placement="top"
            type="button"
            className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
            onClick={handleClick}
          >
            <img className="w-5" src={activeTab == "home" ? "images/user-solid.svg" : "images/user-regular.svg"} alt="Home" />
          </button>
        )}

        <div
          data-popover
          id="popover-top-1"
          role="tooltip"
          className="absolute z-10 invisible inline-block w-auto text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {isAuthenticated ? "Dashboard" : "Login"}
            </h3>
          </div>
          <div data-popper-arrow></div>
        </div>
      </div>
      <div className="footer-item">
        <a href="#/profile">
          <button
            onClick={() => setActiveTab('profiles')}
            data-popover-target="popover-top-2"
            data-popover-placement="top"
            type="button"
            className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
          >
            <img className="w-6" src={activeTab == "profiles" ? "images/address-card-solid.svg" : "images/address-card-regular.svg"} alt="profiles" />
          </button>
        </a>
        <div
          data-popover
          id="popover-top-2"
          role="tooltip"
          className="absolute z-10 invisible inline-block w-auto text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Profile
            </h3>
          </div>
          <div data-popper-arrow></div>
        </div>
      </div>
      <div className="footer-item">
        <a href="#/profile/create">
          <button
            onClick={() => setActiveTab('create')}
            data-popover-target="popover-top-3"
            data-popover-placement="top"
            type="button"
            className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
          >
            <img className="w-5" src={activeTab == "create" ? "images/square-plus-solid.svg" : "images/square-plus-regular.svg"} alt="create" />
          </button>
        </a>
        <div
          data-popover
          id="popover-top-3"
          role="tooltip"
          className="absolute z-10 invisible inline-block w-auto text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              New Profile
            </h3>
          </div>
          <div data-popper-arrow></div>
        </div>
      </div>
      <div className="footer-item">
        <button
          onClick={() => setActiveTab('limit')}
          data-popover-target="popover-top"
          type="button"
          className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
        >
          <img className="w-5" src={activeTab == "limit" ? "images/sliders-solid.svg" : "images/sliders.svg"} alt="limit" />
        </button>
        <div
          data-popover
          id="popover-top"
          role="tooltip"
          className="absolute z-10 invisible inline-block w-auto text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          {isAuthenticated && !loading ? (
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {"Today Token left: " + dashboard?.remaining_quota}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${(dashboard?.remaining_quota) * 100 / dashboard.daily_quota}%` }}
                ></div>
              </div>
              <a
                href="#"
                className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700"
              >
                Upgrade now{" "}
                <svg
                  className="w-2 h-2 ms-1.5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </div>) : (
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {"Please login to see your token"}
                <a href="#/login"> Click hear to login</a>
              </h3>
            </div>
          )}
        </div>
        <div data-popper-arrow></div>
      </div>
    </div>
  );
}
