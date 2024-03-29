// https://www.npmjs.com/package/drupal-libraries-webpack-plugin
// above is interesting
import path from 'path';

import fs from 'fs';

import { validate } from 'schema-utils';
import yaml from 'js-yaml';
import merge from 'lodash.merge';

import schema from './options.json';
import isEmpty from './Helpers/isEmpty';

class DrupalLibrarifyWebpackPlugin {
  constructor(opts = {}) {
    const dependencies = DrupalLibrarifyWebpackPlugin.defaultDependencies();
    const options = {
      prefix: 'drupal.',
      version: false,
      header: false,
      minified: 'auto',
      js: {},
      css: {},
      dependencies,
      entries: {},
      ...opts,
    };

    options.dependencies = DrupalLibrarifyWebpackPlugin.mergeDependencies(
      dependencies,
      options.dependencies
    );

    validate(schema, options, {
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

  static defaultDependencies() {
    return {
      'core/jquery': true,
      'core/jquery.once': true,
      'core/drupal': true,
      'core/drupal.form': false,
      'core/drupalSettings': true,
    };
  }

  static initLibraryEntries(source, libraryName) {
    const libraries = source;

    if (!(libraryName in libraries)) {
      libraries[libraryName] = {};
    }

    // Init js and css entry
    libraries[libraryName].js = {};
    libraries[libraryName].css = {
      base: {},
      layout: {},
      component: {},
      state: {},
      theme: {},
    };

    return libraries;
  }

  static normalizeDependencies(dependencies) {
    let result = dependencies;

    if (Array.isArray(result)) {
      const entries = new Map();
      result.forEach((dependency) => entries.set(dependency, true));
      result = Object.fromEntries(entries);
    }

    return result;
  }

  /**
   * Merge dependencies.
   */
  static mergeDependencies(model, dependencies) {
    // Merge
    const result = {
      ...DrupalLibrarifyWebpackPlugin.normalizeDependencies(model),
      ...DrupalLibrarifyWebpackPlugin.normalizeDependencies(dependencies),
    };

    return result;
  }

  /**
   * Filter dependencies.
   */
  static cleanDependencies(dependencies) {
    const result = Object.keys(dependencies).filter((dependency) => {
      return dependencies[dependency];
    });

    return result;
  }

  generateYamlFile(compilation) {
    const modulePathname = path.resolve(process.cwd());
    const moduleBasename = path.basename(path.resolve(process.cwd()));
    const yamlFilename = `${moduleBasename}.libraries.yml`;
    const yamlFilepath = `${modulePathname}/${yamlFilename}`;
    const libraryName = `${this.options.prefix}${moduleBasename}`;

    let libraries = {};

    // Try to load an existing file.
    if (fs.existsSync(yamlFilepath)) {
      try {
        libraries = yaml.load(fs.readFileSync(yamlFilepath, 'utf8')) || {};
      } catch (e) {
        libraries[libraryName] = {};
      }
    }

    // Init library entry
    if (!(libraryName in libraries)) {
      libraries[libraryName] = {};
    }

    // Add version
    if (this.options.version) {
      if (this.options.version === true) {
        const raw =
          fs.readFileSync(`${modulePathname}/package.json`, 'utf8') || '{}';
        const pkg = JSON.parse(raw);
        if (typeof pkg.version !== 'undefined') {
          this.options.version = pkg.version;
        }
      }
      libraries[libraryName].version = this.options.version;
    }

    // Add header
    if (this.options.header) {
      libraries[libraryName].header = this.options.header;
    }

    // Guess minified
    if (this.options.minified === 'auto') {
      this.options.minified = compilation.options.optimization.minimize;
    }

    // Init js and css entry
    libraries = DrupalLibrarifyWebpackPlugin.initLibraryEntries(
      libraries,
      libraryName
    );

    // Append files.
    compilation.chunks.forEach((chunk) => {
      const chunkLibraryName = chunk.name
        ? `${this.options.prefix}${chunk.name}`
        : libraryName;

      // Merge entries and options in order to delete by value.
      const chunkLibraryOptions =
        chunkLibraryName in this.options.entries
          ? merge({}, this.options, this.options.entries[chunkLibraryName])
          : merge({}, this.options);
      delete chunkLibraryOptions.entries;

      chunkLibraryOptions.dependencies =
        DrupalLibrarifyWebpackPlugin.mergeDependencies(
          DrupalLibrarifyWebpackPlugin.defaultDependencies(),
          chunkLibraryOptions.dependencies
        );

      // Only reset new chunk.
      if (chunkLibraryName !== libraryName) {
        libraries = DrupalLibrarifyWebpackPlugin.initLibraryEntries(
          libraries,
          chunkLibraryName
        );
      }

      // Add version
      if ('version' in chunkLibraryOptions) {
        libraries[chunkLibraryName].version = chunkLibraryOptions.version;
      }

      // Explore each asset filename generated by the chunk.
      chunk.files.forEach((filename) => {
        // Discard tmp files...
        if (filename.indexOf('_tmp_copy') === 0) {
          return;
        }

        const extname = path.extname(filename);
        const pathname = path.relative(
          modulePathname,
          path.resolve(compilation.compiler.outputPath, filename)
        );

        let options = {};
        switch (extname) {
          case '.js':
            options = {
              preprocess: false,
            };
            if (typeof chunkLibraryOptions.js[pathname] !== 'undefined') {
              options = {
                ...options,
                ...chunkLibraryOptions.js[pathname],
              };
            }
            libraries[chunkLibraryName].js[pathname] = options;
            break;

          case '.css':
            options = {
              minified: chunkLibraryOptions.minified,
            };
            if (typeof chunkLibraryOptions.css[pathname] !== 'undefined') {
              options = {
                ...options,
                ...chunkLibraryOptions.css[pathname],
              };
            }

            // FIXME
            if (!('theme' in libraries[chunkLibraryName].css)) {
              libraries[chunkLibraryName].css.theme = {};
            }

            libraries[chunkLibraryName].css.theme[pathname] = options;
            break;

          default:
            // None.
            break;
        }
      });

      // Add Dependencies
      libraries[chunkLibraryName].dependencies =
        DrupalLibrarifyWebpackPlugin.cleanDependencies(
          chunkLibraryOptions.dependencies
        );

      // Purge
      if (isEmpty(libraries[chunkLibraryName].js)) {
        delete libraries[chunkLibraryName].js;
      }
      for (const property in libraries[chunkLibraryName].css) {
        if (isEmpty(libraries[chunkLibraryName].css[property])) {
          delete libraries[chunkLibraryName].css[property];
        }
      }
      if (isEmpty(chunkLibraryOptions.dependencies)) {
        delete libraries[chunkLibraryName].dependencies;
      }
    });

    // Create new file assets.
    // we are currently afterEmit so compilation.assets cannot be used.
    if (
      typeof libraries[libraryName].js !== 'undefined' ||
      typeof libraries[libraryName].css !== 'undefined'
    ) {
      fs.writeFileSync(
        yamlFilepath,
        yaml.dump(libraries, {
          noRefs: true,
        })
      );
    }
  }
}

export default DrupalLibrarifyWebpackPlugin;
