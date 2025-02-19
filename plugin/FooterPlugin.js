const { ConcatSource } = require("webpack-sources");

class FooterPlugin {
  constructor(options) {
    console.log("FooterPlugin ", options);
    this.options = options;
  }

  apply(compiler) {
    console.log("compiler", compiler);
    compiler.hooks.compilation.tap("FooterPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("FooterPlugin", () => {
        const chunks = compilation.chunks;
        for (const chunk of chunks) {
          const files = chunk.files;
          for (const file of files) {
            const comment = `/* ${this.options.banner} */`;
            compilation.updateAsset(
              file,
              (old) => new ConcatSource(old, "\n", comment)
            );
          }
        }
      });
    });
  }
}

module.exports = FooterPlugin;
