# v0.1.0

* Initial NPM release.

# v0.2.0

+ Added `theme.d.ts`.

# v0.3.0

* Encapsulated theme methods in the `ThemeConfig` class.
* Encapsulated dark switch in a function.

# v0.3.1

+ Added `initTheme` to `theme.d.ts`.

# v0.3.2

+ Added constructor to `ThemeConfig`.

# v0.4.0

* Converted the JavaScript code to TypeScript.

# v0.5.0

+ Added the `ThemeConfig.detectTheme` method.
* `ThemeConfig.loadTheme` and `.saveTheme` are now regular methods.
* The `ThemeConfig.loadTheme` and `.saveTheme` methods can now accept/return `null`.
* Moved `darktheme.css` to `dist/`.
* Removed `.gitignore` from the NPM package.

# v0.6.0

* `dist/theme.js` is no longer a module.

# v0.7.0

+ Added `.bg-darkmode-black` as an opposite for `.bg-white`.
+ Added support for `data-theme="auto"`, which will automatically apply dark mode dependending on user agent preference.
* Improved table border colors.
* Improved horizontal rule (`<hr>`) color.
* Updated information in `package.json`.
