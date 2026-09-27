// 读取分享：只回密文，且仅在未撤销、未过期时可读。
// 拿到密文没有 k 参数里的钥匙也解不开，所以按 id 读取无需鉴权。
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { id } = event || {};
  if (typeof id !== "string" || !/^[0-9a-f]{32}$/.test(id)) {
    return { error: "gone" };
  }
  let row;
  try {
    row = (await db.collection("shares").doc(id).get()).data;
  } catch {
    return { error: "gone" };
  }
  if (!row || row.revoked || Date.parse(row.expiresAt) <= Date.now()) {
    return { error: "gone" };
  }
  return { iv: row.iv, ciphertext: row.ciphertext };
};
