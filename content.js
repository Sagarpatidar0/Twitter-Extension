(() => {
  // alert("Hello from your Chrome extension content!");

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

  // ------------------------ Button  ------------------------

  let tablist;
  if (!tablist) {
    tablist = document.getElementsByClassName(
      "css-175oi2r r-1awozwy r-1ro0kt6 r-18u37iz r-16y2uox r-1pi2tsx r-1ny4l3l"
    )[0];
  }

  if (tablist) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute("role", "presentation");
    newDiv.className = "css-175oi2r r-14tvyh0 r-cpa5s6";

    newDiv.innerHTML = `
    <div class="new-content">
        <button id="x-ai-replay" data-popover-target="popover-left" data-popover-placement="left" type="button" class="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">AI Replay</button>
    </div>
  `;

    tablist.appendChild(newDiv);
    console.log("visual added");

  }

  // ------------------------ popup  ------------------------
  const openPopup = () => {
    if (!(document.getElementsByClassName("popup").length > 0)) {
      console.log("popup not found");
      const body = document.querySelector("body");
      let popup = document.createElement("div");

      const removePopup = () => {
        console.log("clicked");
      };
      const btn = document.getElementById("x-ai-replay");
      popup.className = "popup";
      popup.style.position = "absolute";
      if(btn) {
        const rect = btn.getBoundingClientRect();
        popup.style.left = rect.left + "px";
        popup.style.top = (rect.top + 140) + "px";
      }
      popup.innerHTML = `
      <div      data-popover      id="popover-left"      role="tooltip"      class="absolute z-10 inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 opacity-100 visible"    >
      <div class="popup-header">
        <button id="close-popup">X</button>
      </div>
      <div        class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700"      >
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Twitter AI
        </h3>
      </div>
      <div class="px-3 py-2">
        <p>And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?And here's some amazing content. It's very engaging. Right?</p>
      </div>
       <select class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option>Profile 1</option>
            <option>Profile 2</option>
            <option>Profile 3</option>
        </select>
         <div class="flex justify-end space-x-4 mt-4 mb-2 pr-1">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Regenerate
            </button>
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Copy
            </button>
        </div>
  `;

      body.appendChild(popup);

      const closePopup = document.getElementById("close-popup");
      closePopup.addEventListener("click", () => {
        body.removeChild(popup);
        // popup.style.display = "none";
      });
    }
  };
  // ------------------------ api call  ------------------------

  async function makeApiCall(input) {
    const apiUrl = "https://twitterai-backend.lindasmith03.workers.dev/test1";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({ tweet: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok" + response.statusText);
      }

      const data = await response.json();
      console.log("API call data:", data);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  // ------------------------ event listener  ------------------------

  const replayButton = document.getElementById("x-ai-replay");
  if (replayButton) {
    replayButton.addEventListener("click", () => {
      const textElement = document.getElementsByClassName(
        "css-175oi2r r-eqz5dr r-16y2uox r-1wbh5a2"
      )[0];
      let extractedText = "";
      if (textElement) {
        extractedText = textElement.innerText.split("\n")[4];
      }
      console.log(extractedText);
      // makeApiCall(extractedText);
      openPopup();
    });
  }
})();
