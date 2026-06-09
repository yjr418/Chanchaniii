import { StatusBar } from "../../components/StatusBar";
import { VoiceReactiveLottie } from "../../components/VoiceReactiveLottie";
import { navAssets } from "../../nav/navAssets";
import shared from "../../styles/shared.module.css";
import styles from "./VoiceWaitingScreen.module.css";

import type { VoiceWaveSample } from "../../nav/voiceWave";

type VoiceWaitingScreenProps = {
  prompt: string;
  voiceWaveRef: React.RefObject<VoiceWaveSample>;
  onTapFallback: () => void;
};

export function VoiceWaitingScreen({
  prompt,
  voiceWaveRef,
  onTapFallback,
}: VoiceWaitingScreenProps) {
  const handleScreenClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }
    onTapFallback();
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="12_voice waiting"
      onClick={handleScreenClick}
      role="presentation"
    >
      <div className={styles.bg} aria-hidden="true" />
      <StatusBar />

      <div className={styles.vui} aria-hidden="true">
        <img className={styles.radar} src={navAssets.voiceWaitingRadar} alt="" />
        <VoiceReactiveLottie
          waveRef={voiceWaveRef}
          className={styles.centerLottie}
        />
      </div>

      <p className={styles.prompt}>{prompt}</p>
    </div>
  );
}
