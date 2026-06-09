import { NavSettingsFab } from "../../components/nav/NavSettingsFab";
import { StatusBar } from "../../components/StatusBar";
import type { AfterCheckFlow } from "../../nav/navTypes";
import { navAssets } from "../../nav/navAssets";
import shared from "../../styles/shared.module.css";
import styles from "./HomeScreen.module.css";

type HomeScreenProps = {
  chanchaniName: string;
  onOpenSettings: () => void;
  onGoCurrentLocation: (afterCheck: AfterCheckFlow) => void;
  onGoSelectExit: () => void;
};

export function HomeScreen({
  chanchaniName,
  onOpenSettings,
  onGoCurrentLocation,
  onGoSelectExit,
}: HomeScreenProps) {
  const displayName = chanchaniName.trim() || "눈송";

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="09_home"
    >
      <div className={styles.bgEllipse} aria-hidden="true" />
      <StatusBar />

      <NavSettingsFab onClick={onOpenSettings} />

      <h1 className={styles.greeting}>
        {displayName}님,<br />
        어디로 가시나요?
      </h1>

      <div className={styles.cards}>
        <button
          type="button"
          className={`${styles.card} ${styles.cardTransfer}`}
          onClick={() => onGoCurrentLocation("voice-waiting")}
          aria-label="환승하러 가기"
        >
          <span className={styles.cardLabel}>환승하러 가기</span>
          <span className={styles.cardArt}>
            <img src={navAssets.train} alt="" />
          </span>
        </button>

        <button
          type="button"
          className={`${styles.card} ${styles.cardExit}`}
          onClick={onGoSelectExit}
          aria-label="출구 찾기"
        >
          <span className={styles.cardLabel}>출구 찾기</span>
          <span className={styles.cardArt}>
            <img src={navAssets.exit} alt="" />
          </span>
        </button>

        <button
          type="button"
          className={`${styles.card} ${styles.cardElevator}`}
          aria-label="엘리베이터 찾기"
        >
          <span className={styles.cardLabel}>엘리베이터 찾기</span>
          <span className={styles.cardArt}>
            <img src={navAssets.elevator} alt="" />
          </span>
        </button>

        <button
          type="button"
          className={`${styles.card} ${styles.cardRestroom}`}
          aria-label="화장실 찾기"
        >
          <span className={styles.cardLabel}>화장실 찾기</span>
          <span className={styles.cardArt}>
            <img src={navAssets.restroom} alt="" />
          </span>
        </button>
      </div>
    </div>
  );
}
