import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import photoShared from "./onboardingPhotoShared.module.css";

const CHANCHANI_OUTPUT_IMAGE = "/assets/chanchani-output.png";

type OnboardingChanchaniFinishScreenProps = {
  chanchaniName: string;
  onBack: () => void;
  onNext: () => void;
};

export function OnboardingChanchaniFinishScreen({
  chanchaniName,
  onBack,
  onNext,
}: OnboardingChanchaniFinishScreenProps) {
  return (
    <div className={shared.screen} data-name="04_onboarding_chanchani finish">
      <StatusBar />
      <BackButton onClick={onBack} />

      <h1 className={photoShared.title}>
        <span>{chanchaniName}님의 찬찬이가</span>
        <span>완성되었어요!</span>
      </h1>

      <div className={`${photoShared.photoFrame} ${photoShared.outputFrame}`}>
        <img
          src={CHANCHANI_OUTPUT_IMAGE}
          alt={`${chanchaniName}님의 찬찬이`}
          className={`${photoShared.photoImage} ${photoShared.outputImage}`}
        />
      </div>

      <button
        type="button"
        className={`${shared.nextButton} ${shared.nextButtonActive}`}
        onClick={onNext}
      >
        다음
      </button>
    </div>
  );
}
