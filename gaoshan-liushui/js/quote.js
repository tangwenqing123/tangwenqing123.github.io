/* ============================================================
   高山流水 · 每日一签（一言免费 API + 本地兜底）
   ============================================================ */

const QUOTE_CACHE_PREFIX = "gsls_quote_";

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function localFallbackQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return { text: q.text, author: q.author };
}

/** 获取今日金句：优先一言 API，缓存当日结果，失败走本地题库 */
async function fetchDailyQuote() {
  const key = QUOTE_CACHE_PREFIX + todayKey();
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch (e) { /* localStorage 不可用时忽略 */ }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch("https://v1.hitokoto.cn/?c=k&charset=utf-8", { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("http " + res.status);
    const d = await res.json();
    const quote = { text: d.hitokoto || "", author: d.from_who || d.from || "" };
    if (!quote.text) throw new Error("empty");
    try { localStorage.setItem(key, JSON.stringify(quote)); } catch (e) { /* 忽略 */ }
    return quote;
  } catch (e) {
    return localFallbackQuote();
  }
}
