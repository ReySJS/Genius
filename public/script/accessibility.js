function daltonicSettingStatus() {
  document.querySelector('input[name="daltonic_check"]').checked
    ? daltonicAccessibilityEnable()
    : daltonicAccessibilityDisable();
}

function daltonicAccessibilityEnable() {
  document.getElementById("bg_Input_key_top_left").style.fill =
    "var(--button-daltonic-top-left)";
  document.getElementById("bg_Input_key_bottom_left").style.fill =
    "var(--button-daltonic-bottom-left)";
  document.getElementById("bg_Input_key_bottom_right").style.fill =
    "var(--button-daltonic-bottom-right)";
  document.getElementById("bg_Input_key_top_right").style.fill =
    "var(--button-daltonic-top-right)";
  document.getElementById("simon_model_default_image").src =
    "images/simon-model-daltonic-default.svg";
  document.getElementById("simon_model_square_image").src =
    "images/simon-model-daltonic-square.svg";
  document.getElementById("set_top_left").style.color =
    "var(--button-daltonic-top-left)";
  document.getElementById("set_bottom_left").style.color =
    "var(--button-daltonic-bottom-left)";
  document.getElementById("set_top_right").style.color =
    "var(--button-daltonic-top-right)";
  document.getElementById("set_bottom_right").style.color =
    "var(--button-daltonic-bottom-right)";

  document
    .getElementById("skill_level_range")
    .classList.remove("default_range");
  document.getElementById("skill_level_range").classList.add("daltonic_range");
}

function daltonicAccessibilityDisable() {
  document.getElementById("bg_Input_key_top_left").style.fill =
    "var(--button-top-left)";
  document.getElementById("bg_Input_key_bottom_left").style.fill =
    "var(--button-bottom-left)";
  document.getElementById("bg_Input_key_bottom_right").style.fill =
    "var(--button-bottom-right)";
  document.getElementById("bg_Input_key_top_right").style.fill =
    "var(--button-top-right)";
  document.getElementById("simon_model_default_image").src =
    "images/simon-model-default.svg";
  document.getElementById("simon_model_square_image").src =
    "images/simon-model-square.svg";
  document.getElementById("set_top_left").style.color =
    "var(--button-top-left)";
  document.getElementById("set_bottom_left").style.color =
    "var(--button-bottom-left)";
  document.getElementById("set_top_right").style.color =
    "var(--button-top-right)";
  document.getElementById("set_bottom_right").style.color =
    "var(--button-bottom-right)";

  document
    .getElementById("skill_level_range")
    .classList.remove("daltonic_range");
  document.getElementById("skill_level_range").classList.add("default_range");
}

function daltonicAccessibilitySetBoardGame() {
  if (document.querySelector('input[name="daltonic_check"]').checked) {
    document.getElementById("bg_key_top_left").style.fill =
      "var(--button-daltonic-top-left)";
    document.getElementById("bg_key_bottom_left").style.fill =
      "var(--button-daltonic-bottom-left)";
    document.getElementById("bg_key_bottom_right").style.fill =
      "var(--button-daltonic-bottom-right)";
    document.getElementById("bg_key_top_right").style.fill =
      "var(--button-daltonic-top-right)";
  }
}