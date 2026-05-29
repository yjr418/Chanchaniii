(function () {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  var recognition = null;
  var isRunning = false;
  var hasSpeechStarted = false;
  var finalTranscript = "";

  var onSpeechStart = null;
  var onTranscript = null;
  var onError = null;
  var onEnd = null;
  var onReady = null;

  function isSupported() {
    return Boolean(SpeechRecognition);
  }

  function requestMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.resolve();
    }

    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      });
  }

  function createRecognition() {
    var instance = new SpeechRecognition();
    instance.lang = "ko-KR";
    instance.interimResults = true;
    instance.continuous = false;
    instance.maxAlternatives = 1;
    return instance;
  }

  function handleResult(event) {
    var interim = "";
    var final = "";

    for (var i = 0; i < event.results.length; i++) {
      var result = event.results[i];
      var text = result[0].transcript;

      if (result.isFinal) {
        final += text;
      } else {
        interim += text;
      }
    }

    var combined = (final + interim).trim();
    if (!hasSpeechStarted && combined.length > 0) {
      handleSpeechStart();
    }

    if (!hasSpeechStarted) {
      return;
    }

    finalTranscript = final;

    if (onTranscript) {
      onTranscript(combined, Boolean(interim));
    }
  }

  function handleSpeechStart() {
    if (hasSpeechStarted) {
      return;
    }
    hasSpeechStarted = true;
    if (onSpeechStart) {
      onSpeechStart();
    }
  }

  function bindHandlers(instance) {
    instance.onresult = handleResult;
    instance.onspeechstart = handleSpeechStart;
    instance.onaudiostart = handleSpeechStart;
    instance.onsoundstart = handleSpeechStart;

    instance.onstart = function () {
      if (onReady) {
        onReady();
      }
    };

    instance.onend = function () {
      var didSpeak = hasSpeechStarted;
      isRunning = false;

      if (didSpeak && onTranscript) {
        onTranscript(finalTranscript.trim(), false);
      }

      if (onEnd) {
        onEnd(didSpeak);
      }
    };

    instance.onerror = function (event) {
      isRunning = false;
      if (onError) {
        onError(event.error || "unknown");
      }
    };
  }

  function startRecognition() {
    recognition = createRecognition();
    bindHandlers(recognition);
    recognition.start();
    isRunning = true;
    return true;
  }

  function start() {
    if (!isSupported()) {
      if (onError) {
        onError("not-supported");
      }
      return Promise.resolve(false);
    }

    stop();
    hasSpeechStarted = false;
    finalTranscript = "";

    return requestMicrophone()
      .then(function () {
        try {
          return startRecognition();
        } catch (err) {
          if (onError) {
            onError("start-failed");
          }
          return false;
        }
      })
      .catch(function () {
        if (onError) {
          onError("not-allowed");
        }
        return false;
      });
  }

  function stop() {
    if (!recognition) {
      return;
    }

    try {
      recognition.stop();
    } catch (err) {
      /* already stopped */
    }

    recognition = null;
    isRunning = false;
  }

  function reset() {
    stop();
    hasSpeechStarted = false;
    finalTranscript = "";
  }

  window.VoiceSpeech = {
    isSupported: isSupported,
    start: start,
    stop: stop,
    reset: reset,
    setOnSpeechStart: function (fn) {
      onSpeechStart = fn;
    },
    setOnTranscript: function (fn) {
      onTranscript = fn;
    },
    setOnError: function (fn) {
      onError = fn;
    },
    setOnEnd: function (fn) {
      onEnd = fn;
    },
    setOnReady: function (fn) {
      onReady = fn;
    },
  };
})();
