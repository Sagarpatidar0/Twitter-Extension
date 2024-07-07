// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && (tab.url.includes('https://x.com/compose/post')) || tab.url.includes('/status/')) {
//     chrome.scripting.executeScript({
//       target: { tabId: tabId },
//       files: ['content.js']
//     }, () => {
//       console.log("Content script injected on URL change.");
//     });
//   }
// });
