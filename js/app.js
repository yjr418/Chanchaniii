(function () {
  var screenHome = document.getElementById("screen-home");
  var screenCurrent = document.getElementById("screen-current-location");
  var rectangle451 = document.getElementById("rectangle-451");
  var btnBack = document.getElementById("btn-back");

  function showScreen(name) {
    var isHome = name === "home";

    screenHome.hidden = !isHome;
    screenCurrent.hidden = isHome;

    if (!isHome) {
      history.replaceState(null, "", "#80-2653");
    } else {
      history.replaceState(null, "", location.pathname);
    }
  }

  function shouldOpenCurrentLocation() {
    var hash = location.hash;
    var search = location.search;
    return (
      hash === "#80-2653" ||
      hash === "#current-location" ||
      search.indexOf("node-id=80-2653") !== -1
    );
  }

  rectangle451.addEventListener("click", function () {
    showScreen("current-location");
  });

  btnBack.addEventListener("click", function () {
    showScreen("home");
  });

  if (shouldOpenCurrentLocation()) {
    showScreen("current-location");
  }
})();
