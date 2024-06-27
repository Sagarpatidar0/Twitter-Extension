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
  const {getDashboardFromStorage, dashboard} = useStorage();
  const Navigate = useNavigate();


  useEffect(() => {
    const { initFlowbite } = require("flowbite");
    initFlowbite();

    getDashboardFromStorage();

  }, []);

  const handleClick = () => {
    Navigate("/")
  }

  return (
    <div id="footer" className="bg-gray-50">
      <div className="footer-item">
        {!isAuthenticated ? (
          <button
            data-popover-target="popover-top-1"
            data-popover-placement="top"
            type="button"
            className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
          >
            <a href="#/login">
            <img className="w-5" src={activeTab == "home"?"images/user-solid.svg":"images/user-regular.svg"} alt="test" />
            </a>
          </button>
        ) : (
          <button
            data-popover-target="popover-top-1"
            data-popover-placement="top"
            type="button"
            className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
            onClick={handleClick}
          >
          <img className="w-5" src={activeTab == "home"?"images/user-solid.svg":"images/user-regular.svg"} alt="test" />
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
        <button
          data-popover-target="popover-top-2"
          data-popover-placement="top"
          type="button"
          className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
        >
          <a href="#/profile">
          <img
            src="chrome-extension://bihmplhobchoageeokmgbdihknkjbknd/static/assets/menu/doc_1.png"
            alt=""
          /></a>
        </button>
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
        <button
          data-popover-target="popover-top-3"
          data-popover-placement="top"
          type="button"
          className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
        >
          <a href="#/profile/create">
          <img
            src="chrome-extension://bihmplhobchoageeokmgbdihknkjbknd/static/assets/menu/exclude_1.png"
            alt=""
          /></a>
        </button>
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
          data-popover-target="popover-top"
          type="button"
          className="text-white ml-1 mb-1 px-4 py-2 me-4 hover:bg-hover  focus:outline-none font-medium rounded-lg text-sm  text-center "
        >
          <svg
            className="w-4 h-4 me-2"
            fill="red"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"></path>
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"></path>
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"></path>
          </svg>
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
                style={{ width: `${(dashboard?.remaining_quota) * 100/dashboard.daily_quota}%`}}
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
