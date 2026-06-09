export type NavStep =
  | "home"
  | "current-location"
  | "check-location"
  | "voice-waiting"
  | "voice-speaking"
  | "searching-path"
  | "transfer-guide-1"
  | "transfer-guide-2"
  | "transfer-guide-finish"
  | "select-exit"
  | "settings"
  | "personality"
  | "change-name"
  | "change-avatar"
  | "change-avatar-preview"
  | "change-avatar-generating";

export type AfterCheckFlow = "voice-waiting" | "searching-path";

export type NavGuideFlow = "transfer" | "exit";
