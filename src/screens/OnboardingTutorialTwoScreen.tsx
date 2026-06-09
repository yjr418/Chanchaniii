import { TutorialGradientGlow } from "../components/TutorialGradientGlow";
import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import tutorialShared from "./onboardingTutorialShared.module.css";

type OnboardingTutorialTwoScreenProps = {
  gradientStartTime: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export function OnboardingTutorialTwoScreen({
  gradientStartTime,
  onBack,
  onNext,
  onSkip,
}: OnboardingTutorialTwoScreenProps) {
  return (
    <div
      className={`${shared.screen} ${tutorialShared.screen}`}
      data-name="06_onboarding_tutorial(2)"
    >
      <TutorialGradientGlow startTime={gradientStartTime} />
      <StatusBar />
      <div className={tutorialShared.backButtonWrap}>
        <BackButton onClick={onBack} />
      </div>

      <div className={tutorialShared.content}>
        <h1 className={`${tutorialShared.title} ${tutorialShared.titleStacked}`}>
          <span className={tutorialShared.titleLine}>찬찬이와 함께</span>
          <span className={tutorialShared.titleLine}>길을 찾는 방법을</span>
          <span className={tutorialShared.titleLine}>연습해볼까요?</span>
        </h1>
      </div>

      <div className={tutorialShared.footer}>
        <button
          type="button"
          className={tutorialShared.skipButton}
          onClick={onSkip}
        >
          연습 건너뛰기
        </button>
        <button
          type="button"
          className={`${shared.nextButton} ${shared.nextButtonActive} ${tutorialShared.tutorialNextButton}`}
          onClick={onNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
