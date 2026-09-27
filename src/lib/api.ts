import Taro from "@tarojs/taro";

// 后端地址：开发用本地 Next.js API，生产替换为 Vercel 部署地址。
// 小程序需在管理后台配置 request 合法域名。
export const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://banyu-server.example.com"
    : "http://localhost:3000";

export async function apiPost(path: string, body: unknown): Promise<any> {
  const res = await Taro.request({
    url: `${API_BASE}${path}`,
    method: "POST",
    header: { "content-type": "application/json" },
    data: body,
  });
  if (res.statusCode >= 400) throw new Error(`请求失败 ${res.statusCode}`);
  return res.data;
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await Taro.request({ url: `${API_BASE}${path}`, method: "GET" });
  if (res.statusCode >= 400) throw new Error(`请求失败 ${res.statusCode}`);
  return res.data as T;
}

export async function apiDelete(path: string, headers: Record<string, string>): Promise<void> {
  const res = await Taro.request({
    url: `${API_BASE}${path}`,
    method: "DELETE",
    header: headers,
  });
  if (res.statusCode >= 400) throw new Error(`请求失败 ${res.statusCode}`);
}
