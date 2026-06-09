import { useEffect } from "react";
import { LocatorRadarVisual } from "../components/LocatorRadarVisual";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingTutorialLoadingScreen.module.css";

const TUTORIAL_LOADING_MS = 2800;

type OnboardingTutorialLoadingScreenProps = {
  onComplete: () => void;
};

export function OnboardingTutorialLoadingScreen({
  onComplete,
}: OnboardingTutorialLoadingScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, TUTORIAL_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="07_onboarding_tutorial_loading"
    >
      <div className={styles.orangeGlow} aria-hidden="true" />
      <StatusBar />

      <div className={styles.visualLayer} aria-hidden="true">
        <div className={styles.softBlobLarge} />
        <div className={styles.softBlobMedium} />
        <LocatorRadarVisual className={styles.radarHost} />
      </div>

      <h1 className={styles.title}>
        <span className={styles.titleLine}>곧 연습이</span>
        <span className={styles.titleLine}>시작됩니다.</span>
      </h1>
    </div>
  );
}
