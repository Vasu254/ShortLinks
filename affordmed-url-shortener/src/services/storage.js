const KEY = "am_short_links";

export function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
export function saveAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function upsert(record) {
  const list = loadAll();
  const idx = list.findIndex(x => x.code === record.code);
  if (idx >= 0) list[idx] = record; else list.unshift(record);
  saveAll(list);
  return record;
}
export function getByCode(code) {
  return loadAll().find(x => x.code === code) || null;
}
export function recordClick(code, click) {
  const list = loadAll();
  const idx = list.findIndex(x => x.code === code);
  if (idx < 0) return null;
  list[idx].clicks = list[idx].clicks || [];
  list[idx].clicks.unshift(click);
  saveAll(list);
  return list[idx];
}
export function codeExists(code) {
  return !!getByCode(code);
}
