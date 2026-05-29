(function () {
  var screenFinish = document.getElementById("screen-transfer-guide-finish");
  var btnHome = document.querySelector(".transfer-guide-finish__home");
  var HOME_TRANSITION_MS = 250;

  if (!btnHome) {
    return;
  }

  btnHome.addEventListener("click", function () {
    if (btnHome.classList.contains("is-selected")) {
      return;
    }

    btnHome.classList.add("is-selected");
    btnHome.setAttribute("aria-pressed", "true");

    setTimeout(function () {
      if (window.showScreen) {
        window.showScreen("home");
      }
    }, HOME_TRANSITION_MS);
  });

  if (screenFinish) {
    var observer = new MutationObserver(function () {
      if (screenFinish.hidden) {
        btnHome.classList.remove("is-selected");
        btnHome.setAttribute("aria-pressed", "false");
      }
    });

    observer.observe(screenFinish, {
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }
})();
