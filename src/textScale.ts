const TEXT_SCALE_MIN = 0.85;
const TEXT_SCALE_MAX = 1.15;
const STORAGE_KEY = "chanchani-text-size";

/** 슬라이더 중앙(50) — 수정 이전과 동일한 기본 글자 크기 */
export const TEXT_SCALE_DEFAULT = 50;

/** 중앙(50)일 때 --app-text-scale = 1.0625 (index.css 기본값과 동일) */
export const TEXT_BASE_SIZE_RATIO = 1.0625;

export function scaleFromRange(value: number) {
  const ratio = Math.min(100, Math.max(0, value)) / 100;
  const sliderScale =
    TEXT_SCALE_MIN + ratio * (TEXT_SCALE_MAX - TEXT_SCALE_MIN);
  return sliderScale * TEXT_BASE_SIZE_RATIO;
}

export function applyTextScale(value: number) {
  document.documentElement.style.setProperty(
    "--app-text-scale",
    String(scaleFromRange(value)),
  );
}

export function loadTextScaleSetting() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return TEXT_SCALE_DEFAULT;

  const parsed = Number(stored);
  if (!Number.isFinite(parsed)) return TEXT_SCALE_DEFAULT;

  return Math.min(100, Math.max(0, parsed));
}

export function saveTextScaleSetting(value: number) {
  localStorage.setItem(STORAGE_KEY, String(value));
}

export function initTextScale() {
  applyTextScale(loadTextScaleSetting());
}
