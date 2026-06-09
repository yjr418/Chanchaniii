import { useEffect, useState } from "react";
import { OnboardingNameScreen } from "./OnboardingNameScreen";
import { OnboardingSplashScreen } from "./OnboardingSplashScreen";
import styles from "./OnboardingEntryFlow.module.css";

const SPLASH_HOLD_MS = 3000;
const CROSSFADE_MS = 700;

type OnboardingEntryFlowProps = {
  initialName?: string;
  onNext: (name: string) => void;
};

export function OnboardingEntryFlow({
  initialName = "",
  onNext,
}: OnboardingEntryFlowProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [showName, setShowName] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const startFadeTimer = window.setTimeout(() => {
      setShowName(true);
      requestAnimationFrame(() => {
        setFadeOut(true);
        setFadeIn(true);
      });
    }, SPLASH_HOLD_MS);

    const hideSplashTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_HOLD_MS + CROSSFADE_MS);

    return () => {
      window.clearTimeout(startFadeTimer);
      window.clearTimeout(hideSplashTimer);
    };
  }, []);

  return (
    <div className={styles.stack}>
      {showSplash ? (
        <div
          className={`${styles.splashLayer} ${fadeOut ? styles.splashLayerOut : ""}`}
        >
          <OnboardingSplashScreen />
        </div>
      ) : null}

      {showName ? (
        <div
          className={`${styles.nameLayer} ${fadeIn ? styles.nameLayerIn : ""}`}
        >
          <OnboardingNameScreen initialName={initialName} onNext={onNext} />
        </div>
      ) : null}
    </div>
  );
}
