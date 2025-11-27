import { API_URL } from "./env";
export const safeBaseUrl = () => {
  const env = API_URL;
  if (!env) return '';
  try {
    return env.replace('/api/v2', '').replace(/\/+$/, '');
  } catch {
    return env;
  }
};

export const getFullImageUrl = (path) => {
  if (!path) return null;
  // If an object was passed, try common keys
  if (typeof path === 'object') {
    path = path.imageUrl || path.url || path.path || '';
  }
  if (!path) return null;
  if (typeof path === 'string' && /^https?:\/\//i.test(path)) return path;
  const base = safeBaseUrl();
  return base ? `${base}${path}` : path;

};
