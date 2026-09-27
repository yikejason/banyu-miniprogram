// 撤销分享：用创建时下发的 revokeToken 换 hash 校验，幂等。
const cloud = require("wx-server-sdk");
const crypto = require("crypto");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { id, revokeToken } = event || {};
  if (typeof id !== "string" || typeof revokeToken !== "string") {
    return { error: "bad_request" };
  }
  let row;
  try {
    row = (await db.collection("shares").doc(id).get()).data;
  } catch {
    return { ok: true }; // 不存在视为已撤销
  }
  if (!row) return { ok: true };

  const hash = crypto.createHash("sha256").update(revokeToken).digest("hex");
  if (hash !== row.revokeTokenHash) return { error: "forbidden" };

  await db.collection("shares").doc(id).update({ data: { revoked: true } });
  return { ok: true };
};
