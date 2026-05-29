(function () {
  var screenSearching = document.getElementById("screen-searching-path");
  var screenGuide1 = document.getElementById("screen-transfer-guide-1");
  var screenGuide2 = document.getElementById("screen-transfer-guide-2");
  var guide1Sheet = document.getElementById("transfer-guide-1-sheet");
  var searchNavTimer = null;
  var NAV_DELAY_MS = 4000;
  var NEXT_TRANSITION_MS = 250;
  var SHEET_PEEK = 144;
  var SHEET_EXPANDED = 316;
  var DRAG_EXPAND_THRESHOLD = 0.42;

  var dragState = null;

  function collapseGuide1() {
    if (!screenGuide1 || !guide1Sheet) {
      return;
    }
    screenGuide1.classList.remove("is-expanded", "is-dragging");
    guide1Sheet.style.removeProperty("--sheet-current");
    resetNextButtons(screenGuide1);
    resetReplayButton(screenGuide1);
  }

  function expandGuide1() {
    if (!screenGuide1 || screenGuide1.hidden || !guide1Sheet) {
      return;
    }
    screenGuide1.classList.add("is-expanded");
    guide1Sheet.style.setProperty("--sheet-current", SHEET_EXPANDED + "px");
  }

  function resetNextButtons(root) {
    if (!root) {
      return;
    }
    root.querySelectorAll(".transfer-guide__next").forEach(function (btn) {
      btn.classList.remove("is-selected");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  function resetReplayButton(root) {
    if (!root) {
      return;
    }
    var replay = root.querySelector(".transfer-guide__replay");
    if (replay) {
      replay.classList.remove("is-pressed");
      replay.setAttribute("aria-pressed", "false");
    }
  }

  function selectNextButton(btn) {
    if (!btn) {
      return;
    }
    btn.classList.add("is-selected");
    btn.setAttribute("aria-pressed", "true");
  }

  function goToGuide2() {
    if (window.showScreen) {
      window.showScreen("transfer-guide-2");
    }
  }

  function goToFinish() {
    if (window.showScreen) {
      window.showScreen("transfer-guide-finish");
    }
  }

  function handleNextClick(btn, navigate) {
    if (!btn || btn.classList.contains("is-selected")) {
      return;
    }
    selectNextButton(btn);
    if (navigate) {
      setTimeout(navigate, NEXT_TRANSITION_MS);
    }
  }

  function isInteractiveTarget(target) {
    return Boolean(
      target.closest(".transfer-guide__next") ||
        target.closest(".transfer-guide__replay")
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setSheetHeight(height) {
    if (!guide1Sheet) {
      return;
    }
    var nextHeight = clamp(height, SHEET_PEEK, SHEET_EXPANDED);
    guide1Sheet.style.setProperty("--sheet-current", nextHeight + "px");

    var progress =
      (nextHeight - SHEET_PEEK) / (SHEET_EXPANDED - SHEET_PEEK);
    if (progress >= DRAG_EXPAND_THRESHOLD) {
      screenGuide1.classList.add("is-expanded");
    } else {
      screenGuide1.classList.remove("is-expanded");
    }
  }

  function snapSheet() {
    if (!screenGuide1 || !guide1Sheet) {
      return;
    }
    screenGuide1.classList.remove("is-dragging");

    var current = guide1Sheet.style.getPropertyValue("--sheet-current");
    var height = current ? parseFloat(current) : SHEET_PEEK;
    var progress = (height - SHEET_PEEK) / (SHEET_EXPANDED - SHEET_PEEK);

    if (progress >= DRAG_EXPAND_THRESHOLD) {
      expandGuide1();
    } else {
      screenGuide1.classList.remove("is-expanded");
      guide1Sheet.style.setProperty("--sheet-current", SHEET_PEEK + "px");
    }
  }

  function onDragStart(clientY, target) {
    if (
      !screenGuide1 ||
      screenGuide1.hidden ||
      isInteractiveTarget(target)
    ) {
      return;
    }

    var current = guide1Sheet.style.getPropertyValue("--sheet-current");
    var startHeight = current
      ? parseFloat(current)
      : screenGuide1.classList.contains("is-expanded")
        ? SHEET_EXPANDED
        : SHEET_PEEK;

    dragState = {
      startY: clientY,
      startHeight: startHeight,
    };
    screenGuide1.classList.add("is-dragging");
  }

  function onDragMove(clientY) {
    if (!dragState) {
      return;
    }
    var deltaY = dragState.startY - clientY;
    setSheetHeight(dragState.startHeight + deltaY);
  }

  function onDragEnd() {
    if (!dragState) {
      return;
    }
    dragState = null;
    snapSheet();
  }

  function setupGuide1Drag() {
    if (!screenGuide1 || !guide1Sheet) {
      return;
    }

    guide1Sheet.addEventListener("touchstart", function (event) {
      onDragStart(event.touches[0].clientY, event.target);
    });

    guide1Sheet.addEventListener(
      "touchmove",
      function (event) {
        if (!dragState) {
          return;
        }
        event.preventDefault();
        onDragMove(event.touches[0].clientY);
      },
      { passive: false }
    );

    guide1Sheet.addEventListener("touchend", onDragEnd);
    guide1Sheet.addEventListener("touchcancel", onDragEnd);

    guide1Sheet.addEventListener("mousedown", function (event) {
      if (event.button !== 0) {
        return;
      }
      onDragStart(event.clientY, event.target);

      function onMouseMove(moveEvent) {
        onDragMove(moveEvent.clientY);
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        onDragEnd();
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  function setupGuide1Actions() {
    if (!screenGuide1) {
      return;
    }

    screenGuide1.querySelectorAll(".transfer-guide__next").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        handleNextClick(btn, goToGuide2);
      });
    });

    var replay = screenGuide1.querySelector(".transfer-guide__replay");
    if (replay) {
      replay.addEventListener("click", function (event) {
        event.stopPropagation();
        replay.classList.add("is-pressed");
        replay.setAttribute("aria-pressed", "true");
        setTimeout(function () {
          replay.classList.remove("is-pressed");
          replay.setAttribute("aria-pressed", "false");
        }, 320);
      });
    }
  }

  function setupGuide2() {
    if (!screenGuide2) {
      return;
    }

    screenGuide2.querySelectorAll(".transfer-guide__next").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        handleNextClick(btn, goToFinish);
      });
    });
  }

  function clearSearchNavTimer() {
    if (searchNavTimer) {
      clearTimeout(searchNavTimer);
      searchNavTimer = null;
    }
  }

  function scheduleGuide1FromSearching() {
    clearSearchNavTimer();
    if (!screenSearching || screenSearching.hidden) {
      return;
    }
    searchNavTimer = setTimeout(function () {
      if (screenSearching && !screenSearching.hidden && window.showScreen) {
        window.showScreen("transfer-guide-1");
      }
    }, NAV_DELAY_MS);
  }

  function observeSearchingScreen() {
    if (!screenSearching) {
      return;
    }

    var observer = new MutationObserver(function () {
      if (!screenSearching.hidden) {
        scheduleGuide1FromSearching();
      } else {
        clearSearchNavTimer();
      }
    });

    observer.observe(screenSearching, {
      attributes: true,
      attributeFilter: ["hidden"],
    });

    if (!screenSearching.hidden) {
      scheduleGuide1FromSearching();
    }
  }

  function observeGuide1Screen() {
    if (!screenGuide1) {
      return;
    }

    var observer = new MutationObserver(function () {
      if (screenGuide1.hidden) {
        collapseGuide1();
      }
    });

    observer.observe(screenGuide1, {
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }

  setupGuide1Drag();
  setupGuide1Actions();
  setupGuide2();
  observeSearchingScreen();
  observeGuide1Screen();
})();
