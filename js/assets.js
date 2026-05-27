/** Figma Desktop MCP — chanchani / node 80:2653 (Figma 앱 실행 중일 때 로드) */
window.ASSETS = {
  settings: "http://localhost:3845/assets/2d599d3640525f0c0a7a4fe27025a645d700d32c.svg",
  backArrow: "http://localhost:3845/assets/62480a9e086ed481839dec9f12f15d3e3a036227.svg",
  bgEllipse: "http://localhost:3845/assets/15ce2e7bb92d028ab9c09880048614d357add065.svg",
  wifi: "http://localhost:3845/assets/458aea65aa10f4360dc9186720698526b7fa8c20.svg",
  signal: "http://localhost:3845/assets/bb549087f5d676c312e7351934ccfb3b7dc0e9b2.svg",
  battery: "http://localhost:3845/assets/0fec070cefd6434257f74dd2ae4d4e9fc02ed095.svg",
  locationPulse: "http://localhost:3845/assets/6e6421f8bb6977756f17aa33edb65755e5d89609.svg",
  radarGlow: "http://localhost:3845/assets/1be779006c2570aa8a039869190bbdeb3321a9aa.svg",
  radarRing1: "http://localhost:3845/assets/bd82c8f238231eadc2cdd7112440353c4a7894c8.png",
  radarRing2: "http://localhost:3845/assets/53f64bf00d763bb6d02826783db9f9d1438d1797.png",
  radarRing3: "http://localhost:3845/assets/6d65a6e8c9d6d99e4eb038737d36ad553d85ceaf.png",
  radarBase: "http://localhost:3845/assets/17e2ca29d856991f883a9c1a05792fa3495a672e.svg",
  sparkle: "http://localhost:3845/assets/9053d600a6d793c91e46fec2770ee6894b8864e5.svg",
  train: "http://localhost:3845/assets/b1e4ddbe2328f42757585a7a04a0cfedcc9e12cc.svg",
  exit: "http://localhost:3845/assets/e1df8448960fc0b8b7e1347fba1c8b118d83a6a1.svg",
  elevator: "http://localhost:3845/assets/ba2d9e7265d7464f96f85fe13b4b97bb7664a60c.svg",
  restroom: "http://localhost:3845/assets/87652df6e8c73f4e58b711b0242633941204b7e6.svg",
};

var ASSET_FALLBACKS = {
  backArrow: "assets/icons/back-arrow.svg",
};

function applyAsset(el) {
  var key = el.getAttribute("data-asset");
  if (!key) return;

  var url = window.ASSETS[key];
  if (!url) {
    if (ASSET_FALLBACKS[key]) el.src = ASSET_FALLBACKS[key];
    return;
  }

  el.src = url;

  if (!ASSET_FALLBACKS[key]) return;

  el.addEventListener(
    "error",
    function onError() {
      el.removeEventListener("error", onError);
      el.src = ASSET_FALLBACKS[key];
    },
    { once: true },
  );
}

document.querySelectorAll("[data-asset]").forEach(applyAsset);
