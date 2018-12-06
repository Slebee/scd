const path = require("path");
var isDev = process.env.NODE_ENV === "development";
module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "scd",
      externals: {
        react: "React"
      }
    }
  },
  babel: {
    plugins: [
      ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
      // ["@babel/plugin-proposal-decorators", { legacy: true }]
    ]
  },
  webpack: {
    aliases: {
      "@": path.resolve("src")
    },
    rules: {
      less: {
        javascriptEnabled: true,
        cssmodules: true,
        modifyVars: {
          "@primary-color": "#1DA57A"
        }
      }
    }
  }
};
