import { useEffect, useRef, useState } from "react";

type UseCameraStreamResult = {
  stream: MediaStream | null;
  error: string | null;
  isStarting: boolean;
};

export function useCameraStream(active: boolean): UseCameraStreamResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!active) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setError(null);
      setIsStarting(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("unsupported");
      return;
    }

    let cancelled = false;
    setIsStarting(true);
    setError(null);

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = mediaStream;
        setStream(mediaStream);
        setIsStarting(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("denied");
        setIsStarting(false);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active]);

  return { stream, error, isStarting };
}
