# 云函数（分享功能后端）

三个函数，职责与旧 Next.js server 完全一致，只是搬进了微信云开发：

| 函数 | 作用 |
| --- | --- |
| `createShare` | 存一条密文分享（自动建 `shares` 集合），返回 32 位 hex id |
| `getShare` | 按 id 取密文；已撤销/过期一律返回 `gone` |
| `revokeShare` | 用 revokeToken 的 sha256 校验后撤销，幂等 |

服务器只存 `{iv, ciphertext, expiresAt, revokeTokenHash}`，明文和解密钥匙都不上云。

## 首次部署（一次性）

1. 微信开发者工具 → 顶部「云开发」→ 开通环境（个人基础套餐即可），拿到**环境 ID**
2. 把环境 ID 填进 `src/lib/share/cloud.ts` 的 `CLOUD_ENV_ID`
3. 开发者工具左侧资源管理器会出现 `cloud/functions` 目录 → 右键每个函数 →「上传并部署：云端安装依赖」
4. 重新编译小程序，分享页即可用

## 日常

- 改了云函数后重新「上传并部署」即可，无需重启环境
- 过期数据不会自动删除（读取时已挡住）；想清理可在云开发控制台给 `shares` 集合建 TTL 索引（`expiresAt`，秒级时间戳字段需另存）
