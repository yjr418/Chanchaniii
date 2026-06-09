import { useCallback, useEffect, useRef, useState } from "react";
import { OnboardingGeneratingScreen } from "../screens/OnboardingGeneratingScreen";
import { OnboardingNameScreen } from "../screens/OnboardingNameScreen";
import { OnboardingPersonalityScreen } from "../screens/OnboardingPersonalityScreen";
import { OnboardingPhotoPreviewScreen } from "../screens/OnboardingPhotoPreviewScreen";
import { OnboardingPhotoScreen } from "../screens/OnboardingPhotoScreen";
import { CheckLocationScreen } from "../screens/nav/CheckLocationScreen";
import { CurrentLocationScreen } from "../screens/nav/CurrentLocationScreen";
import { HomeScreen } from "../screens/nav/HomeScreen";
import { SearchingPathScreen } from "../screens/nav/SearchingPathScreen";
import { SelectExitScreen } from "../screens/nav/SelectExitScreen";
import { SettingsScreen } from "../screens/nav/SettingsScreen";
import { TransferGuide1Screen } from "../screens/nav/TransferGuide1Screen";
import { TransferGuide2Screen } from "../screens/nav/TransferGuide2Screen";
import { TransferGuideFinishScreen } from "../screens/nav/TransferGuideFinishScreen";
import { VoiceSpeakingScreen } from "../screens/nav/VoiceSpeakingScreen";
import { VoiceWaitingScreen } from "../screens/nav/VoiceWaitingScreen";
import { PHOTO_CHANGE_TITLE } from "../screens/onboardingPhotoTitle";
import type { AfterCheckFlow, NavGuideFlow, NavStep } from "./navTypes";
import { useCameraStream } from "../hooks/useCameraStream";
import { useNavVoice } from "./useNavVoice";

const LOCATION_SCAN_MS = 5000;
const SEARCHING_TO_GUIDE_MS = 4000;
const AVATAR_GENERATING_MS = 1500;

export type MainAppProps = {
  chanchaniName: string;
  selectedPersonalities: string[];
  onUpdatePersonalities: (personalities: string[]) => void;
  onUpdateName: (name: string) => void;
  onUpdatePhoto: (photoUrl: string) => void;
};

export function MainApp({
  chanchaniName,
  selectedPersonalities,
  onUpdatePersonalities,
  onUpdateName,
  onUpdatePhoto,
}: MainAppProps) {
  const [step, setStep] = useState<NavStep>("home");
  const [homeFlowAfterCheck, setHomeFlowAfterCheck] =
    useState<AfterCheckFlow>("voice-waiting");
  const [guideFlow, setGuideFlow] = useState<NavGuideFlow>("transfer");
  const [selectedExit, setSelectedExit] = useState<number | null>(null);
  const [editAvatarPhotoUrl, setEditAvatarPhotoUrl] = useState<string | null>(
    null,
  );

  const autoNavTimerRef = useRef<number | null>(null);
  const searchingTimerRef = useRef<number | null>(null);

  const clearAutoNavTimer = useCallback(() => {
    if (autoNavTimerRef.current !== null) {
      window.clearTimeout(autoNavTimerRef.current);
      autoNavTimerRef.current = null;
    }
  }, []);

  const clearSearchingTimer = useCallback(() => {
    if (searchingTimerRef.current !== null) {
      window.clearTimeout(searchingTimerRef.current);
      searchingTimerRef.current = null;
    }
  }, []);

  const navigate = useCallback(
    (next: NavStep) => {
      clearAutoNavTimer();
      clearSearchingTimer();

      if (next === "current-location") {
        autoNavTimerRef.current = window.setTimeout(() => {
          setStep("check-location");
        }, LOCATION_SCAN_MS);
      }

      if (next === "searching-path") {
        searchingTimerRef.current = window.setTimeout(() => {
          setStep("transfer-guide-1");
        }, SEARCHING_TO_GUIDE_MS);
      }

      setStep(next);
    },
    [clearAutoNavTimer, clearSearchingTimer],
  );

  const openSettings = useCallback(() => {
    if (step === "settings") return;
    clearAutoNavTimer();
    clearSearchingTimer();
    setStep("settings");
  }, [clearAutoNavTimer, clearSearchingTimer, step]);

  const closeSettings = useCallback(() => {
    navigate("home");
  }, [navigate]);

  const voice = useNavVoice({
    step,
    onEnterSpeaking: () => setStep("voice-speaking"),
    onNavigateSearching: () => navigate("searching-path"),
  });

  const isTransferGuideCameraStep =
    step === "searching-path" ||
    step === "transfer-guide-1" ||
    step === "transfer-guide-2";
  const camera = useCameraStream(isTransferGuideCameraStep);

  const goHome = useCallback(() => {
    setGuideFlow("transfer");
    setSelectedExit(null);
    navigate("home");
  }, [navigate]);

  const goCurrentLocation = useCallback(
    (afterCheck: AfterCheckFlow) => {
      setHomeFlowAfterCheck(afterCheck);
      setGuideFlow("transfer");
      setSelectedExit(null);
      navigate("current-location");
    },
    [navigate],
  );

  const confirmLocation = useCallback(() => {
    navigate(homeFlowAfterCheck);
  }, [homeFlowAfterCheck, navigate]);

  const openPersonalityEdit = useCallback(() => {
    clearAutoNavTimer();
    clearSearchingTimer();
    setStep("personality");
  }, [clearAutoNavTimer, clearSearchingTimer]);

  const closePersonalityEdit = useCallback(() => {
    setStep("settings");
  }, []);

  const savePersonalityEdit = useCallback(
    (personalities: string[]) => {
      onUpdatePersonalities(personalities);
      setStep("settings");
    },
    [onUpdatePersonalities],
  );

  const openNameEdit = useCallback(() => {
    clearAutoNavTimer();
    clearSearchingTimer();
    setStep("change-name");
  }, [clearAutoNavTimer, clearSearchingTimer]);

  const closeNameEdit = useCallback(() => {
    setStep("settings");
  }, []);

  const saveNameEdit = useCallback(
    (name: string) => {
      onUpdateName(name);
      setStep("settings");
    },
    [onUpdateName],
  );

  const openAvatarEdit = useCallback(() => {
    clearAutoNavTimer();
    clearSearchingTimer();
    setStep("change-avatar");
  }, [clearAutoNavTimer, clearSearchingTimer]);

  const closeAvatarEdit = useCallback(() => {
    setEditAvatarPhotoUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setStep("settings");
  }, []);

  const handleAvatarPhotoSelected = useCallback((photoUrl: string) => {
    setEditAvatarPhotoUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return photoUrl;
    });
    setStep("change-avatar-preview");
  }, []);

  const confirmAvatarEdit = useCallback(() => {
    setStep("change-avatar-generating");
  }, []);

  useEffect(() => {
    if (step !== "change-avatar-generating") return;

    const timer = window.setTimeout(() => {
      setEditAvatarPhotoUrl((current) => {
        if (current) onUpdatePhoto(current);
        return null;
      });
      setStep("settings");
    }, AVATAR_GENERATING_MS);

    return () => window.clearTimeout(timer);
  }, [onUpdatePhoto, step]);

  useEffect(() => {
    return () => {
      clearAutoNavTimer();
      clearSearchingTimer();
    };
  }, [clearAutoNavTimer, clearSearchingTimer]);

  if (step === "change-avatar-generating") {
    return <OnboardingGeneratingScreen />;
  }

  if (step === "change-avatar-preview" && editAvatarPhotoUrl) {
    return (
      <OnboardingPhotoPreviewScreen
        chanchaniName={chanchaniName}
        photoUrl={editAvatarPhotoUrl}
        title={PHOTO_CHANGE_TITLE}
        onBack={() => setStep("change-avatar")}
        onConfirm={confirmAvatarEdit}
      />
    );
  }

  if (step === "change-avatar") {
    return (
      <OnboardingPhotoScreen
        title={PHOTO_CHANGE_TITLE}
        onBack={closeAvatarEdit}
        onPhotoSelected={handleAvatarPhotoSelected}
      />
    );
  }

  if (step === "change-name") {
    return (
      <OnboardingNameScreen
        key={chanchaniName}
        initialName={chanchaniName}
        submitLabel="저장"
        onBack={closeNameEdit}
        onNext={saveNameEdit}
      />
    );
  }

  if (step === "personality") {
    return (
      <OnboardingPersonalityScreen
        key={selectedPersonalities.join("|")}
        initialSelected={selectedPersonalities}
        submitLabel="저장"
        onBack={closePersonalityEdit}
        onNext={savePersonalityEdit}
      />
    );
  }

  if (step === "settings") {
    return (
      <SettingsScreen
        selectedPersonalities={selectedPersonalities}
        onBack={closeSettings}
        onChangePersonality={openPersonalityEdit}
        onChangeName={openNameEdit}
        onChangeAvatar={openAvatarEdit}
      />
    );
  }

  return (
    <>
      {step === "home" && (
        <HomeScreen
          chanchaniName={chanchaniName}
          onOpenSettings={openSettings}
          onGoCurrentLocation={goCurrentLocation}
          onGoSelectExit={() => navigate("select-exit")}
        />
      )}

      {step === "current-location" && <CurrentLocationScreen />}

      {step === "check-location" && (
        <CheckLocationScreen
          onConfirm={confirmLocation}
          onRevise={() => navigate("current-location")}
        />
      )}

      {step === "voice-waiting" && (
        <VoiceWaitingScreen
          prompt={voice.prompt}
          voiceWaveRef={voice.voiceWaveRef}
          onTapFallback={voice.armTapFallback}
        />
      )}

      {step === "voice-speaking" && (
        <VoiceSpeakingScreen
          text={voice.speakingText}
          isActive={voice.isSpeakingActive}
          voiceWaveRef={voice.voiceWaveRef}
        />
      )}

      {step === "searching-path" && <SearchingPathScreen />}

      {step === "transfer-guide-1" && (
        <TransferGuide1Screen
          cameraStream={camera.stream}
          cameraStarting={camera.isStarting}
          selectedPersonalities={selectedPersonalities}
          onBack={() => navigate("searching-path")}
          onNext={() => navigate("transfer-guide-2")}
        />
      )}

      {step === "transfer-guide-2" && (
        <TransferGuide2Screen
          cameraStream={camera.stream}
          cameraStarting={camera.isStarting}
          guideFlow={guideFlow}
          selectedExit={selectedExit}
          selectedPersonalities={selectedPersonalities}
          onBack={() => navigate("transfer-guide-1")}
          onNext={() => navigate("transfer-guide-finish")}
        />
      )}

      {step === "transfer-guide-finish" && (
        <TransferGuideFinishScreen
          guideFlow={guideFlow}
          selectedPersonalities={selectedPersonalities}
          onHome={goHome}
        />
      )}

      {step === "select-exit" && (
        <SelectExitScreen
          onBack={goHome}
          onStart={(exit) => {
            setSelectedExit(exit);
            setGuideFlow("exit");
            setHomeFlowAfterCheck("searching-path");
            navigate("current-location");
          }}
        />
      )}
    </>
  );
}
