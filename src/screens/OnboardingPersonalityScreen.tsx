import { useState } from "react";
import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingPersonalityScreen.module.css";

const PERSONALITY_ROWS = [
  ["활발한", "귀여운", "차분한"],
  ["침착한", "상냥한", "여유로운"],
  ["조용한", "친근한", "믿음직한"],
  ["다정한", "부드러운", "사랑스러운"],
] as const;

const MAX_SELECTIONS = 3;

function getChipSizeClass(label: string) {
  if (label === "다정한" || label === "부드러운") return styles.chipCompact;
  if (label === "사랑스러운") return styles.chipWide;
  if (label.length >= 4) return styles.chipMedium;
  return "";
}

type OnboardingPersonalityScreenProps = {
  initialSelected?: string[];
  submitLabel?: string;
  onBack: () => void;
  onNext: (personalities: string[]) => void;
};

export function OnboardingPersonalityScreen({
  initialSelected = [],
  submitLabel = "다음",
  onBack,
  onNext,
}: OnboardingPersonalityScreenProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const canProceed = selected.length > 0;

  function togglePersonality(personality: string) {
    setSelected((current) => {
      if (current.includes(personality)) {
        return current.filter((item) => item !== personality);
      }
      if (current.length >= MAX_SELECTIONS) return current;
      return [...current, personality];
    });
  }

  return (
    <div className={shared.screen} data-name="5_onboarding_character">
      <StatusBar />
      <BackButton onClick={onBack} />

      <h1 className={styles.title}>찬찬이 성격 고르기</h1>
      <p className={styles.subtitle}>최대 3개까지 선택해 주세요</p>

      <div className={styles.chipGrid} role="group" aria-label="찬찬이 성격">
        {PERSONALITY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.chipRow}>
            {row.map((personality) => {
              const isSelected = selected.includes(personality);
              const isDisabled =
                !isSelected && selected.length >= MAX_SELECTIONS;

              return (
                <button
                  key={personality}
                  type="button"
                  className={`${styles.chip} ${getChipSizeClass(personality)} ${isSelected ? styles.chipSelected : ""}`}
                  onClick={() => togglePersonality(personality)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                >
                  {personality}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`${shared.nextButton} ${canProceed ? shared.nextButtonActive : ""}`}
        disabled={!canProceed}
        onClick={() => onNext(selected)}
      >
        {submitLabel}
      </button>
    </div>
  );
}
