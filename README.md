# 伴语星球（微信小程序）

把情绪变成可见的符号，把成长写进只属于自己的加密日记，并在需要时把性情和状态只交给你想让看见的人。

基于 [Taro 4](https://taro.zone/) + React，编译到微信小程序。

## 本地运行

需要 Node.js 22。

```bash
nvm use
npm install --legacy-peer-deps
```

1. 把 `project.config.json` 里的 `appid` 换成你的小程序 AppID。
2. 构建并在微信开发者工具打开本仓库：

```bash
npm run dev:weapp
```

微信开发者工具选择项目目录为本仓库（`miniprogramRoot` 指向 `dist/`）。

## 脚本

```bash
npm run dev:weapp    # 微信小程序开发构建（watch）
npm run build:weapp  # 微信小程序生产构建
```

日记和完整情绪记录只加密保存在本机，不会上传。分享卡片只包含用户授权的性情与状态。
