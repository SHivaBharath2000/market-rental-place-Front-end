/** Backend sometimes returns `code` or `Code`. */
export function isApiSuccess(data) {
  if (!data || typeof data !== "object") return false;
  return data.code === 1 || data.Code === 1;
}
