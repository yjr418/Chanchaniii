import { useState } from "react";
import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingNameScreen.module.css";

const TAKEN_NAMES = new Set(["눈송"]);

function isNameTaken(name: string) {
  return TAKEN_NAMES.has(name.trim());
}

type OnboardingNameScreenProps = {
  initialName?: string;
  submitLabel?: string;
  onBack?: () => void;
  onNext: (name: string) => void;
};

export function OnboardingNameScreen({
  initialName = "",
  submitLabel = "다음",
  onBack,
  onNext,
}: OnboardingNameScreenProps) {
  const [name, setName] = useState(initialName);
  const trimmedName = name.trim();
  const hasError = trimmedName.length > 0 && isNameTaken(trimmedName);
  const canProceed = trimmedName.length > 0 && !hasError;

  return (
    <div className={shared.screen} data-name="01_onboarding_name">
      <StatusBar />
      {onBack ? <BackButton variant="overlay" onClick={onBack} /> : null}

      <h1 className={styles.title}>이름을 입력해주세요</h1>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={`${styles.input} ${hasError ? styles.inputError : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="클릭하여 입력하기"
          aria-label="이름"
          aria-invalid={hasError}
          aria-describedby={hasError ? "name-error" : undefined}
        />
        {hasError && (
          <p id="name-error" className={styles.errorMessage} role="alert">
            사용할 수 없는 이름이에요
          </p>
        )}
      </div>

      <button
        type="button"
        className={`${shared.nextButton} ${canProceed ? shared.nextButtonActive : ""}`}
        disabled={!canProceed}
        onClick={() => onNext(trimmedName)}
      >
        {submitLabel}
      </button>
    </div>
  );
}
