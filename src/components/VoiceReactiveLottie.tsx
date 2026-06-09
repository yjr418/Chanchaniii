import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef, useState } from "react";
import {
  EMPTY_VOICE_WAVE,
  type VoiceWaveSample,
} from "../nav/voiceWave";
import styles from "./VoiceReactiveLottie.module.css";

const VOICE_SOUND_LOTTIE_SRC = "/lottie/sound.json";

type VoiceReactiveLottieProps = {
  waveRef: React.RefObject<VoiceWaveSample>;
  className?: string;
};

export function VoiceReactiveLottie({
  waveRef,
  className,
}: VoiceReactiveLottieProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(VOICE_SOUND_LOTTIE_SRC)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load Lottie: ${VOICE_SOUND_LOTTIE_SRC}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!animationData || reduceMotion) return;
    lottieRef.current?.setSpeed(0.38);
    lottieRef.current?.play();
  }, [animationData, reduceMotion]);

  useEffect(() => {
    if (!animationData || reduceMotion) return;

    let raf = 0;
    let smoothedLevel = 0;
    let smoothedFlex = 0;
    let smoothedTilt = 0;
    let wobblePhase = 0;

    const tick = () => {
      const sample = waveRef.current ?? EMPTY_VOICE_WAVE;
      const { level, flex, tilt } = sample;

      const levelCoeff = level > smoothedLevel ? 0.46 : 0.12;
      const flexCoeff = flex > smoothedFlex ? 0.52 : 0.16;

      smoothedLevel += (level - smoothedLevel) * levelCoeff;
      smoothedFlex += (flex - smoothedFlex) * flexCoeff;
      smoothedTilt += (tilt - smoothedTilt) * 0.28;

      wobblePhase += 0.07 + smoothedFlex * 0.22;

      const scaleX = 1 + smoothedLevel * 0.1 + smoothedFlex * 0.24;
      const scaleY = 1 + smoothedLevel * 0.32 + smoothedFlex * 0.28;
      const rotate =
        smoothedTilt * 7 * smoothedFlex +
        Math.sin(wobblePhase) * smoothedFlex * 5;
      const speed = 0.32 + smoothedLevel * 1.1 + smoothedFlex * 2.8;

      if (innerRef.current) {
        innerRef.current.style.transform =
          `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
      }

      lottieRef.current?.setSpeed(Number(speed.toFixed(2)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animationData, reduceMotion, waveRef]);

  if (error) {
    return null;
  }

  if (!animationData) {
    return (
      <div
        className={`${styles.root} ${className ?? ""}`}
        aria-hidden="true"
      >
        <div className={styles.placeholder} />
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${className ?? ""}`} aria-hidden="true">
      <div ref={innerRef} className={styles.inner}>
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={!reduceMotion}
          autoplay={!reduceMotion}
          className={styles.lottie}
        />
      </div>
    </div>
  );
}
