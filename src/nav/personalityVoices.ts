/** Chirp 3: HD — 대화형·자연스러운 한국어 TTS */
const FEMALE_WARM = "ko-KR-Chirp3-HD-Kore";
const FEMALE_BRIGHT = "ko-KR-Chirp3-HD-Aoede";
const FEMALE_CALM = "ko-KR-Chirp3-HD-Zephyr";
const FEMALE_SOFT = "ko-KR-Chirp3-HD-Leda";
const MALE_WARM = "ko-KR-Chirp3-HD-Charon";
const MALE_BRIGHT = "ko-KR-Chirp3-HD-Puck";

/** Google Cloud TTS — ko-KR Chirp3-HD */
export type GoogleVoiceConfig = {
  voiceName: string;
  speakingRate: number;
  pitch: number;
};

const PERSONALITY_VOICE: Record<string, GoogleVoiceConfig> = {
  활발한: { voiceName: MALE_BRIGHT, speakingRate: 0.98, pitch: 0 },
  귀여운: { voiceName: FEMALE_BRIGHT, speakingRate: 0.99, pitch: 0 },
  차분한: { voiceName: FEMALE_CALM, speakingRate: 0.93, pitch: 0 },
  침착한: { voiceName: MALE_WARM, speakingRate: 0.94, pitch: 0 },
  상냥한: { voiceName: FEMALE_SOFT, speakingRate: 0.96, pitch: 0 },
  여유로운: { voiceName: FEMALE_CALM, speakingRate: 0.91, pitch: 0 },
  조용한: { voiceName: FEMALE_CALM, speakingRate: 0.92, pitch: 0 },
  친근한: { voiceName: FEMALE_WARM, speakingRate: 0.97, pitch: 0 },
  믿음직한: { voiceName: MALE_WARM, speakingRate: 0.95, pitch: 0 },
  다정한: { voiceName: FEMALE_SOFT, speakingRate: 0.96, pitch: 0 },
  부드러운: { voiceName: FEMALE_SOFT, speakingRate: 0.94, pitch: 0 },
  사랑스러운: { voiceName: FEMALE_BRIGHT, speakingRate: 0.98, pitch: 0 },
};

const DEFAULT_VOICE: GoogleVoiceConfig = {
  voiceName: FEMALE_WARM,
  speakingRate: 0.96,
  pitch: 0,
};

/** Chirp3 실패 시 Neural2 폴백 */
export const NEURAL2_FALLBACK_VOICE = "ko-KR-Neural2-A";

export function getPersonalityVoice(trait: string): GoogleVoiceConfig {
  return PERSONALITY_VOICE[trait] ?? DEFAULT_VOICE;
}

export function isChirp3Voice(voiceName: string) {
  return voiceName.includes("Chirp3-HD");
}
