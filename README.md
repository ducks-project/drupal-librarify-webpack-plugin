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

|                      Name                       |                   Type                    |      Default       | Description                                                                                                   |
| :---------------------------------------------: | :---------------------------------------: | :----------------: | :------------------------------------------------------------------------------------------------------------ |
|               **[`test`](#test)**               | `{String\|RegExp\|Array<String\|RegExp>}` |    `undefined`     | Include all assets that pass test assertion                                                                   |
|            **[`include`](#include)**            | `{String\|RegExp\|Array<String\|RegExp>}` |    `undefined`     | Include all assets matching any of these conditions                                                           |
|            **[`exclude`](#exclude)**            | `{String\|RegExp\|Array<String\|RegExp>}` |    `undefined`     | Exclude all assets matching any of these conditions                                                           |
|          **[`algorithm`](#algorithm)**          |           `{String\|Function}`            |       `gzip`       | The compression algorithm/function                                                                            |
| **[`compressionOptions`](#compressionoptions)** |                `{Object}`                 |   `{ level: 9 }`   | Compression options for `algorithm`                                                                           |
|          **[`threshold`](#threshold)**          |                `{Number}`                 |        `0`         | Only assets bigger than this size are processed (in bytes)                                                    |
|           **[`minRatio`](#minratio)**           |                `{Number}`                 |       `0.8`        | Only assets that compress better than this ratio are processed (`minRatio = Compressed Size / Original Size`) |
|           **[`filename`](#filename)**           |           `{String\|Function}`            | `[path].gz[query]` | The target asset filename.                                                                                    |
|              **[`cache`](#cache)**              |                `{Boolean}`                |       `true`       | Enable file caching                                                                                           |

### `test`

Type: `String|RegExp|Array<String|RegExp>`
Default: `undefined`

Include all assets that pass test assertion.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      test: /\.js(\?.*)?$/i,
    }),
  ],
};
```

### `name`

Type: `String|Function`
Default: `undefined`

The modul's name/function.

#### `String`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      name: 'my_module',
    }),
  ],
};
```

#### `Function`

Allow to specify a custom's name function.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new DrupalLibrarifyPlugin({
      name() {
        return 'my_module';
      },
    }),
  ],
};
```

### `filename`

Type: `String|Function`
Default: `[path].gz[query]`

The target asset filename.

#### `String`

`[file]` is replaced with the original asset filename.
`[path]` is replaced with the path of the original asset.
`[dir]` is replaced with the directory of the original asset.
`[name]` is replaced with the filename of the original asset.
`[ext]` is replaced with the extension of the original asset.
`[query]` is replaced with the query.

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]',
    }),
  ],
};
```

#### `Function`

**webpack.config.js**

```js
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename(info) {
        // info.file is the original asset filename
        // info.path is the path of the original asset
        // info.query is the query
        return `${info.path}.gz${info.query}`;
      },
    }),
  ],
};
```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/compression-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/compression-webpack-plugin
[node]: https://img.shields.io/node/v/compression-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/compression-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/compression-webpack-plugin
[tests]: https://github.com/webpack-contrib/compression-webpack-plugin/workflows/compression-webpack-plugin/badge.svg
[tests-url]: https://github.com/webpack-contrib/compression-webpack-plugin/actions
[cover]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/compression-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=compression-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=compression-webpack-plugin
