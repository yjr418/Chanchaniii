import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { initTextScale } from "./textScale";
import { initVoiceVolume } from "./voiceVolume";

initTextScale();
initVoiceVolume();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
