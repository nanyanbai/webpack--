# webpack-入门

1. npm init 初始化项目
2. 创建 src/index.js
3. 创建 public/index.html
4. 在根目录下创建 webpack.config.js, 并填入配置
5. 执行 npm install webpack webpack-cli -D
6. 配置 build 命令为 webpack
7. 执行 npm run build 完成打包构建

# 自定义 loader

1. 创建 loader 文件夹
2. 在 loader 文件夹下创建 yb-loader.js
3. 在 yb-loader.js 中编写 loader 逻辑
4. 在 webpack.config.js 中配置 loader
5. 在 src 目录下创建 test.yb 文件

## yb-loader.js 文件

```javascript
//  REG 这个正则表达式，匹配 script 标签中的内容
const REG = /<script>([\s\S]+?)<\/script>/;

module.exports = function (source) {
  console.log("== yb-loader  running ==", source);

  const __source = source.match(REG);
  console.log(__source);

  return (__source && __source[1]) || source;
};
```

## test.yb 文件

```javascript
<script>
  export default {
    a: 1,
    b: 2
  }
</script>
```

## webpack.config.js

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },

      // 解析自定义的 yb 文件
      {
        test: /\.yb$/,
        use: [path.resolve(__dirname, "./loader/yb-loader.js")],
      },
    ],
  },
};
```

## 打包结果

![1739933315575.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b98a87c96ae4423f898a341b8fbecfba~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bKp5p-P:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiOTE5NjY1MDQyMjYwMDYyIn0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1740019721&x-orig-sign=gcM46kY4C4j%2BVNKVaReJSUIYrdE%3D)

# webpack plugin 插件

## 解决什么问题？

- webpack 构建生命周期功能定制问题， webpack 本身就一个构建过程的状态机， 其自身的核心功能也构建在 loader 和 plugin 的基础上

```javascript
const webpack = require("webpack");

// ...
  plugins: [
    new webpack.BannerPlugin({
      banner: "欢迎大家学习前端工程化 webpack",
    }),
  ],
```

### 自定义 plugin

1. 创建 plugin 文件夹
2. 在 plugin 文件夹下创建 FooterPlugin.js
3. 在 FooterPlugin 中编写 plugin 逻辑
4. 在 webpack.config.js 中配置 plugin

## FooterPlugin.js

```javascript
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
```

###  webpack.config.js  添加
```javascript
const webpack = require("webpack");
const FooterPlugin = require("./plugin/FooterPlugin");
// ...

plugins: [
    new webpack.BannerPlugin({
      banner: "欢迎大家学习前端工程化 webpack",
    }),

    new FooterPlugin({
      banner: "FooterPlugin yb webpack",
    }),
  ],
```
