import path from 'path';

import fs from 'fs';

import validateOptions from 'schema-utils';
import yaml from 'js-yaml';

import schema from './options.json';
import isEmpty from './Helpers/isEmpty';

class DrupalLibrarifyWebpackPlugin {
  constructor(opts = {}) {
    const options = {
      prefix: 'drupal.',
      ...opts,
    };

    validateOptions(schema, options, {
      name: 'Drupal Librarify Plugin',
      baseDataPath: 'options',
    });

    this.options = options || {};
  }

  apply(compiler) {
    const plugin = { name: 'DrupalLibrarifyWebpackPlugin' };
    compiler.hooks.afterEmit.tapAsync(
      plugin,
      this.afterEmitTapCallback.bind(this)
    );
  }

  afterEmitTapCallback(compilation, callback) {
    this.generateYamlFile(compilation);
    callback();
  }

  generateYamlFile(compilation) {
    const modulePathname = path.resolve(process.cwd());
    const moduleBasename = path.basename(path.resolve(process.cwd()));
    const yamlFilename = `${moduleBasename}.libraries.yml`;
    const yamlFilepath = `${modulePathname}/${yamlFilename}`;
    const libraryName = `${this.options.prefix}${moduleBasename}`;

    let libraries = {};
    if (fs.existsSync(yamlFilepath)) {
      try {
        libraries = yaml.safeLoad(fs.readFileSync(yamlFilepath, 'utf8')) || {};
      } catch (e) {
        libraries[libraryName] = {};
      }
    }
    if (!Object.prototype.hasOwnProperty.call(libraries, libraryName)) {
      libraries[libraryName] = {};
    }
    libraries[libraryName].js = {};
    libraries[libraryName].css = { theme: {} };

    compilation.chunks.forEach((chunk) => {
      // Explore each asset filename generated by the chunk.
      chunk.files.forEach((filename) => {
        const extname = path.extname(filename);
        const pathname = path.relative(
          modulePathname,
          path.resolve(compilation.compiler.outputPath, filename)
        );
        switch (extname) {
          case '.js':
            libraries[libraryName].js[pathname] = {
              preprocess: false,
            };
            break;

          case '.css':
            libraries[libraryName].css.theme[pathname] = {
              minified: true,
            };
            break;

          default:
            // None.
            break;
        }
      });
    });

    // Create new file assets.
    // fs.writeFileSync(yamlFilepath, yaml.dump(libraries));
    if (
      !isEmpty(libraries[libraryName].js) ||
      !isEmpty(libraries[libraryName].css.theme)
    ) {
      const content = yaml.dump(libraries);
      const yamlAsset = {
        source() {
          return content;
        },
        size() {
          return content.length;
        },
      };
      compilation.assets[yamlFilename] = yamlAsset;
    }
  }
}

export default DrupalLibrarifyWebpackPlugin;
