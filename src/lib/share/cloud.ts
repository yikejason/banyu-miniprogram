// 分享后端 = 微信云开发云函数（cloud/functions/）。
// 沿用 db.ts 的做法：直接探测 wx.cloud，保持类型收窄，不依赖 Taro 的 cloud 命名空间。

// TODO: 开发者工具「云开发」开通环境后，把环境 ID 填到这里
export const CLOUD_ENV_ID = "test-d8gm8lixa24394dce";

type WxCloud = {
  init(options: { env: string; traceUser?: boolean }): void;
  callFunction(params: {
    name: string;
    data?: Record<string, unknown>;
  }): Promise<{ result: unknown }>;
};

function getCloud(): WxCloud {
  const wx = (globalThis as { wx?: { cloud?: WxCloud } }).wx;
  const c = wx?.cloud;
  if (!c) throw new Error("当前环境不支持云调用");
  return c;
}

let inited = false;

function call<T>(name: string, data: Record<string, unknown>): Promise<T> {
  if (!CLOUD_ENV_ID) {
    throw new Error("未配置云环境：请在 src/lib/share/cloud.ts 填入 CLOUD_ENV_ID");
  }
  const cloud = getCloud();
  if (!inited) {
    cloud.init({ env: CLOUD_ENV_ID, traceUser: true });
    inited = true;
  }
  return cloud.callFunction({ name, data }).then((res) => res.result as T);
}

export function createShareCloud(payload: {
  iv: string;
  ciphertext: string;
  expiresAt: string;
  revokeTokenHash: string;
}): Promise<{ id: string }> {
  const result = call<{ id?: string; error?: string }>("createShare", payload);
  return result.then((res) => {
    if (!res?.id) throw new Error(res?.error ?? "创建失败");
    return { id: res.id };
  });
}

export function getShareCloud(
  id: string,
): Promise<{ iv: string; ciphertext: string }> {
  return call<{ iv?: string; ciphertext?: string; error?: string }>(
    "getShare",
    { id },
  ).then((res) => {
    if (!res?.iv || !res.ciphertext) throw new Error(res?.error ?? "gone");
    return { iv: res.iv, ciphertext: res.ciphertext };
  });
}

export function revokeShareCloud(id: string, revokeToken: string): Promise<void> {
  return call<{ ok?: boolean; error?: string }>("revokeShare", {
    id,
    revokeToken,
  }).then((res) => {
    if (res?.error === "forbidden") throw new Error("forbidden");
    // ok 或 gone 都算撤销成功（幂等）
  });
}
