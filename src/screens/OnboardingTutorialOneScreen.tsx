import { TutorialGradientGlow } from "../components/TutorialGradientGlow";
import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import tutorialShared from "./onboardingTutorialShared.module.css";

type OnboardingTutorialOneScreenProps = {
  gradientStartTime: number;
  onBack: () => void;
  onNext: () => void;
};

export function OnboardingTutorialOneScreen({
  gradientStartTime,
  onBack,
  onNext,
}: OnboardingTutorialOneScreenProps) {
  return (
    <div
      className={`${shared.screen} ${tutorialShared.screen}`}
      data-name="06_onboarding_tutorial(1)"
    >
      <TutorialGradientGlow startTime={gradientStartTime} />
      <StatusBar />
      <div className={tutorialShared.backButtonWrap}>
        <BackButton onClick={onBack} />
      </div>

      <div className={tutorialShared.content}>
        <h1 className={tutorialShared.title}>
          찬찬이는 지하철에서 길을 쉽게 찾을 수 있도록 도와줘요.
        </h1>
      </div>

      <div className={tutorialShared.footer}>
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
