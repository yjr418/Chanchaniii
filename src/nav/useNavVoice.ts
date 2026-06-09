import { useCallback, useEffect, useRef, useState } from "react";
import type { NavStep } from "./navTypes";
import {
  EMPTY_VOICE_WAVE,
  measureVoiceWave,
  type VoiceWaveSample,
} from "./voiceWave";

const PROMPT_DEFAULT = "목적지를 말씀해 주세요";
const MIN_DESTINATION_CHARS = 2;
const NAVIGATE_AFTER_FINAL_MS = 1200;

type UseNavVoiceOptions = {
  step: NavStep;
  onEnterSpeaking: () => void;
  onNavigateSearching: () => void;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  [index: number]: { transcript: string };
};

type SpeechRecognitionResultEvent = {
  results: ArrayLike<SpeechRecognitionResultLike> & { length: number };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onspeechstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | undefined {
  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition;
}

function extractTranscript(event: SpeechRecognitionResultEvent) {
  let interim = "";
  let final = "";

  for (let i = 0; i < event.results.length; i++) {
    const result = event.results[i];
    const chunk = result[0]?.transcript ?? "";
    if (result.isFinal) {
      final += chunk;
    } else {
      interim += chunk;
    }
  }

  const interimText = interim.trim();
  const finalText = final.trim();
  const display = `${finalText}${interimText}`.trim();

  return { display, finalText, interimText };
}

function isListeningStep(step: NavStep) {
  return step === "voice-waiting" || step === "voice-speaking";
}

export function useNavVoice({
  step,
  onEnterSpeaking,
  onNavigateSearching,
}: UseNavVoiceOptions) {
  const [prompt, setPrompt] = useState(PROMPT_DEFAULT);
  const [speakingText, setSpeakingText] = useState("");
  const [isSpeakingActive, setIsSpeakingActive] = useState(false);
  const voiceWaveRef = useRef<VoiceWaveSample>({ ...EMPTY_VOICE_WAVE });

  const stepRef = useRef(step);
  const onEnterSpeakingRef = useRef(onEnterSpeaking);
  const onNavigateSearchingRef = useRef(onNavigateSearching);

  const micStreamRef = useRef<MediaStream | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const micRafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const sessionRef = useRef(0);
  const hasTransitionedRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const navigateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    onEnterSpeakingRef.current = onEnterSpeaking;
    onNavigateSearchingRef.current = onNavigateSearching;
  }, [onEnterSpeaking, onNavigateSearching]);

  const clearNavigateTimer = useCallback(() => {
    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  const stopMicMonitor = useCallback(() => {
    if (micRafRef.current !== null) {
      cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    if (micContextRef.current) {
      void micContextRef.current.close();
      micContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    voiceWaveRef.current = { ...EMPTY_VOICE_WAVE };
    stopSpeechRecognition();
  }, [stopSpeechRecognition]);

  const resetVoiceSession = useCallback(() => {
    clearNavigateTimer();
    setSpeakingText("");
    setIsSpeakingActive(false);
    voiceWaveRef.current = { ...EMPTY_VOICE_WAVE };
    hasTransitionedRef.current = false;
    hasNavigatedRef.current = false;
    lastTranscriptRef.current = "";
  }, [clearNavigateTimer]);

  const transitionToSpeaking = useCallback(() => {
    if (hasTransitionedRef.current || stepRef.current !== "voice-waiting") {
      return;
    }

    hasTransitionedRef.current = true;
    setIsSpeakingActive(true);
    onEnterSpeakingRef.current();
  }, []);

  const scheduleNavigateAfterFinal = useCallback(
    (text: string) => {
      clearNavigateTimer();
      navigateTimerRef.current = window.setTimeout(() => {
        if (hasNavigatedRef.current) return;

        hasNavigatedRef.current = true;
        setSpeakingText(text);
        setIsSpeakingActive(true);
        stopMicMonitor();
        onNavigateSearchingRef.current();
      }, NAVIGATE_AFTER_FINAL_MS);
    },
    [clearNavigateTimer, stopMicMonitor],
  );

  const handleSpeechActivity = useCallback(() => {
    if (hasNavigatedRef.current) return;
    if (!isListeningStep(stepRef.current)) return;

    if (stepRef.current === "voice-waiting") {
      transitionToSpeaking();
    }

    setIsSpeakingActive(true);
  }, [transitionToSpeaking]);

  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionResultEvent) => {
      if (hasNavigatedRef.current) return;
      if (!isListeningStep(stepRef.current)) return;

      const { display, finalText } = extractTranscript(event);
      if (!display) return;

      if (stepRef.current === "voice-waiting") {
        transitionToSpeaking();
      }

      lastTranscriptRef.current = display;
      setSpeakingText(display);
      setIsSpeakingActive(true);

      if (finalText.length >= MIN_DESTINATION_CHARS) {
        scheduleNavigateAfterFinal(finalText);
      }
    },
    [scheduleNavigateAfterFinal, transitionToSpeaking],
  );

  const monitorMicLevel = useCallback(
    (
      session: number,
      analyser: AnalyserNode,
      timeData: Uint8Array,
      freqData: Uint8Array,
    ) => {
      if (
        session !== sessionRef.current ||
        hasNavigatedRef.current ||
        !isListeningStep(stepRef.current)
      ) {
        return;
      }

      analyser.getByteTimeDomainData(timeData as Uint8Array<ArrayBuffer>);
      analyser.getByteFrequencyData(freqData as Uint8Array<ArrayBuffer>);
      voiceWaveRef.current = measureVoiceWave(timeData, freqData);

      micRafRef.current = requestAnimationFrame(() => {
        monitorMicLevel(session, analyser, timeData, freqData);
      });
    },
    [],
  );

  const startSpeechRecognition = useCallback(
    (session: number) => {
      const SpeechRecognitionCtor = getSpeechRecognitionCtor();
      if (!SpeechRecognitionCtor) {
        setPrompt("이 브라우저에서는 음성 인식을 지원하지 않아요.");
        return;
      }

      stopSpeechRecognition();

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "ko-KR";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onspeechstart = () => {
        if (session !== sessionRef.current) return;
        handleSpeechActivity();
      };
      recognition.onaudiostart = () => {
        if (session !== sessionRef.current) return;
        handleSpeechActivity();
      };
      recognition.onsoundstart = () => {
        if (session !== sessionRef.current) return;
        handleSpeechActivity();
      };
      recognition.onresult = (event) => {
        if (session !== sessionRef.current) return;
        handleRecognitionResult(event);
      };
      recognition.onerror = (event) => {
        if (session !== sessionRef.current || hasNavigatedRef.current) return;

        if (event.error === "no-speech" || event.error === "aborted") {
          if (isListeningStep(stepRef.current)) {
            try {
              recognition.start();
            } catch {
              /* ignore restart race */
            }
          }
        }
      };
      recognition.onend = () => {
        if (
          session !== sessionRef.current ||
          hasNavigatedRef.current ||
          !isListeningStep(stepRef.current)
        ) {
          return;
        }

        try {
          recognition.start();
        } catch {
          /* ignore restart race */
        }
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch {
        recognitionRef.current = null;
        setPrompt("음성 인식을 시작하지 못했어요. 다시 시도해 주세요.");
      }
    },
    [
      handleRecognitionResult,
      handleSpeechActivity,
      stopSpeechRecognition,
    ],
  );

  const startMicMonitor = useCallback(async () => {
    stopMicMonitor();
    const session = sessionRef.current + 1;
    sessionRef.current = session;

    if (!navigator.mediaDevices?.getUserMedia) {
      setPrompt("화면을 탭하면 다음으로 넘어갈 수 있어요.");
      return;
    }

    setPrompt("마이크 권한을 확인하고 있어요...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (
        session !== sessionRef.current ||
        !isListeningStep(stepRef.current)
      ) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (AudioCtx) {
        const context = new AudioCtx();
        micContextRef.current = context;

        if (context.state === "suspended") {
          await context.resume();
        }

        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.35;
        source.connect(analyser);

        const timeData = new Uint8Array(analyser.fftSize);
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        micRafRef.current = requestAnimationFrame(() => {
          monitorMicLevel(session, analyser, timeData, freqData);
        });
      }

      startSpeechRecognition(session);
      setPrompt(PROMPT_DEFAULT);
    } catch {
      setPrompt("마이크 권한이 필요해요. 설정에서 허용해 주세요.");
    }
  }, [monitorMicLevel, startSpeechRecognition, stopMicMonitor]);

  const startVoiceWaiting = useCallback(() => {
    resetVoiceSession();
    setPrompt(PROMPT_DEFAULT);
    void startMicMonitor();
  }, [resetVoiceSession, startMicMonitor]);

  const remindToSpeak = useCallback(() => {
    if (hasNavigatedRef.current) return;
    setPrompt("마이크에 대고 목적지를 말해 주세요.");
  }, []);

  useEffect(() => {
    if (step === "voice-waiting") {
      startVoiceWaiting();
      return;
    }

    if (step === "voice-speaking") {
      return;
    }

    sessionRef.current += 1;
    stopMicMonitor();
    resetVoiceSession();
    setPrompt(PROMPT_DEFAULT);
  }, [resetVoiceSession, startVoiceWaiting, step, stopMicMonitor]);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      stopMicMonitor();
      clearNavigateTimer();
    };
  }, [clearNavigateTimer, stopMicMonitor]);

  return {
    prompt,
    speakingText,
    isSpeakingActive,
    voiceWaveRef,
    startVoiceWaiting,
    resetSpeakingUi: resetVoiceSession,
    armTapFallback: remindToSpeak,
  };
}
