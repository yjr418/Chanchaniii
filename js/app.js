(function () {
  var screenHome = document.getElementById("screen-home");
  var screenCurrent = document.getElementById("screen-current-location");
  var screenCheck = document.getElementById("screen-check-location");
  var screenVoiceWaiting = document.getElementById("screen-voice-waiting");
  var screenVoiceSpeaking = document.getElementById("screen-voice-speaking");
  var screenSearchingPath = document.getElementById("screen-searching-path");
  var screenTransferGuide1 = document.getElementById("screen-transfer-guide-1");
  var screenTransferGuide2 = document.getElementById("screen-transfer-guide-2");
  var screenTransferGuideFinish = document.getElementById("screen-transfer-guide-finish");
  var screenSelectExit = document.getElementById("screen-select-exit");
  var screenSettings = document.getElementById("screen-settings");
  var btnBack = document.getElementById("btn-back");
  var btnBackCheck = document.getElementById("btn-back-check");
  var btnBackVoiceWaiting = document.getElementById("btn-back-voice-waiting");
  var btnBackVoice = document.getElementById("btn-back-voice");
  var btnBackSearching = document.getElementById("btn-back-searching");
  var btnBackTransfer1 = document.getElementById("btn-back-transfer-1");
  var btnBackTransfer2 = document.getElementById("btn-back-transfer-2");
  var btnBackSelectExit = document.getElementById("btn-back-select-exit");
  var btnBackSettings = document.getElementById("btn-back-settings");
  var voiceTranscript = document.getElementById("voice-transcript");
  var voiceStatus = document.getElementById("voice-status");
  var voiceWaitingPrompt = document.getElementById("voice-waiting-prompt");
  var autoNavTimer = null;
  var LOCATION_SCAN_MS = 5000;
  var WAITING_PROMPT_DEFAULT = "목적지를 말씀해 주세요";
  var homeFlowAfterCheck = "voice-waiting";
  var currentScreenName = "home";
  var screenBeforeSettings = "home";

  function resetCheckLocationButtons() {
    var btnConfirm = document.querySelector(".check-location__confirm");
    if (btnConfirm) {
      btnConfirm.classList.remove("is-selected");
      btnConfirm.setAttribute("aria-pressed", "false");
    }
  }

  function showScreen(name) {
    if (autoNavTimer) {
      clearTimeout(autoNavTimer);
      autoNavTimer = null;
    }

    var isHome = name === "home";
    var isCurrent = name === "current-location";
    var isCheck = name === "check-location";
    var isVoiceWaiting = name === "voice-waiting";
    var isVoiceSpeaking = name === "voice-speaking";
    var isSearchingPath = name === "searching-path";
    var isTransferGuide1 = name === "transfer-guide-1";
    var isTransferGuide2 = name === "transfer-guide-2";
    var isTransferGuideFinish = name === "transfer-guide-finish";
    var isSelectExit = name === "select-exit";
    var isSettings = name === "settings";

    if (!isSettings) {
      currentScreenName = name;
    }

    if (!isSettings && !isVoiceWaiting && !isVoiceSpeaking && !isSearchingPath) {
      if (window.VoiceSpeech) {
        window.VoiceSpeech.reset();
      }
      resetSpeakingUi();
    } else if (!isSettings && (isSearchingPath || isTransferGuide1 || isTransferGuide2 || isTransferGuideFinish) && window.VoiceSpeech) {
      window.VoiceSpeech.reset();
    }

    screenHome.hidden = !isHome;
    screenCurrent.hidden = !isCurrent;
    if (screenCheck) {
      screenCheck.hidden = !isCheck;
    }
    if (screenVoiceWaiting) {
      screenVoiceWaiting.hidden = !isVoiceWaiting;
    }
    if (screenVoiceSpeaking) {
      screenVoiceSpeaking.hidden = !isVoiceSpeaking;
    }
    if (screenSearchingPath) {
      screenSearchingPath.hidden = !isSearchingPath;
    }
    if (screenTransferGuide1) {
      screenTransferGuide1.hidden = !isTransferGuide1;
    }
    if (screenTransferGuide2) {
      screenTransferGuide2.hidden = !isTransferGuide2;
    }
    if (screenTransferGuideFinish) {
      screenTransferGuideFinish.hidden = !isTransferGuideFinish;
      if (!isTransferGuideFinish) {
        var btnFinishHome = screenTransferGuideFinish.querySelector(".transfer-guide-finish__home");
        if (btnFinishHome) {
          btnFinishHome.classList.remove("is-selected");
          btnFinishHome.setAttribute("aria-pressed", "false");
        }
      }
    }
    if (screenSelectExit) {
      screenSelectExit.hidden = !isSelectExit;
    }
    if (screenSettings) {
      screenSettings.hidden = !isSettings;
    }

    if (isCurrent) {
      history.replaceState(null, "", "#80-2653");
      autoNavTimer = setTimeout(function () {
        showScreen("check-location");
      }, LOCATION_SCAN_MS);
    } else if (isCheck) {
      history.replaceState(null, "", "#check-location");
      resetCheckLocationButtons();
    } else if (isVoiceWaiting) {
      history.replaceState(null, "", "#voice-waiting");
      startVoiceWaiting();
    } else if (isVoiceSpeaking) {
      history.replaceState(null, "", "#voice-speaking");
    } else if (isSearchingPath) {
      history.replaceState(null, "", "#searching-path");
    } else if (isTransferGuide1) {
      history.replaceState(null, "", "#transfer-guide-1");
    } else if (isTransferGuide2) {
      history.replaceState(null, "", "#transfer-guide-2");
    } else if (isTransferGuideFinish) {
      history.replaceState(null, "", "#transfer-guide-finish");
    } else if (isSelectExit) {
      history.replaceState(null, "", "#select-exit");
    } else if (isSettings) {
      history.replaceState(null, "", "#settings");
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

  function shouldOpenCheckLocation() {
    var hash = location.hash;
    return hash === "#check-location" || hash === "#11-check-location";
  }

  function shouldOpenVoiceWaiting() {
    var hash = location.hash;
    return hash === "#voice-waiting" || hash === "#12-voice-waiting";
  }

  function shouldOpenVoiceSpeaking() {
    var hash = location.hash;
    return hash === "#voice-speaking" || hash === "#12-voice-speaking";
  }

  function shouldOpenSearchingPath() {
    var hash = location.hash;
    return hash === "#searching-path" || hash === "#13-searching-path";
  }

  function shouldOpenTransferGuide1() {
    var hash = location.hash;
    return hash === "#transfer-guide-1" || hash === "#14-transfer-guide-1";
  }

  function shouldOpenSelectExit() {
    var hash = location.hash;
    return hash === "#select-exit" || hash === "#17-select-exit";
  }

  function shouldOpenSettings() {
    var hash = location.hash;
    return hash === "#settings" || hash === "#18-settings";
  }

  function shouldOpenTransferGuideFinish() {
    var hash = location.hash;
    return hash === "#transfer-guide-finish" || hash === "#15-transfer-guide-finish";
  }

  function shouldOpenTransferGuide2() {
    var hash = location.hash;
    return hash === "#transfer-guide-2" || hash === "#14-transfer-guide-2";
  }

  function setWaitingPrompt(text) {
    if (voiceWaitingPrompt) {
      voiceWaitingPrompt.textContent = text || WAITING_PROMPT_DEFAULT;
    }
  }

  function resetSpeakingUi() {
    if (voiceTranscript) {
      voiceTranscript.textContent = "";
      voiceTranscript.classList.remove("is-interim");
    }
    if (voiceStatus) {
      voiceStatus.textContent = "듣고 있어요!";
      voiceStatus.hidden = true;
    }
    if (screenVoiceSpeaking) {
      screenVoiceSpeaking.classList.remove("is-listening");
    }
    setWaitingPrompt(WAITING_PROMPT_DEFAULT);
  }

  function enterSpeakingMode() {
    if (screenVoiceWaiting) {
      screenVoiceWaiting.hidden = true;
    }
    if (screenVoiceSpeaking) {
      screenVoiceSpeaking.hidden = false;
    }
    history.replaceState(null, "", "#voice-speaking");

    if (voiceTranscript) {
      voiceTranscript.textContent = "";
      voiceTranscript.classList.remove("is-interim");
    }
    if (voiceStatus) {
      voiceStatus.textContent = "듣고 있어요!";
      voiceStatus.hidden = false;
    }
    if (screenVoiceSpeaking) {
      screenVoiceSpeaking.classList.add("is-listening");
    }
  }

  function updateTranscript(text, hasInterim) {
    if (!voiceTranscript) {
      return;
    }

    var trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    voiceTranscript.textContent = trimmed;
    voiceTranscript.classList.toggle("is-interim", Boolean(hasInterim));

    if (
      voiceStatus &&
      screenVoiceSpeaking &&
      screenVoiceSpeaking.classList.contains("is-listening")
    ) {
      voiceStatus.textContent = "듣고 있어요!";
      voiceStatus.hidden = false;
    }
  }

  function startVoiceWaiting() {
    resetSpeakingUi();

    if (!window.VoiceSpeech || !window.VoiceSpeech.isSupported()) {
      setWaitingPrompt("이 브라우저는 음성 인식을 지원하지 않아요.");
      return;
    }

    setWaitingPrompt("마이크 권한을 확인하고 있어요...");

    window.VoiceSpeech.start().then(function (started) {
      if (started) {
        setWaitingPrompt(WAITING_PROMPT_DEFAULT);
      }
    });
  }

  function setupSpeech() {
    if (!window.VoiceSpeech) {
      return;
    }

    window.VoiceSpeech.setOnReady(function () {
      if (screenVoiceWaiting && !screenVoiceWaiting.hidden) {
        setWaitingPrompt(WAITING_PROMPT_DEFAULT);
      }
    });

    window.VoiceSpeech.setOnSpeechStart(function () {
      enterSpeakingMode();
    });

    window.VoiceSpeech.setOnTranscript(function (text, hasInterim) {
      if (screenVoiceSpeaking && screenVoiceSpeaking.hidden) {
        return;
      }
      updateTranscript(text, hasInterim);
    });

    window.VoiceSpeech.setOnError(function (code) {
      if (code === "no-speech" || code === "aborted") {
        if (screenVoiceWaiting && !screenVoiceWaiting.hidden) {
          setWaitingPrompt(WAITING_PROMPT_DEFAULT);
          window.VoiceSpeech.start();
        }
        return;
      }

      if (code === "not-allowed") {
        setWaitingPrompt("마이크 권한이 필요해요.");
        if (voiceStatus) {
          voiceStatus.textContent = "마이크 권한이 필요해요.";
          voiceStatus.hidden = false;
        }
        return;
      }

      if (code === "not-supported") {
        setWaitingPrompt("음성 인식을 사용할 수 없어요.");
        return;
      }

      if (screenVoiceWaiting && !screenVoiceWaiting.hidden) {
        setWaitingPrompt(WAITING_PROMPT_DEFAULT);
        window.VoiceSpeech.start();
      }
    });

    window.VoiceSpeech.setOnEnd(function (didSpeak) {
      if (didSpeak) {
        if (screenVoiceSpeaking) {
          screenVoiceSpeaking.classList.remove("is-listening");
        }
        if (voiceTranscript) {
          voiceTranscript.classList.remove("is-interim");
        }
        if (voiceStatus) {
          voiceStatus.hidden = true;
        }
        return;
      }

      if (screenVoiceWaiting && !screenVoiceWaiting.hidden) {
        window.VoiceSpeech.start();
      }
    });
  }

  document.querySelectorAll("#screen-home [data-goto='current-location']").forEach(function (el) {
    el.addEventListener("click", function () {
      homeFlowAfterCheck = el.getAttribute("data-after-check") || "voice-waiting";
      showScreen("current-location");
    });
  });

  document.querySelectorAll("#screen-home [data-goto='select-exit']").forEach(function (el) {
    el.addEventListener("click", function () {
      homeFlowAfterCheck = el.getAttribute("data-after-check") || "searching-path";
      showScreen("select-exit");
    });
  });

  function openSettings() {
    if (screenSettings && !screenSettings.hidden) {
      return;
    }
    screenBeforeSettings = currentScreenName;
    showScreen("settings");
  }

  function closeSettings() {
    showScreen(screenBeforeSettings);
  }

  document.querySelectorAll(".fab--settings").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openSettings();
    });
  });

  btnBack.addEventListener("click", function () {
    showScreen("home");
  });

  if (btnBackCheck) {
    btnBackCheck.addEventListener("click", function () {
      showScreen("home");
    });
  }

  if (btnBackVoiceWaiting) {
    btnBackVoiceWaiting.addEventListener("click", function () {
      showScreen("check-location");
    });
  }

  if (btnBackVoice) {
    btnBackVoice.addEventListener("click", function () {
      showScreen("voice-waiting");
    });
  }

  if (btnBackSearching) {
    btnBackSearching.addEventListener("click", function () {
      showScreen("voice-speaking");
    });
  }

  if (btnBackTransfer1) {
    btnBackTransfer1.addEventListener("click", function () {
      showScreen("searching-path");
    });
  }

  if (btnBackTransfer2) {
    btnBackTransfer2.addEventListener("click", function () {
      showScreen("transfer-guide-1");
    });
  }

  if (btnBackSelectExit) {
    btnBackSelectExit.addEventListener("click", function () {
      showScreen("home");
    });
  }

  if (btnBackSettings) {
    btnBackSettings.addEventListener("click", function () {
      closeSettings();
    });
  }

  var btnConfirm = document.querySelector(".check-location__confirm");
  if (btnConfirm) {
    btnConfirm.addEventListener("click", function () {
      btnConfirm.classList.add("is-selected");
      btnConfirm.setAttribute("aria-pressed", "true");
      showScreen(homeFlowAfterCheck);
    });
  }

  var btnReviseLocation = document.querySelector(".check-location__voice");
  if (btnReviseLocation) {
    btnReviseLocation.addEventListener("click", function () {
      resetCheckLocationButtons();
      showScreen("current-location");
    });
  }

  setupSpeech();

  window.showScreen = showScreen;
  window.openSettings = openSettings;
  window.closeSettings = closeSettings;
  window.setHomeFlowAfterCheck = function (flow) {
    homeFlowAfterCheck = flow || "voice-waiting";
  };

  if (shouldOpenSettings()) {
    showScreen("settings");
  } else if (shouldOpenSelectExit()) {
    showScreen("select-exit");
  } else if (shouldOpenTransferGuideFinish()) {
    showScreen("transfer-guide-finish");
  } else if (shouldOpenTransferGuide2()) {
    showScreen("transfer-guide-2");
  } else if (shouldOpenTransferGuide1()) {
    showScreen("transfer-guide-1");
  } else if (shouldOpenSearchingPath()) {
    showScreen("searching-path");
  } else if (shouldOpenVoiceSpeaking()) {
    showScreen("voice-waiting");
    startVoiceWaiting();
  } else if (shouldOpenVoiceWaiting()) {
    showScreen("voice-waiting");
  } else if (shouldOpenCheckLocation()) {
    showScreen("check-location");
  } else if (shouldOpenCurrentLocation()) {
    showScreen("current-location");
  }
})();
