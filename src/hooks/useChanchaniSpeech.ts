import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { setActiveSpeechAudio } from "../speechPlayback";
import { getVoiceVolume, subscribeVoiceVolume } from "../voiceVolume";

export type SpeakOptions = {
  text: string;
  /** @deprecated use speakingRate — kept for browser fallback */
  rate?: number;
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
  volume?: number;
};

function resolveSpeakingRate(options: SpeakOptions) {
  const rate = options.speakingRate ?? options.rate ?? 0.96;
  return Math.min(1.08, Math.max(0.88, rate));
}

function mapBrowserPitch(pitch: number | undefined) {
  const semitones = pitch ?? 0;
  return Math.min(1.08, Math.max(0.92, 1 + semitones * 0.025));
}

function pickKoreanVoice(voices: SpeechSynthesisVoice[]) {
  const ranked = voices
    .filter((voice) => voice.lang.startsWith("ko") || voice.lang.includes("KR"))
    .sort((a, b) => {
      const score = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();
        if (name.includes("google") || name.includes("premium")) return 4;
        if (name.includes("yuna") || name.includes("sinji")) return 3;
        if (voice.localService) return 2;
        return 1;
      };
      return score(b) - score(a);
    });

  return ranked[0];
}

let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([] as SpeechSynthesisVoice[]);
  }

  if (!voicesReadyPromise) {
    voicesReadyPromise = new Promise((resolve) => {
      const read = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
          return true;
        }
        return false;
      };

      if (read()) return;

      const handle = () => {
        if (read()) {
          window.speechSynthesis.removeEventListener("voiceschanged", handle);
        }
      };

      window.speechSynthesis.addEventListener("voiceschanged", handle);
      window.setTimeout(() => resolve(window.speechSynthesis.getVoices()), 400);
    });
  }

  return voicesReadyPromise;
}

export function useChanchaniSpeech() {
  const volume = useSyncExternalStore(
    subscribeVoiceVolume,
    getVoiceVolume,
    getVoiceVolume,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setActiveSpeechAudio(null);
      audioRef.current = null;
    }
    revokeObjectUrl();
  }, [revokeObjectUrl]);

  const speakWithBrowser = useCallback(
    async (options: SpeakOptions) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (!options.text.trim()) return;

      const voices = await loadVoices();
      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.lang = "ko-KR";
      utterance.rate = resolveSpeakingRate(options);
      utterance.pitch = mapBrowserPitch(options.pitch);
      utterance.volume = Math.min(
        1,
        Math.max(0, options.volume ?? getVoiceVolume()),
      );

      const koreanVoice = pickKoreanVoice(voices);
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [volume],
  );

  const speakWithGoogle = useCallback(
    async (options: SpeakOptions) => {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: options.text,
          voiceName: options.voiceName ?? "ko-KR-Chirp3-HD-Kore",
          speakingRate: resolveSpeakingRate(options),
          pitch: options.pitch ?? 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API ${response.status}`);
      }

      const blob = await response.blob();
      revokeObjectUrl();

      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audio.volume = Math.min(
        1,
        Math.max(0, options.volume ?? getVoiceVolume()),
      );
      audioRef.current = audio;
      setActiveSpeechAudio(audio);

      await audio.play();
    },
    [revokeObjectUrl],
  );

  const speak = useCallback(
    (options: SpeakOptions) => {
      if (!options.text.trim()) return;

      cancel();

      void speakWithGoogle(options).catch(() => {
        speakWithBrowser(options);
      });
    },
    [cancel, speakWithBrowser, speakWithGoogle],
  );

  useEffect(() => cancel, [cancel]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  return { speak, cancel };
}
