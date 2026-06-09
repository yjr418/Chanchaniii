import styles from "./GuidanceCard.module.css";

const DEFAULT_AVATAR = "/assets/chanchani-output.png";
const REPLAY_ICON = "/assets/tutorial-map/replay-icon.svg";

export const GUIDANCE_CARD_PEEK_HEIGHT = 72;
export const GUIDANCE_CARD_EXPANDED_HEIGHT = 218;

export type GuidanceCardProps = {
  avatarSrc?: string;
  directionText: string;
  expandedTitle: string;
  expandedMeta: string;
  isExpanded?: boolean;
  isDragging?: boolean;
  cardHeight?: number;
  expandable?: boolean;
  onNext: () => void;
  onReplay?: () => void;
  replayPressed?: boolean;
  cardClassName?: string;
  wrapClassName?: string;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
  onTouchMove?: React.TouchEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchCancel?: React.TouchEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
};

export function GuidanceCard({
  avatarSrc = DEFAULT_AVATAR,
  directionText,
  expandedTitle,
  expandedMeta,
  isExpanded = false,
  isDragging = false,
  cardHeight,
  expandable = true,
  onNext,
  onReplay,
  replayPressed = false,
  cardClassName,
  wrapClassName,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  onMouseDown,
}: GuidanceCardProps) {
  const showExpanded = expandable && isExpanded;

  const cardClass = [
    styles.card,
    showExpanded ? styles.cardExpanded : "",
    isDragging ? styles.cardDragging : styles.cardAnimating,
    cardClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle =
    isDragging && cardHeight !== undefined
      ? { height: `${cardHeight}px` }
      : undefined;

  return (
    <div
      className={`${styles.cardWrap} ${showExpanded ? styles.cardWrapExpanded : ""}${wrapClassName ? ` ${wrapClassName}` : ""}`}
    >
      <div
        className={cardClass}
        style={cardStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
        onMouseDown={onMouseDown}
      >
        {showExpanded ? (
          <>
            <div className={styles.expandedBody}>
              <div className={styles.expandedMain}>
                <div className={styles.expandedAvatarWrap}>
                  <img
                    src={avatarSrc}
                    alt="찬찬이"
                    className={styles.expandedAvatarImage}
                  />
                </div>
                <div className={styles.expandedContent}>
                  <div className={styles.expandedText}>
                    <p className={styles.expandedTitle}>{expandedTitle}</p>
                    <p className={styles.expandedMeta}>{expandedMeta}</p>
                  </div>
                  {onReplay ? (
                    <button
                      type="button"
                      className={styles.replayButton}
                      aria-pressed={replayPressed}
                      onClick={(event) => {
                        event.stopPropagation();
                        onReplay();
                      }}
                    >
                      <img src={REPLAY_ICON} alt="" className={styles.replayIcon} />
                      다시 듣기
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.expandedNextButton}
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
            >
              다음
            </button>
          </>
        ) : (
          <>
            <div className={styles.cardContent}>
              <div className={styles.avatarWrap}>
                <img
                  src={avatarSrc}
                  alt="찬찬이"
                  className={styles.avatarImage}
                />
              </div>
              <p className={styles.directionText}>{directionText}</p>
            </div>
            <button
              type="button"
              className={styles.nextButton}
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
            >
              다음
            </button>
          </>
        )}
      </div>
    </div>
  );
}
