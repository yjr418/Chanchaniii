import { useState } from "react";
import { StatusBar } from "../../components/StatusBar";
import { navAssets } from "../../nav/navAssets";
import shared from "../../styles/shared.module.css";
import styles from "./CheckLocationScreen.module.css";

type CheckLocationScreenProps = {
  onConfirm: () => void;
  onRevise: () => void;
};

export function CheckLocationScreen({
  onConfirm,
  onRevise,
}: CheckLocationScreenProps) {
  const [confirmSelected, setConfirmSelected] = useState(false);

  const handleConfirm = () => {
    setConfirmSelected(true);
    onConfirm();
  };

  const handleRevise = () => {
    setConfirmSelected(false);
    onRevise();
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="11_check location"
    >
      <div className={styles.bgEllipse} aria-hidden="true" />
      <StatusBar />

      <div className={styles.stationRow}>
        <span className={styles.pin} aria-hidden="true">
          <img src={navAssets.locationIcon} alt="" />
        </span>
        <p className={styles.label}>현재 위치</p>
      </div>

      <h1 className={styles.stationName}>강남역 2호선</h1>
      <p className={styles.stationDetail}>내선순환 · 3-2</p>

      <div className={styles.photo} aria-hidden="true">
        <img src={navAssets.locationPhoto} alt="" />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.revise} onClick={handleRevise}>
          위치 수정하기
        </button>
        <button
          type="button"
          className={`${styles.confirm} ${confirmSelected ? styles.confirmSelected : ""}`}
          aria-pressed={confirmSelected}
          onClick={handleConfirm}
        >
          맞아요
        </button>
      </div>
    </div>
  );
}
