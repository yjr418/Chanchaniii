import { FinishCelebrationHero } from "../components/FinishCelebrationHero";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import tutorialShared from "./onboardingTutorialShared.module.css";
import styles from "./OnboardingTutorialMapFinishScreen.module.css";

const PRACTICE_COMPLETE_CHARACTER =
  "/assets/tutorial-map/practice-complete-character.png";

type OnboardingTutorialMapFinishScreenProps = {
  onPracticeAgain: () => void;
  onStart: () => void;
};

export function OnboardingTutorialMapFinishScreen({
  onPracticeAgain,
  onStart,
}: OnboardingTutorialMapFinishScreenProps) {
  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="09_onboarding_tutorial map_finish"
    >
      <StatusBar inverse />

      <main className={styles.main}>
        <FinishCelebrationHero characterSrc={PRACTICE_COMPLETE_CHARACTER} />
        <h1 className={styles.headline}>연습을 완료했어요!</h1>
      </main>

      <div className={tutorialShared.footer}>
        <button
          type="button"
          className={tutorialShared.skipButton}
          onClick={onPracticeAgain}
        >
          다시 연습하기
        </button>
        <button
          type="button"
          className={`${shared.nextButton} ${shared.nextButtonActive} ${tutorialShared.tutorialNextButton}`}
          onClick={onStart}
        >
          찬찬이 시작하기
        </button>
      </div>
    </div>
  );
}
