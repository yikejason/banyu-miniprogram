// 创建分享：只存密文。服务器永远见不到明文，也不存解密钥匙
// （钥匙在分享卡片的 k 参数里，由微信聊天直接带给收件人）。
const cloud = require("wx-server-sdk");
const crypto = require("crypto");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const MAX_CIPHERTEXT = 16 * 1024; // 分享快照很小，超长即拒绝，防滥用

exports.main = async (event) => {
  const { ciphertext, iv, expiresAt, revokeTokenHash } = event || {};
  if (
    typeof ciphertext !== "string" ||
    !ciphertext ||
    ciphertext.length > MAX_CIPHERTEXT ||
    typeof iv !== "string" ||
    !iv ||
    typeof revokeTokenHash !== "string" ||
    revokeTokenHash.length !== 64 ||
    typeof expiresAt !== "string" ||
    !Number.isFinite(Date.parse(expiresAt)) ||
    Date.parse(expiresAt) <= Date.now()
  ) {
    return { error: "bad_request" };
  }

  // 首次部署时自动建集合（已存在则忽略）
  try {
    await db.createCollection("shares");
  } catch {}

  const id = crypto.randomBytes(16).toString("hex");
  await db.collection("shares").add({
    data: {
      _id: id,
      iv,
      ciphertext,
      expiresAt,
      revokeTokenHash,
      revoked: false,
      createdAt: new Date().toISOString(),
    },
  });
  return { id };
};
