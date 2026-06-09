import { StatusBar } from "../../components/StatusBar";
import { VoiceReactiveLottie } from "../../components/VoiceReactiveLottie";
import { navAssets } from "../../nav/navAssets";
import shared from "../../styles/shared.module.css";
import styles from "./VoiceSpeakingScreen.module.css";

import type { VoiceWaveSample } from "../../nav/voiceWave";

type VoiceSpeakingScreenProps = {
  text: string;
  isActive: boolean;
  voiceWaveRef: React.RefObject<VoiceWaveSample>;
};

export function VoiceSpeakingScreen({
  text,
  isActive,
  voiceWaveRef,
}: VoiceSpeakingScreenProps) {
  return (
    <div
      className={`${shared.screen} ${styles.screen} ${isActive ? styles.screenActive : ""}`}
      data-name="12_voice speaking"
    >
      <div className={styles.bg} aria-hidden="true" />
      <StatusBar />

      <div className={styles.vui} aria-hidden="true">
        <img className={`${styles.ring} ${styles.ring1}`} src={navAssets.voiceRing} alt="" />
        <img className={`${styles.ring} ${styles.ring2}`} src={navAssets.voiceRing} alt="" />
        <img className={styles.radar} src={navAssets.voiceRadar} alt="" />
        <VoiceReactiveLottie
          waveRef={voiceWaveRef}
          className={styles.centerLottie}
        />
      </div>

      <p
        className={`${styles.text} ${text ? "" : styles.textHidden}`}
        aria-live="polite"
      >
        {text}
      </p>
    </div>
  );
}
