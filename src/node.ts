/** 判断当前环境是否是开发环境 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
