// localStorageと一緒
// localをsyncにすると別PCでもGoogleアカウントが同じであれば共有されます。
// getの第一引数で取りたい値を指定。default値もつけられます。
chrome.storage.local.get({ isPopupEnable: true }, result => {
  if (!result.isPopupEnable) return;

  let searchQuery = "";
  const setSearchQuery = text => (searchQuery = text);
  const getSearchQuery = () => searchQuery;

  const popUpId = "cys-search";
  const popUpIconClass = "cys-search-icon";
  const createPopUpHtml = () => {
    const pop = document.createElement("div");
    pop.id = popUpId;
    pop.style.position = "absolute";
    const icon = document.createElement("div");
    icon.className = popUpIconClass;
    pop.appendChild(icon);
    return pop;
  };
  const popUp = createPopUpHtml();

  const addPopupEvent = () => {
    popUp.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
    });
    popUp.addEventListener("mouseup", e => {
      e.stopPropagation();
      window.open(
        `https://www.youtube.com/results?search_query=${getSearchQuery()}`
      );
      document.getElementById(popUpId).remove();
    });
  };
  addPopupEvent();

  const addDocumentEvent = () => {
    let [fromX, fromY] = [0, 0];
    document.addEventListener("mousedown", e => {
      const popElm = document.getElementById(popUpId);
      if (popElm) popElm.remove();
      [fromX, fromY] = [e.pageX, e.pageY];
    });

    document.addEventListener("mouseup", e => {
      // input, textarea, contentEditable属性が付与されている場合
      // ボタンを表示しないようにする
      const activeElement = document.activeElement;
      if (
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName) ||
        activeElement.attributes.getNamedItem("contentEditable")
      )
        return;

      const selectionText = document.getSelection().toString();
      if (selectionText === "" || selectionText.length > 300) return;

      const [clickedX, clickedY] = [e.pageX, e.pageY];
      if (fromX === clickedX && fromY === clickedY) return;

      const popElm = document.getElementById(popUpId);
      if (popElm) return;

      setSearchQuery(selectionText);

      const posX = computePositionOffset(fromX, clickedX);
      const posY = computePositionOffset(fromY, clickedY);
      setElementPosition(popUp, posX, posY);
      document.body.appendChild(popUp);
    });
  };
  addDocumentEvent();

  /** 移動方向からオフセットを設定 */
  const computePositionOffset = (from, to) => (from > to ? to - 20 : to + 5);
  const setElementPosition = (element, x, y) => {
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  };
});
