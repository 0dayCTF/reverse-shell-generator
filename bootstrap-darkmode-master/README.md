# Bootstrap Dark Mode

[![npm version](https://badge.fury.io/js/bootstrap-darkmode.svg)](https://www.npmjs.com/package/bootstrap-darkmode)

This project provides a stylesheet and two scripts that allow you to implement Dark Mode on your website.
It is initially loaded based on user preference, can be toggled via a switch, and is saved via `localStorage`.

You can view the [test page](testpage.html) with all default bootstrap components in light and dark
(thanks to [juzraai](https://juzraai.github.io/)!).

Note that not all components are fully supported yet.
Mostly the contextual color classes can cause problems.

If you are using Angular, check out [ng-bootstrap-darkmode](https://github.com/Clashsoft/ng-bootstrap-darkmode).

## Usage

### With NPM/Yarn/PNPM

Install the [npm package](https://www.npmjs.com/package/bootstrap-darkmode):

```sh
$ npm install bootstrap-darkmode
$ yarn add bootstrap-darkmode
$ pnpm install bootstrap-darkmode
```

Include the stylesheet, e.g. in `styles.scss`:

```scss
@import "~bootstrap-darkmode/darktheme";
```

### Via unpkg.com

1. Put the stylesheet link in `<head>`. Do not forget to add bootstrap.

    ```html
    <head>
        <!-- ... -->
        <!-- Bootstrap CSS ... -->
    
        <!-- Dark mode CSS -->
        <link rel="stylesheet" href="https://unpkg.com/bootstrap-darkmode@0.7.0/dist/darktheme.css"/>
        <!-- ... -->
    </head>
    ```

2. Load the theme script as the first thing in `<body>`.

    ```html
    <body>
    <script src="https://unpkg.com/bootstrap-darkmode@0.7.0/dist/theme.js"></script>
    <!-- ... --->
    ```
   
### Building Yourself

1. Clone this repo.
2. Run `npm build`.
3. Find `darktheme.css` and `theme.js` in the `dist/` directory.
4. Follow the steps for unpkg.com, but replace the links with whatever local paths you put the files in.

## Setup

> If you are using [ng-bootstrap-darkmode](https://github.com/Clashsoft/ng-bootstrap-darkmode),
> you can skip this section entirely.
> It comes with its own JavaScript implementation that is used very differently.

### Theme

As soon as possible after `<body>`, initialize the config and load the theme:

```js
const themeConfig = new ThemeConfig();
// place customizations here
themeConfig.initTheme();
```

Loading the theme early shortens the time until the white default background becomes dark.

### Dark Switch

If you want to use the default dark switch, load the switch script and add the element using this code:

```js
// this will write the html to the document and return the element.
const darkSwitch = writeDarkSwitch(themeConfig);
```

## Configuration

You can listen to theme changes by registering a callback with `themeChangeHandlers`:

```js
config.themeChangeHandlers.push(theme => console.log(`using theme: ${theme}`));
```

To change the way the theme is persisted, you can change the `loadTheme` and `saveTheme` functions:

```js
themeConfig.loadTheme = () => {
    // custom logic
    return 'dark';
};

themeConfig.saveTheme = theme => {
    // custom logic
    console.log(theme);
};
```
