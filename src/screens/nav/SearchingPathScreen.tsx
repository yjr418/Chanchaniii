import { LocatorRadarVisual } from "../../components/LocatorRadarVisual";
import { StatusBar } from "../../components/StatusBar";
import shared from "../../styles/shared.module.css";
import styles from "./SearchingPathScreen.module.css";

export function SearchingPathScreen() {
  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="13_searching path"
    >
      <div className={styles.bg} aria-hidden="true" />
      <StatusBar />

      <LocatorRadarVisual className={styles.radarHost} />

      <p className={styles.status}>경로 탐색 중...</p>
    </div>
  );
}
