import { useEffect, useRef } from "react";

type CameraBackgroundProps = {
  stream: MediaStream;
  className?: string;
};

export function CameraBackground({ stream, className }: CameraBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    void video.play().catch(() => {});

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      playsInline
      muted
      aria-hidden="true"
    />
  );
}
