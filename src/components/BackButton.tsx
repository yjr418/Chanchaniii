import { navAssets } from "../nav/navAssets";
import styles from "./BackButton.module.css";

type BackButtonProps = {
  onClick: () => void;
  variant?: "inline" | "overlay";
  className?: string;
};

export function BackButton({
  onClick,
  variant = "inline",
  className,
}: BackButtonProps) {
  const variantClass =
    variant === "overlay" ? styles.backButtonOverlay : styles.backButtonInline;

  return (
    <button
      type="button"
      className={`${styles.backButton} ${variantClass}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-label="뒤로 가기"
    >
      <img
        className={styles.backButtonIcon}
        src={navAssets.backButton}
        alt=""
        width={56}
        height={56}
        draggable={false}
      />
    </button>
  );
}
