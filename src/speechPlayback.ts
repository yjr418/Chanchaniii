import { getVoiceVolume, subscribeVoiceVolume } from "./voiceVolume";

let activeSpeechAudio: HTMLAudioElement | null = null;

export function setActiveSpeechAudio(audio: HTMLAudioElement | null) {
  activeSpeechAudio = audio;
  if (activeSpeechAudio) {
    activeSpeechAudio.volume = getVoiceVolume();
  }
}

function syncActiveSpeechAudioVolume() {
  if (activeSpeechAudio) {
    activeSpeechAudio.volume = getVoiceVolume();
  }
}

export function isSpeechAudioPlaying() {
  return (
    activeSpeechAudio !== null &&
    !activeSpeechAudio.paused &&
    !activeSpeechAudio.ended
  );
}

subscribeVoiceVolume(syncActiveSpeechAudioVolume);
