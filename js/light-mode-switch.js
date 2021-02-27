var lightSwitch = document.getElementById("lightSwitch");
window.addEventListener("load", function () {
  if (lightSwitch) {
    initTheme();
    lightSwitch.addEventListener("change", function () {
      resetTheme();
    });
  }
});

/**
 * Summary: function that adds or removes the attribute 'data-theme' depending if
 * the switch is 'on' or 'off'.
 *
 * Description: initTheme is a function that uses localStorage from JavaScript DOM,
 * to store the value of the HTML switch. If the switch was already switched to
 * 'on' it will set an HTML attribute to the body named: 'data-theme' to a 'light'
 * value. If it is the first time opening the page, or if the switch was off the
 * 'data-theme' attribute will not be set.
 * @return {void}
 */
function initTheme() {
  var lightThemeSelected =
    localStorage.getItem("lightSwitch") !== null &&
    localStorage.getItem("lightSwitch") === "light";
  lightSwitch.checked = lightThemeSelected;
  lightThemeSelected
    ? document.body.setAttribute("data-theme", "light")
    : document.body.removeAttribute("data-theme");
}

/**
 * Summary: resetTheme checks if the switch is 'on' or 'off' and if it is toggled
 * on it will set the HTML attribute 'data-theme' to light so the light-theme CSS is
 * applied.
 * @return {void}
 */
function resetTheme() {
  if (lightSwitch.checked) {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("lightSwitch", "light");
  } else {
    document.body.removeAttribute("data-theme");
    localStorage.removeItem("lightSwitch");
  }
}