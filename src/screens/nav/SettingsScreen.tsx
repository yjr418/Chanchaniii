import { useCallback, useEffect, useMemo, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { StatusBar } from "../../components/StatusBar";
import { useChanchaniSpeech } from "../../hooks/useChanchaniSpeech";
import { buildVolumePreviewSpeech } from "../../nav/buildGuideSpeech";
import { navAssets } from "../../nav/navAssets";
import { isSpeechAudioPlaying } from "../../speechPlayback";
import shared from "../../styles/shared.module.css";
import {
  applyTextScale,
  loadTextScaleSetting,
  saveTextScaleSetting,
} from "../../textScale";
import {
  loadVoiceVolumeSetting,
  setVoiceVolumeFromRange,
} from "../../voiceVolume";
import styles from "./SettingsScreen.module.css";

type SettingsScreenProps = {
  selectedPersonalities: string[];
  onBack: () => void;
  onChangePersonality: () => void;
  onChangeName: () => void;
  onChangeAvatar: () => void;
};

export function SettingsScreen({
  selectedPersonalities,
  onBack,
  onChangePersonality,
  onChangeName,
  onChangeAvatar,
}: SettingsScreenProps) {
  const [textSize, setTextSize] = useState(loadTextScaleSetting);
  const [volume, setVolume] = useState(loadVoiceVolumeSetting);
  const { speak, cancel } = useChanchaniSpeech();
  const previewSpeech = useMemo(
    () => buildVolumePreviewSpeech(selectedPersonalities),
    [selectedPersonalities],
  );

  useEffect(() => {
    applyTextScale(textSize);
    saveTextScaleSetting(textSize);
  }, [textSize]);

  useEffect(() => () => cancel(), [cancel]);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
    setVoiceVolumeFromRange(value);
  }, []);

  const startVolumePreview = useCallback(() => {
    if (isSpeechAudioPlaying()) return;
    speak(previewSpeech);
  }, [previewSpeech, speak]);

  const flashPress = (event: React.MouseEvent<HTMLButtonElement>) => {
    const el = event.currentTarget;
    el.setAttribute("aria-pressed", "true");
    window.setTimeout(() => {
      el.removeAttribute("aria-pressed");
    }, 180);
  };

  return (
    <div className={`${shared.screen} ${styles.screen}`} data-name="18_settings">
      <StatusBar />

      <BackButton className={styles.backFab} variant="overlay" onClick={onBack} />

      <div className={styles.topbar}>
        <h1 className={styles.title}>설정</h1>
      </div>

      <div className={styles.scroll}>
        <div className={styles.profile}>
          <div className={styles.avatarWrap}>
            <img
              className={styles.avatar}
              src={navAssets.setupAvatar}
              alt="찬찬이 프로필"
            />
            <button
              type="button"
              className={styles.avatarEdit}
              aria-label="프로필 수정"
              onClick={flashPress}
            >
              <img src={navAssets.setupPencil} alt="" />
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <button
            type="button"
            className={styles.row}
            onClick={(event) => {
              flashPress(event);
              onChangeAvatar();
            }}
          >
            <span className={styles.iconBox}>
              <img src={navAssets.setupChangeAvatar} alt="" />
            </span>
            <span className={styles.label}>찬찬이 바꾸기</span>
            <span className={styles.arrow} aria-hidden="true">
              <img src={navAssets.setupArrow} alt="" />
            </span>
          </button>
          <button
            type="button"
            className={styles.row}
            onClick={(event) => {
              flashPress(event);
              onChangePersonality();
            }}
          >
            <span className={styles.iconBox}>
              <img src={navAssets.setupChangePersonality} alt="" />
            </span>
            <span className={styles.label}>찬찬이 성격 바꾸기</span>
            <span className={styles.arrow} aria-hidden="true">
              <img src={navAssets.setupArrow} alt="" />
            </span>
          </button>
          <button
            type="button"
            className={styles.row}
            onClick={(event) => {
              flashPress(event);
              onChangeName();
            }}
          >
            <span className={styles.iconBox}>
              <img src={navAssets.setupChangeName} alt="" />
            </span>
            <span className={styles.label}>내 이름 바꾸기</span>
            <span className={styles.arrow} aria-hidden="true">
              <img src={navAssets.setupArrow} alt="" />
            </span>
          </button>
        </div>

        <h2 className={styles.sectionTitle}>일반</h2>

        <div className={styles.card}>
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHead}>
              <span className={styles.iconBox}>
                <img src={navAssets.setupText} alt="" />
              </span>
              <span className={styles.label}>텍스트 크기</span>
            </div>
            <div className={styles.sliderWrap}>
              <span
                className={`${styles.sliderEnd} ${styles.sliderEndSmall}`}
                aria-hidden="true"
              >
                Aa
              </span>
              <input
                type="range"
                className={styles.range}
                min={0}
                max={100}
                value={textSize}
                aria-label="텍스트 크기"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={textSize}
                aria-valuetext={
                  textSize === 50 ? "기본 크기" : `${textSize}%`
                }
                onInput={(e) => setTextSize(Number(e.currentTarget.value))}
              />
              <span
                className={`${styles.sliderEnd} ${styles.sliderEndLarge}`}
                aria-hidden="true"
              >
                Aa
              </span>
            </div>
          </div>

          <div className={styles.sliderBlock}>
            <div className={styles.sliderHead}>
              <span className={styles.iconBox}>
                <img src={navAssets.setupVolume} alt="" />
              </span>
              <span className={styles.label}>음량 조절</span>
            </div>
            <div className={styles.sliderWrap}>
              <span className={styles.sliderEnd} aria-hidden="true">
                <img src={navAssets.setupVolumeSmall} alt="" />
              </span>
              <input
                type="range"
                className={styles.range}
                min={0}
                max={100}
                value={volume}
                aria-label="음량 조절"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={volume}
                aria-valuetext={
                  volume === 50 ? "기본 음량" : `${volume}%`
                }
                onPointerDown={startVolumePreview}
                onInput={(e) =>
                  handleVolumeChange(Number(e.currentTarget.value))
                }
              />
              <span className={styles.sliderEnd} aria-hidden="true">
                <img src={navAssets.setupVolumeBig} alt="" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
