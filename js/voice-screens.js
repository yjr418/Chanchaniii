(function () {
  var screenWaiting = document.getElementById("screen-voice-waiting");
  var screenSpeaking = document.getElementById("screen-voice-speaking");
  var voiceText = document.getElementById("voice-speaking-text");
  var voicePrompt = document.getElementById("voice-waiting-prompt");

  var speechTimers = [];
  var micStream = null;
  var micContext = null;
  var micRaf = null;
  var micTriggered = false;
  var waitingArmed = false;

  var PROMPT_DEFAULT = "목적지를 말씀해 주세요";
  var SPEAK_THRESHOLD = 18;

  window.VoiceSpeech = {
    isSupported: function () {
      return true;
    },
    start: function () {
      return Promise.resolve(true);
    },
    stop: function () {},
    reset: function () {
      stopMicMonitor();
      resetSpeakingUi();
    },
    setOnSpeechStart: function () {},
    setOnTranscript: function () {},
    setOnError: function () {},
    setOnEnd: function () {},
    setOnReady: function () {},
  };

  function clearSpeechTimers() {
    speechTimers.forEach(clearTimeout);
    speechTimers = [];
  }

  function setPrompt(text) {
    if (voicePrompt) {
      voicePrompt.textContent = text || PROMPT_DEFAULT;
    }
  }

  function resetSpeakingUi() {
    clearSpeechTimers();
    if (voiceText) {
      voiceText.textContent = "";
      voiceText.hidden = true;
    }
    if (screenSpeaking) {
      screenSpeaking.classList.remove("is-active");
    }
  }

  function stopMicMonitor() {
    if (micRaf) {
      cancelAnimationFrame(micRaf);
      micRaf = null;
    }
    if (micContext) {
      micContext.close().catch(function () {});
      micContext = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(function (track) {
        track.stop();
      });
      micStream = null;
    }
    micTriggered = false;
    waitingArmed = false;
  }

  function enterSpeakingMode() {
    if (!screenWaiting || !screenSpeaking || screenSpeaking.hidden === false) {
      return;
    }

    stopMicMonitor();
    resetSpeakingUi();

    screenWaiting.hidden = true;
    screenSpeaking.hidden = false;
    screenSpeaking.classList.add("is-active");
    history.replaceState(null, "", "#voice-speaking");

    speechTimers.push(
      setTimeout(function () {
        if (!voiceText || screenSpeaking.hidden) {
          return;
        }
        voiceText.textContent = "듣고 있어요!";
        voiceText.hidden = false;
      }, 2000)
    );

    speechTimers.push(
      setTimeout(function () {
        if (!voiceText || screenSpeaking.hidden) {
          return;
        }
        voiceText.textContent = "강남역으로 가고 싶어.";
        voiceText.hidden = false;
      }, 4000)
    );

    speechTimers.push(
      setTimeout(function () {
        if (screenSpeaking && screenSpeaking.hidden) {
          return;
        }
        if (window.showScreen) {
          window.showScreen("searching-path");
        }
      }, 6000)
    );
  }

  function monitorMicLevel(analyser, data) {
    if (micTriggered || !screenWaiting || screenWaiting.hidden) {
      return;
    }

    analyser.getByteFrequencyData(data);
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum += data[i];
    }
    var average = sum / data.length;

    if (average >= SPEAK_THRESHOLD) {
      micTriggered = true;
      enterSpeakingMode();
      return;
    }

    micRaf = requestAnimationFrame(function () {
      monitorMicLevel(analyser, data);
    });
  }

  function startMicMonitor() {
    stopMicMonitor();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPrompt(PROMPT_DEFAULT);
      armClickFallback();
      return;
    }

    setPrompt("마이크 권한을 확인하고 있어요...");

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        if (!screenWaiting || screenWaiting.hidden) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          return;
        }

        micStream = stream;
        micContext = new (window.AudioContext || window.webkitAudioContext)();
        var source = micContext.createMediaStreamSource(stream);
        var analyser = micContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        var data = new Uint8Array(analyser.frequencyBinCount);
        setPrompt(PROMPT_DEFAULT);
        micRaf = requestAnimationFrame(function () {
          monitorMicLevel(analyser, data);
        });
      })
      .catch(function () {
        setPrompt("마이크 권한이 필요해요.");
        armClickFallback();
      });
  }

  function armClickFallback() {
    if (!screenWaiting || waitingArmed) {
      return;
    }

    waitingArmed = true;

    function onTap(event) {
      if (event.target.closest(".fab")) {
        return;
      }
      screenWaiting.removeEventListener("click", onTap);
      waitingArmed = false;
      enterSpeakingMode();
    }

    screenWaiting.addEventListener("click", onTap);
  }

  function startVoiceWaiting() {
    resetSpeakingUi();
    setPrompt(PROMPT_DEFAULT);
    startMicMonitor();
  }

  function observeScreens() {
    if (!screenWaiting && !screenSpeaking) {
      return;
    }

    var observer = new MutationObserver(function () {
      if (screenWaiting && !screenWaiting.hidden) {
        startVoiceWaiting();
      }

      if (screenSpeaking && screenSpeaking.hidden) {
        stopMicMonitor();
        resetSpeakingUi();
      }
    });

    if (screenWaiting) {
      observer.observe(screenWaiting, { attributes: true, attributeFilter: ["hidden"] });
    }
    if (screenSpeaking) {
      observer.observe(screenSpeaking, { attributes: true, attributeFilter: ["hidden"] });
    }

    if (screenWaiting && !screenWaiting.hidden) {
      startVoiceWaiting();
    }
  }

  observeScreens();
})();
