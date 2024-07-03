import { useState, useEffect } from 'react';

const getChromeStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
};

const setChromeStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    let items = {};
    items[key] = value;
    chrome.storage.local.set(items, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

export const useChromeStorage = (key) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedValue = await getChromeStorage(key);
        setValue(storedValue);
      } catch (error) {
        console.error("Error getting local storage:", error);
      }
    };

    fetchData();
  }, [key]);

  const setStoredValue = async (newValue) => {
    try {
      await setChromeStorage(key, newValue);
      setValue(newValue);
    } catch (error) {
      console.error("Error setting local storage:", error);
    }
  };

  return [value, setStoredValue];
};


