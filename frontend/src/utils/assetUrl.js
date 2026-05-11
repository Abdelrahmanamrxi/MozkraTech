const backendUrl =
  import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL ?? "";

const normalizeBaseUrl = () => {
  if (!backendUrl) return "";
  let base = backendUrl.replace(/\/+$/, "");
  base = base.replace(/\/api\/v1\/?$/, "");
  return base;
};

export const buildAssetUrl = (path) => {
  if (!path) return "";
  if (/^(https?:\/\/|blob:|data:)/i.test(path)) return path;

  const base = normalizeBaseUrl();
  if (!base) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
