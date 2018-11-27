import { css } from "docz-plugin-css";

const changeConfig = config => {
  config.resolve.alias = {
    "@": "src"
  };

  return config;
};

const babelConfig = babelrc => {
  babelrc.plugins.push([
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: true }
  ]);
  return babelrc;
};

export default {
  title: "factoring-pro",
  // modifyBundlerConfig: changeConfig,
  modifyBabelRc: babelConfig,
  // wrapper: "doczWrapper",
  plugins: [
    css({
      preprocessor: "postcss"
    }),
    css({
      preprocessor: "less",
      // cssmodules: true,
      loaderOpts: {
        javascriptEnabled: true,
        /* whatever your preprocessor loader accept */
        modifyVars: {
          "@primary-color": "#1DA57A"
        }
      }
    })
  ]
};
