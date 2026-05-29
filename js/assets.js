window.ASSETS = {
  settings: "assets/icons/settings.svg",
  backArrow: "assets/icons/back-arrow.svg",
  bgEllipse: "assets/images/bg-ellipse.svg",
  wifi: "assets/icons/wifi.svg",
  signal: "assets/icons/signal.svg",
  battery: "assets/icons/battery.svg",
  locationPulse: "assets/icons/location-pulse.svg",
  loading: "assets/images/loading.svg",
  locationIcon: "assets/icons/location.svg",
  locationPhoto: "assets/images/location.png",
  radarGlow: "assets/images/radar-glow.svg",
  radarRing1: "assets/images/radar-ring-1.svg",
  radarRing2: "assets/images/radar-ring-2.svg",
  radarRing3: "assets/images/radar-ring-3.svg",
  radarBase: "assets/images/radar-base.svg",
  sparkle: "assets/icons/sparkle.svg",
  train: "assets/icons/transfer.svg",
  exit: "assets/icons/exit.svg",
  elevator: "assets/icons/elevator.svg",
  restroom: "assets/icons/restroom.svg",
  voiceWaitingCenter: "assets/images/voice waiting center.svg",
  voiceWaitingRadar: "assets/images/voice waiting radar.svg",
  voiceCenter: "assets/images/voice center.svg",
  voiceRadar: "assets/images/voice radar.svg",
  voiceRing: "assets/images/voice ring.svg",
  loading2Center: "assets/images/loading-2-center.svg",
  loading2Radar1: "assets/images/loading-2-radar-1.svg",
  loading2Radar2: "assets/images/loading-2-radar-2.svg",
  loading2RadarMini: "assets/images/loading-2-radar-mini.svg",
  loading2Ring1: "assets/images/loading-2-ring-1.svg",
  loading2Ring2: "assets/images/loading-2-ring-2.svg",
  transferGuide1: "assets/images/14_transfer_guide_bg(1).png",
  transferGuide1Expanded: "assets/images/transfer-guide-1-expanded.png",
  transferGuide2: "assets/images/14_transfer_guide_bg(2).png",
  setupAvatar: "assets/images/setup-avatar.svg",
};

function applyAsset(el) {
  var key = el.getAttribute("data-asset");
  if (!key) return;

  var url = window.ASSETS[key];
  if (url) el.src = url;
}

document.querySelectorAll("[data-asset]").forEach(applyAsset);
