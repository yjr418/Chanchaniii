import type { NavGuideFlow } from "./navTypes";

export function getGuide2Copy(flow: NavGuideFlow, selectedExit: number | null) {
  if (flow === "exit" && selectedExit !== null) {
    return {
      directionText: `${selectedExit}번 출구로 이동`,
      expandedTitle: `${selectedExit}번 출구로 이동하세요`,
      expandedMeta: "",
    };
  }

  return {
    directionText: "왼쪽 열차 탑승",
    expandedTitle: "왼쪽 열차 탑승",
    expandedMeta: "",
  };
}

export function getFinishCopy(flow: NavGuideFlow) {
  if (flow === "exit") {
    return {
      headline: "도착했습니다!",
      subheadline: "선택하신 출구에 도착했어요!",
    };
  }

  return {
    headline: "도착했습니다!",
    subheadline: "무사히 탑승을 완료하셨네요!",
  };
}
