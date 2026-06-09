import tutorialShared from "../screens/onboardingTutorialShared.module.css";

const GLOW_ANIMATION_1_S = 16;
const GLOW_ANIMATION_2_S = 22;

type TutorialGradientGlowProps = {
  startTime: number;
};

export function TutorialGradientGlow({ startTime }: TutorialGradientGlowProps) {
  const elapsed = (Date.now() - startTime) / 1000;
  const delay1 = -(elapsed % GLOW_ANIMATION_1_S);
  const delay2 = -(elapsed % GLOW_ANIMATION_2_S);

  return (
    <div
      className={tutorialShared.gradientGlow}
      aria-hidden="true"
      style={{
        ["--glow-delay-1" as string]: `${delay1}s`,
        ["--glow-delay-2" as string]: `${delay2}s`,
      }}
    />
  );
}
