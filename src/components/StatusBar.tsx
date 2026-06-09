import { navAssets } from "../nav/navAssets";
import styles from "./StatusBar.module.css";

type StatusBarProps = {
  /** 어두운·오렌지 배경에서 시계·아이콘을 화이트로 표시 */
  inverse?: boolean;
  /** 씬 위에 올릴 때 z-index 상향 (환승 안내 등) */
  elevated?: boolean;
  className?: string;
};

export function StatusBar({
  inverse = false,
  elevated = false,
  className,
}: StatusBarProps) {
  return (
    <div className={styles.statusBarHost}>
      <header
        className={[
          styles.statusBar,
          inverse ? styles.statusBarInverse : "",
          elevated ? styles.statusBarElevated : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
        data-node-id="80:2615"
      >
        <div className={styles.shell}>
          <div className={styles.status}>
            <div className={styles.timeBlock}>
              <p className={styles.time}>9:30</p>
            </div>
            <div className={styles.iconsBlock}>
              <div className={styles.wifiNetwork}>
                <div className={`${styles.icon} ${styles.iconWifi}`}>
                  <div className={`${styles.iconInset} ${styles.iconInsetWifi}`}>
                    <img src={navAssets.wifi} alt="" />
                  </div>
                </div>
                <div className={styles.icon}>
                  <div className={`${styles.iconInset} ${styles.iconInsetSignal}`}>
                    <img src={navAssets.signal} alt="" />
                  </div>
                </div>
              </div>
              <div className={styles.batteryBlock}>
                <div className={styles.icon}>
                  <div className={`${styles.iconInset} ${styles.iconInsetBattery}`}>
                    <img src={navAssets.battery} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.camera}>
              <span className={styles.cameraDot} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
