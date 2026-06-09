import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingSplashScreen.module.css";

const SPLASH_LOGO_SRC = "/assets/splash-logo.svg";

export function OnboardingSplashScreen() {
  return (
    <div className={`${shared.screen} ${styles.screen}`} data-name="00_splash">
      <StatusBar />

      <img
        className={styles.logo}
        src={SPLASH_LOGO_SRC}
        alt="찬찬이"
        draggable={false}
      />

      <p className={styles.tagline}>
        <span className={styles.taglineLine}>복잡한 지하철역에서도</span>
        <span className={styles.taglineLine}>길을 쉽게 찾을 수 있도록</span>
      </p>
    </div>
  );
}
