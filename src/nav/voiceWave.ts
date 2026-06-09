export type VoiceWaveSample = {
  /** 전체 음량 0–1 */
  level: number;
  /** 고·중역 변화량 — 원 안 선의 유연한 움직임 */
  flex: number;
  /** 좌우 비대칭 기울기 -1–1 */
  tilt: number;
};

export const EMPTY_VOICE_WAVE: VoiceWaveSample = {
  level: 0,
  flex: 0,
  tilt: 0,
};

/** 경로 탐색 중 LocatorRadarVisual과 동일한 중앙 Y */
export const VOICE_RADAR_CENTER_TOP = 389;

export const VOICE_CENTER_LOTTIE_SIZE = 280;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function measureVoiceWave(
  timeData: Uint8Array,
  freqData: Uint8Array,
): VoiceWaveSample {
  let sum = 0;
  for (let i = 0; i < timeData.length; i++) {
    const sample = (timeData[i] - 128) / 128;
    sum += sample * sample;
  }

  const rms = Math.sqrt(sum / timeData.length);
  const level = clamp01((rms - 0.018) / 0.2);

  let low = 0;
  let mid = 0;
  let high = 0;

  for (let i = 2; i < 14; i++) low += freqData[i] ?? 0;
  for (let i = 14; i < 40; i++) mid += freqData[i] ?? 0;
  for (let i = 40; i < 80; i++) high += freqData[i] ?? 0;

  const lowNorm = low / (12 * 255);
  const midNorm = mid / (26 * 255);
  const highNorm = high / (40 * 255);

  const flex = clamp01(midNorm * 0.55 + highNorm * 0.85 + level * 0.25);
  const tilt = clamp01(Math.abs(highNorm - lowNorm) * 1.6) * Math.sign(highNorm - lowNorm);

  return {
    level: clamp01(level * 0.4 + flex * 0.6),
    flex,
    tilt: Number.isFinite(tilt) ? Math.min(1, Math.max(-1, tilt)) : 0,
  };
}
