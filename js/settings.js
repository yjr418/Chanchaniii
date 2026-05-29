(function () {
  var TEXT_SCALE_MIN = 0.85;
  var TEXT_SCALE_MAX = 1.15;
  var TEXT_SCALE_DEFAULT = 50;

  var textSizeRange = document.getElementById("settings-text-size");
  var volumeRange = document.getElementById("settings-volume");

  function scaleFromRange(value) {
    var ratio = Number(value) / 100;
    return TEXT_SCALE_MIN + ratio * (TEXT_SCALE_MAX - TEXT_SCALE_MIN);
  }

  function applyTextScale(value) {
    var scale = scaleFromRange(value);
    document.documentElement.style.setProperty("--app-text-scale", String(scale));
  }

  function bindPlaceholderClick(selector, action) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener("click", function () {
        el.classList.add("is-pressed");
        el.setAttribute("aria-pressed", "true");
        window.setTimeout(function () {
          el.classList.remove("is-pressed");
          el.setAttribute("aria-pressed", "false");
        }, 180);

        el.dispatchEvent(
          new CustomEvent("settings:action", {
            bubbles: true,
            detail: { action: action },
          })
        );
      });
    });
  }

  if (textSizeRange) {
    textSizeRange.value = String(TEXT_SCALE_DEFAULT);
    applyTextScale(TEXT_SCALE_DEFAULT);

    textSizeRange.addEventListener("input", function () {
      applyTextScale(textSizeRange.value);
    });
  }

  bindPlaceholderClick('[data-settings-action="edit-profile"]', "edit-profile");
  bindPlaceholderClick('[data-settings-action="change-avatar"]', "change-avatar");
  bindPlaceholderClick('[data-settings-action="change-personality"]', "change-personality");
  bindPlaceholderClick('[data-settings-action="change-name"]', "change-name");

  window.applyTextScale = applyTextScale;
})();
