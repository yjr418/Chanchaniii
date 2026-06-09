/** Chirp 3 HD용 — 짧은 쉼으로 말하기 리듬을 자연스럽게 */
export function toChirp3Markup(text: string) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/([!?.…])\s+/g, "$1 [pause short] ")
    .replace(/(\d+걸음)\s+/g, "$1 [pause short] ");
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Neural2 폴백용 SSML */
export function toNeural2Ssml(text: string) {
  const escaped = escapeXml(text.trim());
  const withBreaks = escaped
    .replace(/([!?.…])\s+/g, '$1<break time="280ms"/> ')
    .replace(/(\d+걸음)\s+/g, '$1<break time="180ms"/> ');

  return `<speak>${withBreaks}</speak>`;
}
