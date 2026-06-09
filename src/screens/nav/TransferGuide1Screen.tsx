import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackButton } from "../../components/BackButton";
import {
  GUIDANCE_CARD_EXPANDED_HEIGHT,
  GUIDANCE_CARD_PEEK_HEIGHT,
  GuidanceCard,
} from "../../components/GuidanceCard";
import { StatusBar } from "../../components/StatusBar";
import { useChanchaniSpeech } from "../../hooks/useChanchaniSpeech";
import { buildGuide1Speech } from "../../nav/buildGuideSpeech";
import { TransferGuideScene } from "./TransferGuideScene";
import shared from "../../styles/shared.module.css";
import styles from "./transferGuide.module.css";

const DRAG_EXPAND_THRESHOLD = 0.42;
const NEXT_TRANSITION_MS = 250;

type TransferGuide1ScreenProps = {
  cameraStream: MediaStream | null;
  cameraStarting: boolean;
  selectedPersonalities: string[];
  onBack: () => void;
  onNext: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function TransferGuide1Screen({
  cameraStream,
  cameraStarting,
  selectedPersonalities,
  onBack,
  onNext,
}: TransferGuide1ScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardHeight, setCardHeight] = useState(GUIDANCE_CARD_PEEK_HEIGHT);
  const [nextSelected, setNextSelected] = useState(false);
  const [replayPressed, setReplayPressed] = useState(false);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(
    null,
  );
  const cardHeightRef = useRef(GUIDANCE_CARD_PEEK_HEIGHT);
  const isCardLockedRef = useRef(false);
  const { speak, cancel } = useChanchaniSpeech();
  const guideSpeech = useMemo(
    () => buildGuide1Speech(selectedPersonalities),
    [selectedPersonalities],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => speak(guideSpeech), 400);
    return () => window.clearTimeout(timer);
  }, [guideSpeech, speak]);

  useEffect(() => () => cancel(), [cancel]);

  const lockExpandedCard = useCallback(() => {
    isCardLockedRef.current = true;
    setIsCardLocked(true);
    setIsExpanded(true);
    cardHeightRef.current = GUIDANCE_CARD_EXPANDED_HEIGHT;
    setCardHeight(GUIDANCE_CARD_EXPANDED_HEIGHT);
  }, []);

  const collapse = useCallback(() => {
    isCardLockedRef.current = false;
    setIsCardLocked(false);
    setIsExpanded(false);
    setIsDragging(false);
    cardHeightRef.current = GUIDANCE_CARD_PEEK_HEIGHT;
    setCardHeight(GUIDANCE_CARD_PEEK_HEIGHT);
    setNextSelected(false);
    setReplayPressed(false);
  }, []);

  useEffect(() => () => collapse(), [collapse]);

  const snapCard = useCallback(() => {
    setIsDragging(false);

    if (isCardLockedRef.current) {
      lockExpandedCard();
      return;
    }

    const progress =
      (cardHeightRef.current - GUIDANCE_CARD_PEEK_HEIGHT) /
      (GUIDANCE_CARD_EXPANDED_HEIGHT - GUIDANCE_CARD_PEEK_HEIGHT);

    if (progress >= DRAG_EXPAND_THRESHOLD) {
      lockExpandedCard();
      return;
    }

    setIsExpanded(false);
    cardHeightRef.current = GUIDANCE_CARD_PEEK_HEIGHT;
    setCardHeight(GUIDANCE_CARD_PEEK_HEIGHT);
  }, [lockExpandedCard]);

  const setHeightFromDrag = useCallback(
    (height: number) => {
      if (isCardLockedRef.current) return;

      const nextHeight = clamp(
        height,
        GUIDANCE_CARD_PEEK_HEIGHT,
        GUIDANCE_CARD_EXPANDED_HEIGHT,
      );
      const progress =
        (nextHeight - GUIDANCE_CARD_PEEK_HEIGHT) /
        (GUIDANCE_CARD_EXPANDED_HEIGHT - GUIDANCE_CARD_PEEK_HEIGHT);

      if (progress >= DRAG_EXPAND_THRESHOLD) {
        dragStateRef.current = null;
        setIsDragging(false);
        lockExpandedCard();
        return;
      }

      cardHeightRef.current = nextHeight;
      setCardHeight(nextHeight);
      setIsExpanded(false);
    },
    [lockExpandedCard],
  );

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest("button"));
  };

  const onDragStart = (clientY: number, target: EventTarget | null) => {
    if (isCardLockedRef.current || isInteractiveTarget(target)) return;
    dragStateRef.current = {
      startY: clientY,
      startHeight: cardHeightRef.current,
    };
    setIsDragging(true);
  };

  const onDragMove = (clientY: number) => {
    if (!dragStateRef.current || isCardLockedRef.current) return;
    const deltaY = dragStateRef.current.startY - clientY;
    setHeightFromDrag(dragStateRef.current.startHeight + deltaY);
  };

  const onDragEnd = () => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    snapCard();
  };

  const handleNext = () => {
    if (nextSelected) return;
    setNextSelected(true);
    window.setTimeout(onNext, NEXT_TRANSITION_MS);
  };

  const handleReplay = () => {
    setReplayPressed(true);
    speak(guideSpeech);
    window.setTimeout(() => setReplayPressed(false), 320);
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="14_transfer_guide (1)"
    >
      <TransferGuideScene
        cameraStream={cameraStream}
        cameraStarting={cameraStarting}
        fallbackImage="transferGuide1"
      />

      <StatusBar inverse elevated />

      <BackButton variant="overlay" onClick={onBack} />

      <GuidanceCard
        directionText="정면으로 직진"
        expandedTitle="정면으로 직진하세요"
        expandedMeta="약 30걸음"
        isExpanded={isExpanded || isCardLocked}
        isDragging={isDragging}
        cardHeight={cardHeight}
        replayPressed={replayPressed}
        onNext={handleNext}
        onReplay={handleReplay}
        onTouchStart={(event) =>
          onDragStart(event.touches[0].clientY, event.target)
        }
        onTouchMove={(event) => {
          if (!dragStateRef.current || isCardLockedRef.current) return;
          event.preventDefault();
          onDragMove(event.touches[0].clientY);
        }}
        onTouchEnd={onDragEnd}
        onTouchCancel={onDragEnd}
        onMouseDown={(event) => {
          if (event.button !== 0 || isCardLockedRef.current) return;
          onDragStart(event.clientY, event.target);

          const onMouseMove = (moveEvent: MouseEvent) => {
            onDragMove(moveEvent.clientY);
          };
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            onDragEnd();
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
      />
    </div>
  );
}
