import { useRef } from "react";
import { BackButton } from "../components/BackButton";
import { StatusBar } from "../components/StatusBar";
import shared from "../styles/shared.module.css";
import styles from "./OnboardingPhotoScreen.module.css";
import {
  PHOTO_CREATE_TITLE,
  PhotoScreenHeading,
  type PhotoScreenTitle,
} from "./onboardingPhotoTitle";

type OnboardingPhotoScreenProps = {
  title?: PhotoScreenTitle;
  onBack: () => void;
  onPhotoSelected: (photoUrl: string) => void;
};

export function OnboardingPhotoScreen({
  title = PHOTO_CREATE_TITLE,
  onBack,
  onPhotoSelected,
}: OnboardingPhotoScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onPhotoSelected(URL.createObjectURL(file));
    event.target.value = "";
  }

  return (
    <div className={shared.screen} data-name="02_onboarding_making chanchani">
      <StatusBar />
      <BackButton onClick={onBack} />

      <PhotoScreenHeading title={title} />

      <button
        type="button"
        className={styles.uploadArea}
        onClick={handleUploadClick}
        aria-label="사진 업로드하기"
      >
        <UploadIcon />
        <span className={styles.uploadLabel}>사진 업로드하기</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      <button type="button" className={shared.nextButton} disabled>
        다음
      </button>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path
        d="M40 14.67V45.33M40 14.67L28 26.67M40 14.67L52 26.67M18.67 45.33H14.67C12.53 45.33 10.8 47.07 10.8 49.2V61.33C10.8 63.47 12.53 65.2 14.67 65.2H65.33C67.47 65.2 69.2 63.47 69.2 61.33V49.2C69.2 47.07 67.47 45.33 65.33 45.33H61.33"
        stroke="#525252"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
