(() => {
  // alert("Hello from your Chrome extension content!");

  const cssUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css";

  // Create a <link> element
  let linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = cssUrl;

  // Append the <link> element to the <head> of the document
  document.head.appendChild(linkElement);
  linkElement.onload = () => {
    console.log(`CSS stylesheet loaded successfully from ${cssUrl}`);
  };

 // Define the URL of the CDN script you want to inject
const cdnUrl = "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js";

// Create a <script> element
let scriptElement = document.createElement("script");
scriptElement.src = cdnUrl;

// Optionally, if the CDN script requires specific attributes or properties
// you can set them before appending to the document.
scriptElement.async = true;  // Example: Load asynchronously

// Append the <script> element to the <head> of the document
document.head.appendChild(scriptElement);

// Optionally, if you want to do something after the script has loaded
scriptElement.onload = () => {
    console.log(`CDN script loaded successfully from ${cdnUrl}`);
};


  // ------------------------ visual  ------------------------
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
        <button id="x-ai-replay" data-popover-target="popover-click" data-popover-trigger="click" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Click popover</button>

      <div data-popover id="popover-click" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
      <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white">Popover click</h3>
      </div>
    <div class="px-3 py-2">
        <p>And here's some amazing content. It's very engaging. Right?</p>
    </div>
    <div data-popper-arrow></div>
</div>
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

      popup.className = "popup";
      popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-header">
        <h2>Twitter AI</h2>
        <button id="close-popup">X</button>
      </div>
      <div class="popup-body">
        <div class="ai-tweet">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
          laborum ipsam vero non minus dolor ut. Suscipit odio eligendi iusto
          quidem officiis expedita, aspernatur dolore animi non quos, maiores
          dolores! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Dolores laborum ipsam vero non minus dolor ut. Suscipit odio eligendi
          iusto quidem officiis expedita, aspernatur dolore animi non quos,
          maiores dolores!
        </div>
        <button id="removeBtn" onclick="removePopup()">Copy</button>
      </div>
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
      // openPopup();
    });
  }
})();
