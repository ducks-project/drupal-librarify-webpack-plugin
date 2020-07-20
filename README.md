<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# drupal-librarify-webpack-plugin

Prepare and create the library.yml file for Drupal.

## Getting Started

To begin, you'll need to install `drupal-librarify-webpack-plugin`:

```console
$ npm install drupal-librarify-webpack-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const DrupalLibrarifyPlugin = require('drupal-librarify-webpack-plugin');

module.exports = {
  plugins: [new DrupalLibrarifyPlugin()],
};
```

And run `webpack` via your preferred method.

## Options

|                Name                 |         Type         |                                                             Default                                                              | Description                                                                                                               |
| :---------------------------------: | :------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------ |
|      **[`version`](#version)**      | `{Boolean\|String}`  |                                                           `undefined`                                                            | Include version in library.yaml assertion                                                                                 |
|       **[`header`](#header)**       |     `{Boolean}`      |                                                             `false`                                                              | Indicate that the JavaScript assets in that asset library are in the 'critical path' and should be loaded from the header |
|       **[`prefix`](#prefix)**       | `{String\|Function}` |                                                            `drupal.`                                                             | Prefix your libary name                                                                                                   |
|     **[`minified`](#minified)**     | `{String\|Boolean}`  |                                                              `auto`                                                              | Global css minified options.                                                                                              |
|           **[`js`](#js)**           |      `{Object}`      |                                                               `{}`                                                               | In order to override js options for your library.`                                                                        |
|          **[`css`](#css)**          |      `{Object}`      |                                                               `{}`                                                               | In order to override css options for your library.                                                                        |
| **[`dependencies`](#dependencies)** |  `{Array\|Object}`   | `{ 'core/jquery': true, 'core/jquery.once': true, 'core/drupal': true, 'core/drupal.form': false, 'core/drupalSettings': true }` | Manually specify the dependencies for your library                                                                        |
|       **[`weight`](#weight)**       |      `{Number}`      |                                                           `undefined`                                                            | Adjusts order relative to other assets. Discouraged for JS                                                                |

### `version`

Type: `Boolean\|String`
Default: `undefined`

Include version in library.yaml.
If true, then it will "guess" the version in the package.json file.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      version: '1.0.0',
    }),
  ],
};
```

### `header`

Type: `Boolean`
Default: `false`

Indicate that the JavaScript assets in that asset library are in the 'critical path' and should be loaded from the header.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      header: true,
    }),
  ],
};
```

### `prefix`

Type: `String|Function`
Default: `drupal.`

Prefix your library name.

#### `String`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      prefix: 'custom.',
    }),
  ],
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      prefix(info) {
        // info.file is the original asset filename
        // info.path is the path of the original asset
        // info.query is the query
        return `${info.path}.${info.query}.`;
      },
    }),
  ],
};
```

### `minified`

Type: `Boolean\|String`
Default: `auto`

Global css minified options.

#### `Boolean`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      minified: false,
    }),
  ],
};
```

#### `String`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      minified: 'auto',
    }),
  ],
};
```

### `js`

Type: `Object`
Default: `{}`

In order to override js options for your library.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      js: {
        'my/library/path/filename.js': {
          preprocess: false,
        },
      },
    }),
  ],
};
```

### `css`

Type: `Object`
Default: `{}`

In order to override css options for your library.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      css: {
        'my/library/path/filename.css': {
          minified: true,
        },
      },
    }),
  ],
};
```

### `dependencies`

Type: `Array\|Object`
Default: `{ 'core/jquery': true, 'core/jquery.once': true, 'core/drupal': true, 'core/drupal.form': false, 'core/drupalSettings': true }`

In order to override css options for your library.

**webpack.config.js**

#### `Array`

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      dependencies: ['core/drupal.form'],
    }),
  ],
};
```

#### `Object`

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      dependencies: {
        'core/jquery.once': false,
        'core/drupal.form': true,
      },
    }),
  ],
};
```

### `weight`

Type: `Number`
Default: `undefined`

Adjusts order relative to other assets. Discouraged for JS.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      weight: -10,
    }),
  ],
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/drupal-librarify-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/drupal-librarify-webpack-plugin
[node]: https://img.shields.io/node/v/drupal-librarify-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/ducks-project/drupal-librarify-webpack-plugin.svg
[deps-url]: https://david-dm.org/ducks-project/drupal-librarify-webpack-plugin
[tests]: https://github.com/ducks-project/drupal-librarify-webpack-plugin/workflows/drupal-librarify-webpack-plugin/badge.svg
[tests-url]: https://github.com/ducks-project/drupal-librarify-webpack-plugin/actions
[cover]: https://codecov.io/gh/ducks-project/drupal-librarify-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/ducks-project/drupal-librarify-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=drupal-librarify-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=drupal-librarify-webpack-plugin
