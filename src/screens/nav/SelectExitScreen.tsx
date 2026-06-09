import { useEffect, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { StatusBar } from "../../components/StatusBar";
import shared from "../../styles/shared.module.css";
import styles from "./SelectExitScreen.module.css";

const START_TRANSITION_MS = 250;
const EXITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type SelectExitScreenProps = {
  onBack: () => void;
  onStart: (exit: number) => void;
};

export function SelectExitScreen({
  onBack,
  onStart,
}: SelectExitScreenProps) {
  const [selectedExit, setSelectedExit] = useState<number | null>(null);
  const [startSelected, setStartSelected] = useState(false);

  useEffect(() => {
    return () => {
      setSelectedExit(null);
      setStartSelected(false);
    };
  }, []);

  const hasSelection = selectedExit !== null;

  const handleExitClick = (exit: number) => {
    setSelectedExit((prev) => (prev === exit ? null : exit));
    setStartSelected(false);
  };

  const handleStart = () => {
    if (!hasSelection || selectedExit === null || startSelected) return;
    setStartSelected(true);
    window.setTimeout(() => onStart(selectedExit), START_TRANSITION_MS);
  };

  return (
    <div
      className={`${shared.screen} ${styles.screen}`}
      data-name="17_select_exit"
    >
      <StatusBar />

      <BackButton variant="overlay" onClick={onBack} />

      <div className={styles.body}>
        <h1 className={styles.title}>출구를 선택해 주세요</h1>

        <div
          className={`${styles.grid} ${hasSelection ? styles.gridHasSelection : ""}`}
          role="group"
          aria-label="출구 선택"
        >
          {EXITS.map((exit) => (
            <button
              key={exit}
              type="button"
              className={`${styles.exit} ${selectedExit === exit ? styles.exitSelected : ""}`}
              aria-pressed={selectedExit === exit}
              aria-label={`${exit}번 출구`}
              onClick={() => handleExitClick(exit)}
            >
              {exit}번
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.start} ${startSelected ? styles.startSelected : ""}`}
        aria-pressed={startSelected}
        disabled={!hasSelection}
        onClick={handleStart}
      >
        안내 시작하기
      </button>
    </div>
  );
}
