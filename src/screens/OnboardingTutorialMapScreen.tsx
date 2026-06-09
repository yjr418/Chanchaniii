import { useEffect, useRef, useState } from "react";
import { CoachPointingHand } from "../components/CoachPointingHand";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingTutorialMapScreen.module.css";

const MAP_BG_LEFT = "/assets/tutorial-map/map-bg-left.png";
const MAP_BG_RIGHT = "/assets/tutorial-map/map-bg-right.png";
const CHANCHANI_AVATAR = "/assets/chanchani-output.png";
const REPLAY_ICON = "/assets/tutorial-map/replay-icon.svg";

const INTRO_MS = 1500;
const OVERLAY_FADE_MS = 1000;
const HOLD_MS = 2000;
const SWIPE_UP_THRESHOLD_PX = 40;

type Phase = "intro" | "fading" | "hold" | "coachmark" | "swipeCoachmark";

type OnboardingTutorialMapScreenProps = {
  onNext: () => void;
  onSkip: () => void;
};

export function OnboardingTutorialMapScreen({
  onNext,
  onSkip,
}: OnboardingTutorialMapScreenProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const swipeStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setPhase("fading"), INTRO_MS);
    const holdTimer = window.setTimeout(
      () => setPhase("hold"),
      INTRO_MS + OVERLAY_FADE_MS,
    );
    const coachTimer = window.setTimeout(
      () => setPhase("coachmark"),
      INTRO_MS + OVERLAY_FADE_MS + HOLD_MS,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(coachTimer);
    };
  }, []);

  const isDarkUi =
    isCardExpanded ||
    phase === "intro" ||
    phase === "fading" ||
    phase === "coachmark" ||
    phase === "swipeCoachmark";
  const showInstruction = phase === "intro" || phase === "fading";
  const showCoachmark = phase === "coachmark";
  const showSwipeCoachmark = phase === "swipeCoachmark" && !isCardExpanded;
  const canSwipeToExpand = phase === "swipeCoachmark" && !isCardExpanded;

  const handleNext = () => {
    if (phase === "coachmark") {
      setPhase("swipeCoachmark");
      return;
    }
    onNext();
  };

  const expandCard = () => {
    setIsCardExpanded(true);
  };

  const handleCardPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSwipeToExpand) return;
    swipeStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCardPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSwipeToExpand || swipeStartYRef.current === null) return;

    const deltaY = swipeStartYRef.current - event.clientY;
    swipeStartYRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (deltaY >= SWIPE_UP_THRESHOLD_PX) {
      expandCard();
    }
  };

  const handleCardPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    swipeStartYRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="08_onboarding_tutorial map(1)"
    >
      <div className={styles.mapLayer} aria-hidden="true">
        <img src={MAP_BG_LEFT} alt="" className={styles.mapBgLeft} />
        <img src={MAP_BG_RIGHT} alt="" className={styles.mapBgRight} />
      </div>

      <div
        className={`${styles.overlay} ${phase !== "intro" ? styles.overlayFadeOut : ""}`}
        aria-hidden="true"
      />

      <StatusBar inverse={isDarkUi} />

      <div
        className={styles.topMetaBar}
      >
        <button
          type="button"
          className={`${styles.skipButton} ${isDarkUi ? styles.skipButtonOnDark : styles.skipButtonOnLight}`}
          onClick={onSkip}
        >
          연습 건너뛰기
        </button>
      </div>

      {showInstruction && (
        <div
          className={`${styles.instructionBlock} ${phase === "fading" ? styles.instructionBlockFadeOut : ""}`}
        >
          <span
            className={`${styles.stepBadge} ${isDarkUi ? styles.stepBadgeOnDark : styles.stepBadgeOnLight}`}
          >
            튜토리얼 1 / 3
          </span>
          <h1 className={styles.instruction}>
            <span>찬찬이의 안내에 따라</span>
            <span>앞으로 이동하세요.</span>
          </h1>
        </div>
      )}

      {showCoachmark && (
        <div className={`${styles.instructionBlock} ${styles.instructionBlockFront}`}>
          <span className={`${styles.stepBadge} ${styles.stepBadgeOnDark}`}>
            튜토리얼 2 / 3
          </span>
          <h1
            className={`${styles.instruction} ${styles.coachInstructionText}`}
            aria-live="polite"
          >
            <span>아래의 다음 버튼을</span>
            <span>눌러보세요.</span>
          </h1>
        </div>
      )}

      {showSwipeCoachmark && (
        <div className={`${styles.instructionBlock} ${styles.instructionBlockFront}`}>
          <span className={`${styles.stepBadge} ${styles.stepBadgeOnDark}`}>
            튜토리얼 3 / 3
          </span>
          <h1
            className={`${styles.instruction} ${styles.coachInstructionText}`}
            aria-live="polite"
          >
            <span className={styles.instructionLine}>더 자세한 설명이</span>
            <span className={styles.instructionLine}>필요하면 카드를</span>
            <span className={styles.instructionLine}>위로 늘려보세요.</span>
          </h1>
        </div>
      )}

      <div
        className={`${styles.guidanceCardWrap} ${isCardExpanded ? styles.guidanceCardWrapExpanded : ""} ${canSwipeToExpand ? styles.guidanceCardWrapSwipeable : ""}`}
        onPointerDown={handleCardPointerDown}
        onPointerUp={handleCardPointerUp}
        onPointerCancel={handleCardPointerCancel}
      >
        <div
          className={`${styles.guidanceCard} ${isCardExpanded ? styles.guidanceCardExpanded : ""} ${showCoachmark || showSwipeCoachmark ? styles.guidanceCardCoach : ""}`}
        >
          {isCardExpanded ? (
            <>
              <div className={styles.expandedBody}>
                <div className={styles.expandedMain}>
                  <div className={styles.expandedAvatarWrap}>
                    <img
                      src={CHANCHANI_AVATAR}
                      alt="찬찬이"
                      className={styles.expandedAvatarImage}
                    />
                  </div>
                  <div className={styles.expandedContent}>
                    <div className={styles.expandedText}>
                      <p className={styles.expandedTitle}>정면으로 직진하세요</p>
                      <p className={styles.expandedMeta}>약 30걸음</p>
                    </div>
                    <button type="button" className={styles.replayButton}>
                      <img src={REPLAY_ICON} alt="" className={styles.replayIcon} />
                      다시 듣기
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.expandedNextButton}
                onClick={onNext}
              >
                다음
              </button>
            </>
          ) : (
            <>
              <div className={styles.cardContent}>
                <div className={styles.avatarWrap}>
                  <img
                    src={CHANCHANI_AVATAR}
                    alt="찬찬이"
                    className={styles.avatarImage}
                  />
                </div>
                <p className={styles.directionText}>정면으로 직진</p>
              </div>
              {!showSwipeCoachmark && (
                <button
                  type="button"
                  className={`${styles.cardNextButton} ${showCoachmark ? styles.cardNextButtonCoach : ""}`}
                  onClick={handleNext}
                >
                  다음
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isCardExpanded && (
        <div className={styles.coachmarkLayer} aria-hidden="true">
          <div className={styles.coachmarkSpotlightExpandedCard} aria-hidden="true" />
        </div>
      )}

      {showCoachmark && (
        <div className={styles.coachmarkLayer} aria-hidden="false">
          <div className={styles.coachmarkSpotlight} aria-hidden="true" />
          <div className={styles.coachFingerWrap} aria-hidden="true">
            <CoachPointingHand className={styles.coachFingerIcon} />
          </div>
          <span className={styles.nextButtonHighlight} aria-hidden="true" />
          <span className={styles.nextButtonHighlightOuter} aria-hidden="true" />
        </div>
      )}

      {showSwipeCoachmark && (
        <div className={styles.coachmarkLayer} aria-hidden="false">
          <div className={styles.coachmarkSpotlightCard} aria-hidden="true" />
          <span className={styles.cardTopHighlightWrap} aria-hidden="true">
            <span className={styles.cardTopHighlight} />
          </span>
          <div className={styles.swipeHint} aria-hidden="true">
            <span className={styles.swipeArrowUp} />
          </div>
        </div>
      )}
    </div>
  );
}
