// babel-preset-taro bundles preset-env / preset-react / preset-typescript with
// Taro-appropriate targets. We only need to enable framework + platform here.
module.exports = {
  presets: [
    ["taro", { framework: "react", ts: true }],
  ],
};
