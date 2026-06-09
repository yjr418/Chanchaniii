const STORAGE_KEY = "chanchani-voice-volume";
const BASELINE_KEY = "chanchani-voice-baseline-v2";

/** 슬라이더 중앙 — 현재 앱에서 설계한 목소리 크기 */
export const VOICE_VOLUME_DEFAULT = 50;

const VOICE_VOLUME_MIN = 0.08;
const VOICE_VOLUME_BASE = 0.5;
const VOICE_VOLUME_MAX = 1;

export function volumeFromRange(value: number) {
  const clamped = Math.min(100, Math.max(0, value));

  if (clamped <= VOICE_VOLUME_DEFAULT) {
    const t = clamped / VOICE_VOLUME_DEFAULT;
    return VOICE_VOLUME_MIN + t * (VOICE_VOLUME_BASE - VOICE_VOLUME_MIN);
  }

  const t =
    (clamped - VOICE_VOLUME_DEFAULT) / (100 - VOICE_VOLUME_DEFAULT);
  return VOICE_VOLUME_BASE + t * (VOICE_VOLUME_MAX - VOICE_VOLUME_BASE);
}

export function loadVoiceVolumeSetting() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return VOICE_VOLUME_DEFAULT;

  const parsed = Number(stored);
  if (!Number.isFinite(parsed)) return VOICE_VOLUME_DEFAULT;

  return Math.min(100, Math.max(0, parsed));
}

export function saveVoiceVolumeSetting(value: number) {
  localStorage.setItem(STORAGE_KEY, String(value));
}

let currentVolume = volumeFromRange(loadVoiceVolumeSetting());
const listeners = new Set<() => void>();

export function getVoiceVolume() {
  return currentVolume;
}

export function setVoiceVolumeFromRange(value: number) {
  const clamped = Math.min(100, Math.max(0, value));
  currentVolume = volumeFromRange(clamped);
  saveVoiceVolumeSetting(clamped);
  listeners.forEach((listener) => listener());
}

export function subscribeVoiceVolume(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initVoiceVolume() {
  if (localStorage.getItem(BASELINE_KEY) !== "1") {
    saveVoiceVolumeSetting(VOICE_VOLUME_DEFAULT);
    localStorage.setItem(BASELINE_KEY, "1");
  }
  currentVolume = volumeFromRange(loadVoiceVolumeSetting());
}
