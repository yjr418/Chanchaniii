import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef, useState } from "react";
import styles from "./LottiePlayer.module.css";

type LottiePlayerProps = {
  /** public 폴더 기준 URL. 예: /assets/lottie/loading.json */
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  /** 값이 바뀔 때마다 애니메이션을 처음부터 재생 */
  playTrigger?: number;
  className?: string;
  ariaLabel?: string;
  /** false면 컨테이너에 맞게 가로·세로를 늘려 채움 */
  preserveAspectRatio?: boolean;
};

export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  playTrigger,
  className,
  ariaLabel = "",
  preserveAspectRatio = true,
}: LottiePlayerProps) {
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
    setAnimationData(null);
    setError(false);

    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load Lottie: ${src}`);
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
  }, [src]);

  useEffect(() => {
    if (!animationData || reduceMotion || !autoplay) return;
    lottieRef.current?.play();
  }, [animationData, autoplay, reduceMotion]);

  useEffect(() => {
    if (!animationData || reduceMotion || playTrigger === undefined || playTrigger <= 0) {
      return;
    }

    lottieRef.current?.stop();
    lottieRef.current?.goToAndPlay(0, true);
  }, [animationData, playTrigger, reduceMotion]);

  if (error) {
    return null;
  }

  if (!animationData) {
    return <div className={`${styles.placeholder} ${className ?? ""}`} aria-hidden="true" />;
  }

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop && !reduceMotion}
      autoplay={autoplay && !reduceMotion}
      className={className}
      aria-label={ariaLabel}
      rendererSettings={
        preserveAspectRatio ? undefined : { preserveAspectRatio: "none" }
      }
    />
  );
}
