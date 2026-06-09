import { useMemo } from "react";
import { StatusBar } from "../../components/StatusBar";
import { navAssets } from "../../nav/navAssets";
import shared from "../../styles/shared.module.css";
import styles from "./CurrentLocationScreen.module.css";

const RIPPLE_ORIGIN_X = 189.5;
const RIPPLE_ORIGIN_Y = 219;
const RIPPLE_BASE_RX = 140;
const RIPPLE_BASE_RY = 89;
const RIPPLE_MAX_SCALE = 380 / 280;
const RIPPLE_DURATION_S = 6;
const RIPPLE_REACH_RATIO = 0.498;
const WAVE_PARTICLE_COUNT = 6;
const MIN_PARTICLE_RADIAL_GAP = 0.2;

type WaveParticle = {
  id: number;
  left: number;
  top: number;
  animationDelay: string;
  animationDuration: string;
};

function createWaveParticles(): WaveParticle[] {
  const sectorAngle = (Math.PI * 2) / WAVE_PARTICLE_COUNT;
  const usedRadials: number[] = [];

  return Array.from({ length: WAVE_PARTICLE_COUNT }, (_, id) => {
    const sectorStart = id * sectorAngle;
    const angle =
      sectorStart + sectorAngle * (0.2 + Math.random() * 0.6);

    let radial = 0;
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const candidate = 0.3 + Math.random() * 0.52;
      const tooClose = usedRadials.some(
        (value) => Math.abs(value - candidate) < MIN_PARTICLE_RADIAL_GAP,
      );
      if (!tooClose) {
        radial = candidate;
        break;
      }
    }
    if (radial === 0) {
      radial = 0.3 + (id / WAVE_PARTICLE_COUNT) * 0.52;
    }
    usedRadials.push(radial);

    const x = RIPPLE_BASE_RX * RIPPLE_MAX_SCALE * radial * Math.cos(angle);
    const y = RIPPLE_BASE_RY * RIPPLE_MAX_SCALE * radial * Math.sin(angle);
    const reachDelay =
      radial * RIPPLE_DURATION_S * RIPPLE_REACH_RATIO +
      id * 0.72 +
      Math.random() * 0.18;
    const twinkleDuration = 2.6 + (id % 3) * 0.55 + Math.random() * 0.9;

    return {
      id,
      left: RIPPLE_ORIGIN_X + x,
      top: RIPPLE_ORIGIN_Y + y,
      animationDelay: `${reachDelay.toFixed(3)}s`,
      animationDuration: `${twinkleDuration.toFixed(3)}s`,
    };
  });
}

export function CurrentLocationScreen() {
  const waveParticles = useMemo(() => createWaveParticles(), []);
  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="10_current location"
    >
      <div className={styles.bgEllipse} aria-hidden="true" />
      <StatusBar />

      <div className={styles.statusRow}>
        <div className={styles.pulseWrap}>
          <img src={navAssets.locationPulse} alt="" />
        </div>
        <p className={styles.status}>위치 인식 중...</p>
      </div>

      <h1 className={styles.title}>
        주변 공간을<br />
        인식하고 있어요
      </h1>

      <div className={styles.radar} aria-hidden="true">
        <div className={styles.radarFx}>
          <span className={styles.radarFxBeamGlow} />
          <span className={styles.radarFxBeam} />
          <span className={styles.radarFxCoreFlare} />
          <span className={styles.radarFxCore} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing1}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing2}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing3}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing4}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing5}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing6}`} />
          <span className={`${styles.radarFxRing} ${styles.radarFxRing7}`} />
          {waveParticles.map((particle) => (
            <span
              key={particle.id}
              className={styles.radarFxWaveParticle}
              style={{
                left: `${particle.left}px`,
                top: `${particle.top}px`,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
