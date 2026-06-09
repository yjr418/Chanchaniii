import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingGeneratingScreen.module.css";

export function OnboardingGeneratingScreen() {
  return (
    <div className={shared.screen} data-name="generating_chanchani">
      <StatusBar />

      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.message}>찬찬이를 만들고 있어요...</p>
      </div>
    </div>
  );
}
