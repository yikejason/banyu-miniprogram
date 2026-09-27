import { defineConfig } from "@tarojs/cli";
import path from "node:path";
import devConfig from "./dev";
import prodConfig from "./prod";

export default defineConfig<"webpack5">(async (merge) => {
  const baseConfig = {
    projectName: "banyu-miniprogram",
    date: "2026-9-22",
    designWidth: 750,
    deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: ["@tarojs/plugin-framework-react", "@tarojs/plugin-platform-weapp"],
    alias: {
      "@": path.resolve(__dirname, "..", "src"),
    },
    defineConstants: {},
    copy: { patterns: [], options: {} },
    framework: "react",
    compiler: "webpack5",
    cache: { enable: false },
    mini: {
      // 组件 SCSS 的导入顺序在各页面间不一致，产生的是无害告警，忽略之
      miniCssExtractPluginOption: { ignoreOrder: true },
      postcss: {
        pxtransform: { enable: true, config: {} },
        cssModules: {
          enable: false,
          config: { namingPattern: "module", generateScopedName: "[name]__[local]___[hash:base64:5]" },
        },
      },
      optimizeMainPackage: { enable: true },
    },
    h5: {},
    rn: { appName: "taroDemo", postcss: { cssModules: { enable: false } } },
  };

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV;
  if (process.env.NODE_ENV === "development") return merge({}, baseConfig, devConfig);
  return merge({}, baseConfig, prodConfig);
});
