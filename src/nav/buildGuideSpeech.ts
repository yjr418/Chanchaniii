import type { NavGuideFlow } from "./navTypes";
import { getPersonalityVoice } from "./personalityVoices";

export type GuideSpeechPayload = {
  text: string;
  voiceName: string;
  speakingRate: number;
  pitch: number;
  /** browser fallback */
  rate: number;
};

const GUIDE1_SPEECH: Record<string, string> = {
  활발한: "앞으로 쭉! 정면으로 약 30걸음 직진하세요!",
  귀여운: "정면으로 약 30걸음 직진하면 돼요!",
  차분한: "정면으로 약 30걸음 천천히 직진해 주세요.",
  침착한: "정면으로 약 30걸음 직진하시면 됩니다.",
  상냥한: "정면으로 약 30걸음 직진해 주세요.",
  여유로운: "정면으로 약 30걸음 여유 있게 직진하세요.",
  조용한: "정면으로 약 30걸음 직진해 주세요.",
  친근한: "정면으로 약 30걸음 직진하시면 돼요.",
  믿음직한: "정면으로 약 30걸음 직진하시면 됩니다.",
  다정한: "정면으로 약 30걸음 직진해 주세요.",
  부드러운: "정면으로 약 30걸음 직진해 주세요.",
  사랑스러운: "정면으로 약 30걸음 직진해 주세요!",
};

const GUIDE2_SPEECH: Record<string, (base: string) => string> = {
  활발한: (base) => `${base}하세요!`,
  귀여운: (base) => `${base}하면 돼요!`,
  차분한: (base) => `${base}해 주세요.`,
  침착한: (base) => `${base}하시면 됩니다.`,
  상냥한: (base) => `${base}해 주세요.`,
  여유로운: (base) => `여유 있게 ${base}하세요.`,
  조용한: (base) => `${base}해 주세요.`,
  친근한: (base) => `${base}하시면 돼요.`,
  믿음직한: (base) => `${base}하시면 됩니다.`,
  다정한: (base) => `${base}해 주세요.`,
  부드러운: (base) => `${base}해 주세요.`,
  사랑스러운: (base) => `${base}하세요!`,
};

function primaryTrait(personalities: string[]) {
  return personalities[0] ?? "친근한";
}

function buildSpeechPayload(
  personalities: string[],
  text: string,
): GuideSpeechPayload {
  const trait = primaryTrait(personalities);
  const voice = getPersonalityVoice(trait);

  return {
    text,
    voiceName: voice.voiceName,
    speakingRate: voice.speakingRate,
    pitch: voice.pitch,
    rate: voice.speakingRate,
  };
}

export function buildGuide1Speech(personalities: string[]): GuideSpeechPayload {
  const trait = primaryTrait(personalities);
  const text =
    GUIDE1_SPEECH[trait] ?? "정면으로 약 30걸음 직진하세요.";
  return buildSpeechPayload(personalities, text);
}

export function buildGuide2Speech(
  personalities: string[],
  flow: NavGuideFlow,
  selectedExit: number | null,
): GuideSpeechPayload {
  const trait = primaryTrait(personalities);
  const base =
    flow === "exit" && selectedExit !== null
      ? `${selectedExit}번 출구로 이동`
      : "왼쪽 열차에 탑승";
  const format =
    GUIDE2_SPEECH[trait] ?? ((instruction: string) => `${instruction}하세요.`);

  return buildSpeechPayload(personalities, format(base));
}

const FINISH_SPEECH_BOARDING: Record<string, string> = {
  활발한: "도착했습니다! 무사히 탑승을 완료하셨네요!",
  귀여운: "도착했어요! 탑승을 잘 마치셨네요!",
  차분한: "도착했습니다. 무사히 탑승을 완료하셨네요.",
  침착한: "도착했습니다. 탑승을 완료하셨습니다.",
  상냥한: "도착했습니다! 무사히 탑승을 완료하셨네요.",
  여유로운: "도착했습니다. 여유 있게 탑승을 마치셨네요.",
  조용한: "도착했습니다. 탑승을 완료하셨네요.",
  친근한: "도착했습니다! 탑승을 잘 마치셨네요!",
  믿음직한: "도착했습니다. 무사히 탑승을 완료하셨습니다.",
  다정한: "도착했습니다! 탑승을 무사히 마치셨네요.",
  부드러운: "도착했습니다. 탑승을 완료하셨네요.",
  사랑스러운: "도착했습니다! 탑승을 완료하셨네요!",
};

const FINISH_SPEECH_EXIT: Record<string, string> = {
  활발한: "도착했습니다! 선택하신 출구에 도착했어요!",
  귀여운: "도착했어요! 선택하신 출구에 무사히 도착했어요!",
  차분한: "도착했습니다. 선택하신 출구에 도착하셨어요.",
  침착한: "도착했습니다. 선택하신 출구에 도착하셨습니다.",
  상냥한: "도착했습니다! 선택하신 출구에 도착하셨어요.",
  여유로운: "도착했습니다. 선택하신 출구에 여유 있게 도착하셨네요.",
  조용한: "도착했습니다. 선택하신 출구에 도착하셨어요.",
  친근한: "도착했습니다! 선택하신 출구에 잘 도착하셨네요!",
  믿음직한: "도착했습니다. 선택하신 출구에 무사히 도착하셨습니다.",
  다정한: "도착했습니다! 선택하신 출구에 도착하셨어요.",
  부드러운: "도착했습니다. 선택하신 출구에 도착하셨어요.",
  사랑스러운: "도착했습니다! 선택하신 출구에 도착했어요!",
};

export function buildFinishSpeech(
  personalities: string[],
  flow: NavGuideFlow,
): GuideSpeechPayload {
  const trait = primaryTrait(personalities);
  const text =
    flow === "exit"
      ? FINISH_SPEECH_EXIT[trait] ??
        "도착했습니다! 선택하신 출구에 도착했어요!"
      : FINISH_SPEECH_BOARDING[trait] ??
        "도착했습니다! 무사히 탑승을 완료하셨네요!";

  return buildSpeechPayload(personalities, text);
}

export function buildVolumePreviewSpeech(
  personalities: string[],
): GuideSpeechPayload {
  return buildSpeechPayload(personalities, "안녕하세요, 찬찬이예요.");
}
