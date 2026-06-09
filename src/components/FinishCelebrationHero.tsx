import { LottiePlayer } from "./LottiePlayer";
import styles from "./FinishCelebrationHero.module.css";

export const FIREWORK_LOTTIE_SRC = "/lottie/firework.json";

type FinishCelebrationHeroProps = {
  characterSrc: string;
};

export function FinishCelebrationHero({ characterSrc }: FinishCelebrationHeroProps) {
  return (
    <div className={styles.heroWrap}>
      <div className={styles.fireworkLayer} aria-hidden="true">
        <LottiePlayer
          src={FIREWORK_LOTTIE_SRC}
          loop
          autoplay
          className={styles.firework}
        />
      </div>
      <img src={characterSrc} alt="" className={styles.heroImage} />
    </div>
  );
}
