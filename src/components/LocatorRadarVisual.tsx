import { useEffect, useMemo, useRef, useState } from "react";
import { LottiePlayer } from "./LottiePlayer";
import styles from "./LocatorRadarVisual.module.css";

export const FIND_LOTTIE_SRC = "/lottie/find.json";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const MIN_SCAN_RADIUS = 24;
const MAX_SCAN_RADIUS = 132;

function randomScanPosition() {
  const angle = randomBetween(0, 360) * (Math.PI / 180);
  const radius = randomBetween(MIN_SCAN_RADIUS, MAX_SCAN_RADIUS);

  return {
    x: 140 + radius * Math.cos(angle),
    y: 140 + radius * Math.sin(angle),
  };
}

type ScanDotState = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

type ScanDotProps = {
  startDelay: number;
};

function ScanDot({ startDelay }: ScanDotProps) {
  const [dot, setDot] = useState<ScanDotState>(() => ({
    ...randomScanPosition(),
    size: randomBetween(8, 12),
    opacity: 0,
  }));
  const mountedRef = useRef(true);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    mountedRef.current = true;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(() => {
          timeoutsRef.current = timeoutsRef.current.filter(
            (id) => id !== timeoutId,
          );
          resolve();
        }, ms);
        timeoutsRef.current.push(timeoutId);
      });

    const runScanLoop = async () => {
      await sleep(startDelay);

      while (mountedRef.current) {
        const position = randomScanPosition();
        const size = randomBetween(8, 12);

        setDot({
          ...position,
          size,
          opacity: 0,
        });

        await sleep(60);
        if (!mountedRef.current) return;

        setDot((prev) => ({
          ...prev,
          opacity: randomBetween(0.72, 0.95),
        }));

        await sleep(randomBetween(700, 1200));
        if (!mountedRef.current) return;

        setDot((prev) => ({ ...prev, opacity: 0 }));
        await sleep(randomBetween(680, 1050));
        await sleep(randomBetween(520, 1100));
      }
    };

    runScanLoop();

    return () => {
      mountedRef.current = false;
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, [startDelay]);

  return (
    <span
      className={styles.scanDot}
      style={{
        left: `${dot.x}px`,
        top: `${dot.y}px`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        opacity: dot.opacity,
      }}
    />
  );
}

type LocatorRadarVisualProps = {
  className?: string;
};

export function LocatorRadarVisual({ className }: LocatorRadarVisualProps) {
  const scanDots = useMemo(() => {
    const count = Math.random() < 0.5 ? 3 : 4;
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      startDelay: randomBetween(180, 520) + index * randomBetween(420, 680),
    }));
  }, []);

  return (
    <div
      className={`${styles.host} ${className ?? ""}`.trim()}
      aria-hidden="true"
    >
      <LottiePlayer
        src={FIND_LOTTIE_SRC}
        loop
        autoplay
        className={styles.findLottie}
      />
      <div className={styles.scanDotLayer}>
        {scanDots.map((dot) => (
          <ScanDot key={dot.id} startDelay={dot.startDelay} />
        ))}
      </div>
    </div>
  );
}
