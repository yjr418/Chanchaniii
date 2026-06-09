import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import photoShared from "./onboardingPhotoShared.module.css";
import {
  PHOTO_CREATE_TITLE,
  PhotoScreenHeading,
  type PhotoScreenTitle,
} from "./onboardingPhotoTitle";

type OnboardingPhotoPreviewScreenProps = {
  chanchaniName: string;
  photoUrl: string;
  title?: PhotoScreenTitle;
  onBack: () => void;
  onConfirm: () => void;
};

export function OnboardingPhotoPreviewScreen({
  chanchaniName,
  photoUrl,
  title = PHOTO_CREATE_TITLE,
  onBack,
  onConfirm,
}: OnboardingPhotoPreviewScreenProps) {
  return (
    <div className={shared.screen} data-name="03_onboarding_select picture">
      <StatusBar />
      <BackButton onClick={onBack} />

      <PhotoScreenHeading title={title} />

      <div className={photoShared.photoFrame}>
        <img
          src={photoUrl}
          alt={`${chanchaniName} 업로드 사진`}
          className={photoShared.photoImage}
        />
      </div>

      <button
        type="button"
        className={`${shared.nextButton} ${shared.nextButtonActive}`}
        onClick={onConfirm}
      >
        다음
      </button>
    </div>
  );
}
