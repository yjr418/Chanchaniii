import { useEffect, useMemo } from "react";
import { FinishCelebrationHero } from "../../components/FinishCelebrationHero";
import { StatusBar } from "../../components/StatusBar";
import { useChanchaniSpeech } from "../../hooks/useChanchaniSpeech";
import { buildFinishSpeech } from "../../nav/buildGuideSpeech";
import { getFinishCopy } from "../../nav/navGuideCopy";
import { navAssets } from "../../nav/navAssets";
import type { NavGuideFlow } from "../../nav/navTypes";
import shared from "../../styles/shared.module.css";
import tutorialShared from "../onboardingTutorialShared.module.css";
import styles from "./TransferGuideFinishScreen.module.css";

type TransferGuideFinishScreenProps = {
  guideFlow: NavGuideFlow;
  selectedPersonalities: string[];
  onHome: () => void;
};

export function TransferGuideFinishScreen({
  guideFlow,
  selectedPersonalities,
  onHome,
}: TransferGuideFinishScreenProps) {
  const finishCopy = getFinishCopy(guideFlow);
  const { speak, cancel } = useChanchaniSpeech();
  const finishSpeech = useMemo(
    () => buildFinishSpeech(selectedPersonalities, guideFlow),
    [guideFlow, selectedPersonalities],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => speak(finishSpeech), 400);
    return () => window.clearTimeout(timer);
  }, [finishSpeech, speak]);

  useEffect(() => () => cancel(), [cancel]);

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="15_transfer_guide_finish"
    >
      <StatusBar inverse />

      <main className={styles.main}>
        <FinishCelebrationHero
          characterSrc={navAssets.transferGuideFinishCharacter}
        />
        <h1 className={styles.headline}>{finishCopy.headline}</h1>
        <p className={styles.subheadline}>{finishCopy.subheadline}</p>
      </main>

      <div className={tutorialShared.footer}>
        <button
          type="button"
          className={`${shared.nextButton} ${shared.nextButtonActive} ${tutorialShared.tutorialNextButton}`}
          onClick={onHome}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
