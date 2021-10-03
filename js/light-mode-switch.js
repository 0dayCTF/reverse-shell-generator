var themeSelector = $("#theme-selector");
window.addEventListener("load", function () {
  if (themeSelector) {
    initTheme();
    themeSelector.on('change', function() {
      resetTheme(this.value);
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
  var currentTheme = localStorage.getItem("currentTheme");

  if (currentTheme == null) {
    document.body.removeAttribute("data-theme")
  } else {
    document.body.setAttribute("data-theme", currentTheme)
    $("#theme-selector").val(currentTheme).change();
  }
}

/**
 * Summary: resetTheme checks if the switch is 'on' or 'off' and if it is toggled
 * on it will set the HTML attribute 'data-theme' to light so the light-theme CSS is
 * applied.
 * @return {void}
 */
function resetTheme(currentTheme) {
  if (currentTheme !== "dark") {
    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("currentTheme", currentTheme);
  } else {
    document.body.removeAttribute("data-theme");
    localStorage.removeItem("currentTheme");
  }
}