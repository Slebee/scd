import { css } from "docz-plugin-css";
import doczPluginNetlify from "docz-plugin-netlify";

const changeConfig = config => {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": "src"
  };

  return config;
};

const babelConfig = babelrc => {
  babelrc.plugins.push([
    "import",
    { libraryName: "antd", libraryDirectory: "es", style: true }
  ]);
  babelrc.plugins.push(["@babel/plugin-proposal-decorators", { legacy: true }]);
  return babelrc;
};

export default {
  title: "ServingCloud",
  modifyBundlerConfig: changeConfig,
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
    }),
    doczPluginNetlify()
  ]
};
