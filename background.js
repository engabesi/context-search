chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "youtube_search_menu",
    title: "Youtubeで「%s」を検索",
    contexts: ["selection"]
  });
});
chrome.contextMenus.onClicked.addListener(info => {
  const query = info.selectionText;
  if (query.length > 300) {
    alert("文字が多すぎます。");
    return;
  }
  const url = `https://www.youtube.com/results?search_query=${query}`;
  chrome.tabs.create({ url: url });
});
