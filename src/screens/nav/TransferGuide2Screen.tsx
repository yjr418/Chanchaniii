import { useCallback, useEffect, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { GuidanceCard } from "../../components/GuidanceCard";
import { StatusBar } from "../../components/StatusBar";
import { useChanchaniSpeech } from "../../hooks/useChanchaniSpeech";
import { buildGuide2Speech } from "../../nav/buildGuideSpeech";
import { getGuide2Copy } from "../../nav/navGuideCopy";
import type { NavGuideFlow } from "../../nav/navTypes";
import { TransferGuideScene } from "./TransferGuideScene";
import shared from "../../styles/shared.module.css";
import styles from "./transferGuide.module.css";

const NEXT_TRANSITION_MS = 250;

type TransferGuide2ScreenProps = {
  cameraStream: MediaStream | null;
  cameraStarting: boolean;
  guideFlow: NavGuideFlow;
  selectedExit: number | null;
  selectedPersonalities: string[];
  onBack: () => void;
  onNext: () => void;
};

export function TransferGuide2Screen({
  cameraStream,
  cameraStarting,
  guideFlow,
  selectedExit,
  selectedPersonalities,
  onBack,
  onNext,
}: TransferGuide2ScreenProps) {
  const [nextSelected, setNextSelected] = useState(false);
  const guide2Copy = getGuide2Copy(guideFlow, selectedExit);
  const { speak, cancel } = useChanchaniSpeech();
  const guideSpeech = buildGuide2Speech(
    selectedPersonalities,
    guideFlow,
    selectedExit,
  );

  const playGuideSpeech = useCallback(() => {
    speak(guideSpeech);
  }, [guideSpeech, speak]);

  useEffect(() => {
    const timer = window.setTimeout(playGuideSpeech, 400);
    return () => {
      window.clearTimeout(timer);
      cancel();
    };
  }, [cancel, playGuideSpeech]);

  const handleNext = () => {
    if (nextSelected) return;
    setNextSelected(true);
    window.setTimeout(onNext, NEXT_TRANSITION_MS);
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="14_transfer_guide (2)"
    >
      <TransferGuideScene
        cameraStream={cameraStream}
        cameraStarting={cameraStarting}
        fallbackImage="transferGuide2"
      />

      <StatusBar inverse elevated />

      <BackButton variant="overlay" onClick={onBack} />

      <GuidanceCard
        directionText={guide2Copy.directionText}
        expandedTitle={guide2Copy.expandedTitle}
        expandedMeta={guide2Copy.expandedMeta}
        expandable={false}
        onNext={handleNext}
      />
    </div>
  );
}
