  // Inject Flowbite CSS
  const flowbiteCssUrl = chrome.runtime.getURL("flowbite/flowbite.min.css");
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = flowbiteCssUrl;
  document.head.appendChild(linkElement);

  // Inject Flowbite JavaScript
  const flowbiteJsUrl = chrome.runtime.getURL("flowbite/flowbite.min.js");
  const scriptElement = document.createElement("script");
  scriptElement.src = flowbiteJsUrl;
  document.head.appendChild(scriptElement);

  scriptElement.onload = () => {
    console.log("Flowbite script loaded successfully.");
  };

  console.log("Flowbite injected.");