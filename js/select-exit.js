(function () {
  var screen = document.getElementById("screen-select-exit");
  var grid = document.querySelector(".select-exit__grid");
  var exits = document.querySelectorAll(".select-exit__exit");
  var btnStart = document.querySelector(".select-exit__start");
  var START_TRANSITION_MS = 250;

  function setStartEnabled(enabled) {
    if (!btnStart) {
      return;
    }
    btnStart.disabled = !enabled;
  }

  function reset() {
    if (grid) {
      grid.classList.remove("has-selection");
    }
    exits.forEach(function (btn) {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    });
    if (btnStart) {
      btnStart.classList.remove("is-selected");
      btnStart.setAttribute("aria-pressed", "false");
    }
    setStartEnabled(false);
  }

  exits.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isSelected = btn.classList.contains("is-selected");

      exits.forEach(function (other) {
        other.classList.remove("is-selected");
        other.setAttribute("aria-pressed", "false");
      });

      if (!isSelected) {
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
        if (grid) {
          grid.classList.add("has-selection");
        }
        setStartEnabled(true);
      } else if (grid) {
        grid.classList.remove("has-selection");
        setStartEnabled(false);
      }
    });
  });

  if (btnStart) {
    btnStart.addEventListener("click", function () {
      if (btnStart.disabled || !grid || !grid.classList.contains("has-selection")) {
        return;
      }
      if (btnStart.classList.contains("is-selected")) {
        return;
      }

      btnStart.classList.add("is-selected");
      btnStart.setAttribute("aria-pressed", "true");

      if (window.setHomeFlowAfterCheck) {
        window.setHomeFlowAfterCheck("searching-path");
      }

      setTimeout(function () {
        if (window.showScreen) {
          window.showScreen("current-location");
        }
      }, START_TRANSITION_MS);
    });
  }

  if (screen) {
    var observer = new MutationObserver(function () {
      if (screen.hidden) {
        reset();
      }
    });

    observer.observe(screen, {
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }
})();
