(() => {
  // alert("Hello from your Chrome extension content!");

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

  // ------------------------ Load Local Data   ------------------------

  let token = null;
  let profile = null;
  let login = false;
  chrome.storage.local.get("token", (data) => {
    if (data.token) {
      login = true;
      token = data.token;
    }
  });
  chrome.storage.local.get("userProfile", (data) => {
    if (data.userProfile) {
      profile = data.userProfile;
    }
  });

  // ------------------------ Button  ------------------------
  const targetNode = document.getElementById("react-root");
  console.log(targetNode)
  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if ((mutation.type === "attributes" && mutation.attributeName == 'role') || (mutation.type === "childList" && mutation.target.getAttribute('class') == 'css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c')) {
        if (mutation.target.getAttribute('role') == 'tab' || mutation.target.getAttribute('class') == 'css-175oi2r r-kemksi r-jumn1c r-xd6kpl r-gtdqiz r-ipm5af r-184en5c') {
          console.log(mutation)
          console.log(`The ${mutation.attributeName} attribute was modified.`);
          console.log(mutation.target.getAttribute('role'))

          // let tablist = document.querySelector('div[role="tablist"]');
          // let tablist = document.querySelector("//nav[@aria-live='polite' and @role='navigation']");
          // const xpathExpression ='//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div/div/div[2]/div[2]/div/div/nav/div/div[2]/div';
          // const xpathExpression = '//*[@id="layers"]//nav//div/div[2]/div';
          // const xpathExpression = "//span[text()='Reply']";
          // const xpathExpression = "//nav[@aria-live='polite' and @role='navigation' and @class='r-knv0ih r-13awgt0 r-m5k245']";
          // const xpathExpression = "//nav[@role='navigation' and @class='css-175oi2r r-1awozwy r-18u37iz r-knv0ih r-13awgt0 r-m5k245']";
          setTimeout(() => {
            console.log("Xpath started");
            const xpathExpression = "//div[button/div/span/span[text()='Reply']]/preceding-sibling::*";
            const result = document.evaluate(
              xpathExpression,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            let tablist = result.singleNodeValue;
            console.log(tablist);
            console.log("tablist found");
            if (tablist && tablist.getElementsByClassName('ai-btn').length == 0) {
              let newDiv = document.createElement("div");
              newDiv.setAttribute("role", "presentation");
              newDiv.className = "css-175oi2r r-14tvyh0 r-cpa5s6 ai-btn";
              newDiv.style.position = "relative";

              newDiv.innerHTML = `
          <div class="new-content">
              <button id="x-ai-replay" data-popover-target="popover-left" data-popover-placement="left" type="button" class="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">AI Replay</button>
          </div>
        `;
              tablist.appendChild(newDiv);
              console.log("visual added");
            }



            // ------------------------ Select Options  ------------------------

            function populateSelectOptions() {
              const selectElement = document.getElementById("select_profile");
              console.log(selectElement);

              profile.forEach((profile) => {
                const option = document.createElement("option");
                option.value = profile.id;
                option.textContent = profile.name;
                selectElement.appendChild(option);
              });
            }

            // ------------------------ Post Page btn  ------------------------

            // const input = document.querySelector('body');
            // if (input) {
            //   input.addEventListener("click", (e) => {
            //     console.log("clicked");
            //     const xpathExpression2 =
            //       '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]/div/div/nav/div/div[2]/div';
            //     const result = document.evaluate(
            //       xpathExpression2,
            //       document,
            //       null,
            //       XPathResult.FIRST_ORDERED_NODE_TYPE,
            //       null
            //     );
            //     const tablistPostPage = result.singleNodeValue;
            //     console.log(tablistPostPage)
            //     let btnAdded = false;

            //     if (tablistPostPage && !btnAdded) {
            //       let newDiv = document.createElement("div");
            //       newDiv.setAttribute("role", "presentation");
            //       newDiv.className = "css-175oi2r r-14tvyh0 r-cpa5s6 ai-btn";
            //       newDiv.style.position = "relative";

            //       newDiv.innerHTML = `
            //   <div class="new-content">
            //       <button id="x-ai-replay" data-popover-target="popover-left" data-popover-placement="left" type="button" class="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">AI Replay</button>
            //   </div>
            // `;

            //       tablistPostPage.appendChild(newDiv);
            //       btnAdded = true;
            //     }
            //   });
            // }

            // ------------------------ popup  ------------------------
            const openPopup = () => {
              if (!(document.getElementsByClassName("popup").length > 0)) {
                console.log("popup not found");
                const body = document.querySelector("body");
                const aiBtn = document.getElementsByClassName("ai-btn")[0];
                let popup = document.createElement("div");

                const btn = document.getElementById("x-ai-replay");
                popup.className = "popup";
                popup.style.position = "absolute";
                if (btn) {
                  const rect = btn.getBoundingClientRect();
                  popup.style.left = rect.left + "px";
                  popup.style.top = window.scrollY + rect.top + "px";
                }
                popup.innerHTML = `
      <div      data-popover      id="popover-left"      role="tooltip"      class="absolute z-10 inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 opacity-100 visible"    >
      <div class="popup-header">
        <button id="close-popup" class="px-3 py-2">X</button>
      </div>
      <div        class="px-3 py-2 my-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700"      >
        <h3 class="font-semibold text-gray-900 dark:text-white">
          Twitter AI
        </h3>
      </div>
      <div class="px-3 py-2">
        <p id="ai-reply-text">Hold on AI is cooking some thing  pernislized for you!</p>
      </div>
       <select id="select_profile" class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            
        </select>
         <div class="flex justify-end space-x-4 mt-4 mb-2 pr-1">
            <button id="regenerate-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Regenerate
            </button>
            <button id="copy-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Copy
            </button>
        </div>
  `;

                body.appendChild(popup);
                populateSelectOptions();
                const closePopup = document.getElementById("close-popup");
                closePopup.addEventListener("click", () => {
                  body.removeChild(popup);
                });

                const observer = new IntersectionObserver((entries, observer) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      console.log("Element is in view");
                    } else {
                      body.removeChild(popup);
                    }
                  });
                });

                let newDiv = document.getElementsByClassName("new-content")[0];
                observer.observe(newDiv);

                // ------------------------ Copy Button  ------------------------
                const copyButton = document.getElementById("copy-btn");
                if (copyButton) {
                  copyButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(
                      document.getElementById("ai-reply-text").innerText
                    );
                    body.removeChild(popup);
                  });
                }

                // ------------------------ Regenerate Button  ------------------------
                const regenerateButton = document.getElementById("regenerate-btn");
                if (regenerateButton) {
                  regenerateButton.addEventListener("click", () => {
                    const textElement = document.getElementsByClassName(
                      "css-175oi2r r-eqz5dr r-16y2uox r-1wbh5a2"
                    )[0];
                    let extractedText = "";
                    if (textElement) {
                      extractedText = textElement.innerText.split("\n")[4];
                    }
                    if (login) {
                      makeApiCall(extractedText);
                    } else {
                      alert("Please login to use this feature!");
                      document.getElementById("ai-reply-text").innerText =
                        "Please login to use this feature!\n Click on the extension icon to login.";
                    }
                  });
                }
              }
            };

            // ------------------------ api call  ------------------------

            async function makeApiCall(input) {
              let id = profile[0].id;
              const selectElement = document.getElementById("select_profile").value;
              document.getElementById("ai-reply-text").innerHTML = `
      <div class="flex animate-pulse space-x-4">
        <div class="w-full h-8 bg-gray-500 rounded-3xl mb-4"></div>
      </div>
    `;

              if (selectElement) {
                id = selectElement;
              }

              const apiUrl = "https://api.twitterai.workers.dev/auth/generate";

              try {
                const response = await fetch(apiUrl, {
                  method: "POST",
                  body: JSON.stringify({ profile: Number(id), tweet: input }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                });

                if (!response.ok) {
                  throw new Error("Network response was not ok" + response.statusText);
                }

                const replyMsg = await response.json();
                console.log("API call data:", replyMsg);
                document.getElementById("ai-reply-text").innerText = replyMsg.response;
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
                openPopup();
                if (login) {
                  document.getElementById("ai-reply-text").innerText =
                    "Please select profile you want to use to reply with.";
                } else {
                  document.getElementById("ai-reply-text").innerText =
                    "Please login to use this feature!\n Click on the extension icon to login.";
                }
              });
            }
          }, 100)
        }

      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();
