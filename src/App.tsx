import { useEffect, useState } from "react";
import { OnboardingEntryFlow } from "./screens/OnboardingEntryFlow";
import { MainApp } from "./nav/MainApp";
import { OnboardingChanchaniFinishScreen } from "./screens/OnboardingChanchaniFinishScreen";
import { OnboardingGeneratingScreen } from "./screens/OnboardingGeneratingScreen";
import { OnboardingNameScreen } from "./screens/OnboardingNameScreen";
import { OnboardingPersonalityScreen } from "./screens/OnboardingPersonalityScreen";
import { OnboardingPhotoPreviewScreen } from "./screens/OnboardingPhotoPreviewScreen";
import { OnboardingPhotoScreen } from "./screens/OnboardingPhotoScreen";
import { OnboardingTutorialLoadingScreen } from "./screens/OnboardingTutorialLoadingScreen";
import { OnboardingTutorialOneScreen } from "./screens/OnboardingTutorialOneScreen";
import { OnboardingTutorialMapFinishScreen } from "./screens/OnboardingTutorialMapFinishScreen";
import { OnboardingTutorialMapScreen } from "./screens/OnboardingTutorialMapScreen";
import { OnboardingTutorialTwoScreen } from "./screens/OnboardingTutorialTwoScreen";

type OnboardingStep =
  | "splash"
  | "name"
  | "photo"
  | "photoPreview"
  | "generating"
  | "finish"
  | "personality"
  | "tutorialLoading"
  | "tutorial1"
  | "tutorial2"
  | "tutorialMap"
  | "tutorialMapFinish"
  | "main";

const GENERATING_DURATION_MS = 1500;

export function App() {
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [chanchaniName, setChanchaniName] = useState("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(
    [],
  );
  const [tutorialGradientStartTime, setTutorialGradientStartTime] = useState(
    () => Date.now(),
  );

  useEffect(() => {
    return () => {
      if (uploadedPhotoUrl) URL.revokeObjectURL(uploadedPhotoUrl);
    };
  }, [uploadedPhotoUrl]);

  useEffect(() => {
    if (step !== "generating") return;

    const timer = window.setTimeout(() => {
      setStep("finish");
    }, GENERATING_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [step]);

  if (step === "main") {
    return (
      <MainApp
        chanchaniName={chanchaniName}
        selectedPersonalities={selectedPersonalities}
        onUpdatePersonalities={setSelectedPersonalities}
        onUpdateName={setChanchaniName}
        onUpdatePhoto={(photoUrl) => {
          setUploadedPhotoUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return photoUrl;
          });
        }}
      />
    );
  }

  if (step === "tutorialMapFinish") {
    return (
      <OnboardingTutorialMapFinishScreen
        onPracticeAgain={() => setStep("tutorialLoading")}
        onStart={() => setStep("main")}
      />
    );
  }

  if (step === "tutorialMap") {
    return (
      <OnboardingTutorialMapScreen
        onNext={() => setStep("tutorialMapFinish")}
        onSkip={() => setStep("main")}
      />
    );
  }

  if (step === "tutorial2") {
    return (
      <OnboardingTutorialTwoScreen
        gradientStartTime={tutorialGradientStartTime}
        onBack={() => setStep("tutorial1")}
        onNext={() => setStep("tutorialLoading")}
        onSkip={() => setStep("main")}
      />
    );
  }

  if (step === "tutorial1") {
    return (
      <OnboardingTutorialOneScreen
        gradientStartTime={tutorialGradientStartTime}
        onBack={() => setStep("personality")}
        onNext={() => setStep("tutorial2")}
      />
    );
  }

  if (step === "tutorialLoading") {
    return (
      <OnboardingTutorialLoadingScreen
        onComplete={() => setStep("tutorialMap")}
      />
    );
  }

  if (step === "personality") {
    return (
      <OnboardingPersonalityScreen
        initialSelected={selectedPersonalities}
        onBack={() => setStep("finish")}
        onNext={(personalities) => {
          setSelectedPersonalities(personalities);
          setTutorialGradientStartTime(Date.now());
          setStep("tutorial1");
        }}
      />
    );
  }

  if (step === "finish") {
    return (
      <OnboardingChanchaniFinishScreen
        chanchaniName={chanchaniName}
        onBack={() => setStep("photoPreview")}
        onNext={() => setStep("personality")}
      />
    );
  }

  if (step === "generating") {
    return <OnboardingGeneratingScreen />;
  }

  if (step === "photoPreview" && uploadedPhotoUrl) {
    return (
      <OnboardingPhotoPreviewScreen
        chanchaniName={chanchaniName}
        photoUrl={uploadedPhotoUrl}
        onBack={() => setStep("photo")}
        onConfirm={() => setStep("generating")}
      />
    );
  }

  if (step === "photo") {
    return (
      <OnboardingPhotoScreen
        onBack={() => setStep("name")}
        onPhotoSelected={(photoUrl) => {
          setUploadedPhotoUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return photoUrl;
          });
          setStep("photoPreview");
        }}
      />
    );
  }

  if (step === "splash") {
    return (
      <OnboardingEntryFlow
        initialName={chanchaniName}
        onNext={(name) => {
          setChanchaniName(name);
          setStep("photo");
        }}
      />
    );
  }

  return (
    <OnboardingNameScreen
      initialName={chanchaniName}
      onNext={(name) => {
        setChanchaniName(name);
        setStep("photo");
      }}
    />
  );
}
