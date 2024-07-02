(() => {
  // ------------------------ Load Local Data   ------------------------

  let token = null;
  let profile = null;
  let login = false;
  let quotaRemaining = null;
  chrome.storage.local.get("token", (data) => {
    if (data.token) {
      login = true;
      token = data.token;
      fetchProfiles(token);
      fetchQuotaRemaining();
    }
  });
  chrome.storage.local.get("profiles", (data) => {
    if (data.profiles) {
      profile = data.profiles;
      console.log("Fetching profiles chrome storage: ", profile);
    }
  });
  const fetchProfiles = async (token) => {
    console.log(token, login);
    if (!token || !login) return false;

    console.log("Fetching profiles");
    try {
      const response = await fetch(
        "https://api.twitterai.workers.dev/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data = await response.json();
      console.log("Profile data:", data);
      profile = data;
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchQuotaRemaining = async () => {
    if (!token || !login) return false;

    console.log("Fetching quota remaining");
    try {
      const response = await fetch(
        "https://api.twitterai.workers.dev/auth/quota",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quota remaining");
      }

      const data = await response.json();
      console.log("Quota data:", data);
      quotaRemaining = data.remaining_quota;

      if (quotaRemaining === 0) {
        alert("You have exhausted your quota for today!");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // ------------------------ Button  ------------------------
  setTimeout(() => {
    const addEventListener = () => {
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
    };

    const addVisual = () => {
      let tablist;
      if (!tablist) {
        // tablist = document.querySelector('div[role="tablist"]');
        const xpathExpression =
          '//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div/div/div[2]/div[2]/div/div/nav/div/div[2]/div';

        const result = document.evaluate(
          xpathExpression,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        tablist = result.singleNodeValue;
      }
      let newDiv;
      if (tablist) {
        newDiv = document.createElement("div");
        newDiv.setAttribute("role", "presentation");
        newDiv.className = "css-175oi2r r-14tvyh0 r-cpa5s6 ai-btn";
        newDiv.style.position = "relative";

        newDiv.innerHTML = `
    <div class="new-content">
        <button id="x-ai-replay" data-popover-target="popover-left" data-popover-placement="left" type="button" class="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">AI Replay</button>
    </div>
  `;

        tablist.appendChild(newDiv);
        addEventListener();
        console.log("visual added");
      }
    };
    addVisual();
    // ------------------------ Select Options  ------------------------

    const populateSelectOptions = () => {
      const selectElement = document.getElementById("select_profile");

      if (profile) {
        profile.forEach((profile) => {
          const option = document.createElement("option");
          option.value = profile.id;
          option.textContent = profile.name;
          selectElement.appendChild(option);
        });
      }
    };

    // ------------------------ Post Page btn  ------------------------

    const input = document.querySelector("body");
    if (input) {
      input.addEventListener("click", (e) => {
        // console.log("clicked", e.target.classList.value);
        if (
          e.target.classList.value.includes(
            "css-175oi2r r-xoduu5 r-xyw6el r-13qz1uu r-1e084wi"
          )
        ) {
          const xpathExpression2 =
            '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[@*]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]/div/div/nav/div/div[2]/div';
          const result = document.evaluate(
            xpathExpression2,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          const tablistPostPage = result.singleNodeValue;
          // console.log(tablistPostPage);
          let btnAdded = false;

          if (
            tablistPostPage &&
            !btnAdded &&
            !document.getElementsByClassName("ai-btn")[0]
          ) {
            let newDiv = document.createElement("div");
            newDiv.setAttribute("role", "presentation");
            newDiv.className = "css-175oi2r r-14tvyh0 r-cpa5s6 ai-btn";
            newDiv.style.position = "relative";

            newDiv.innerHTML = `
    <div class="new-content">
        <button id="x-ai-replay" data-popover-target="popover-left" data-popover-placement="left" type="button" class="text-white mb-3 me-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">AI Replay</button>
    </div>
  `;

            tablistPostPage.appendChild(newDiv);
            addEventListener();
            // console.log("visual added", btnAdded);
            btnAdded = true;
          }
        }
      });
    }

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
              console.log("");
            } else if (document.getElementsByClassName("popup").length > 0) {
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
            if (login && quotaRemaining > 0) {
              quotaRemaining--;
              makeApiCall(extractedText);
            } else if (quotaRemaining === 0) {
              document.getElementById("ai-reply-text").innerText = "You have exhausted your quota for today!"
              alert("You have exhausted your quota for today!");
            }
            else {
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

    setTimeout(() => {
      const allBtn = document.getElementsByClassName(
        "css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l"
      );
      if (allBtn) {
        Array.from(allBtn).forEach((btn) => {
          if (btn.ariaLabel.includes("Reply")) {
            btn.addEventListener("click", () => {
              if (!document.getElementById("x-ai-replay")) {
                addVisual();
              }
            });
          }
        });
      }
    }, 1000);
  }, 100);
})();
