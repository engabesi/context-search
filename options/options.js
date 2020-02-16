const form = document.querySelector("form");
form.addEventListener("submit", e => {
  saveOptions();
  e.preventDefault();
});

const toBoolean = str => (str.toLowerCase() === "true" ? true : false);

const saveOptions = () => {
  const isPopupEnable = toBoolean(form.popup.value);
  chrome.storage.local.set({
    isPopupEnable: isPopupEnable
  });
};

const fetchOptions = () => {
  chrome.storage.local.get({ isPopupEnable: true }, result => {
    if (result.isPopupEnable) {
      form.popup[0].checked = true;
      form.popup[1].checked = false;
    } else {
      form.popup[0].checked = false;
      form.popup[1].checked = true;
    }
  });
};
fetchOptions();
