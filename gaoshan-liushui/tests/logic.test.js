/* ============================================================
   高山流水 · 核心逻辑单元测试（Node 直跑：node tests/logic.test.js）
   ============================================================ */
const { buildRounds, decideResult, createSession } = require("../js/engine.js");
const { QUOTES } = require("../js/data/quotes.js");
const { PERSONAS } = require("../js/data/personas.js");

let failed = 0, passed = 0;
function assert(cond, msg) {
  if (cond) { passed++; console.log("  PASS:", msg); }
  else { failed++; console.error("  FAIL:", msg); }
}

console.log("== 1. 题目组生成 ==");
const rounds = buildRounds(QUOTES, 5, 6);
assert(rounds.length === 5, "生成 5 轮");
assert(rounds.every(r => r.length === 6), "每轮 6 句");
const used = new Set(rounds.flat().map(q => q.id));
assert(used.size === 30, "5 轮全局不重复（30 句不重复）");

console.log("== 2. 计分与常规人格匹配 ==");
const s = createSession(QUOTES, PERSONAS);
rounds.forEach((r, i) => s.pick(i, r[0].id)); // 每轮选第 1 句
const rid = s.result();
assert(PERSONAS.some(p => p.id === rid && !p.hidden), "结果必须是常规人格之一，实际=" + rid);

console.log("== 3. 权重累加正确性 ==");
const s2 = createSession(QUOTES, PERSONAS, { rounds: 2, per: 2 });
const qA = QUOTES.find(q => q.id === "q013"); // libai:3, sushi:2
const qB = QUOTES.find(q => q.id === "q022"); // libai:3, zhuangzi:2
const sco = { libai: 0, sushi: 0, zhuangzi: 0 };
Object.keys(qA.weights).forEach(k => (sco[k] = (sco[k] || 0) + qA.weights[k]));
Object.keys(qB.weights).forEach(k => (sco[k] = (sco[k] || 0) + qB.weights[k]));
assert(sco.libai === 6, "libai 累计 6 分");
assert(sco.sushi === 2, "sushi 累计 2 分");

console.log("== 4. 隐藏人格彩蛋（选中 2 句老子金句 → 老子） ==");
const laoziQuotes = QUOTES.filter(q => (q.weights || {}).laozi);
assert(laoziQuotes.length >= 2, "老子金句至少 2 句");
const scoresL = { laozi: 6 };
const resL = decideResult([laoziQuotes[0], laoziQuotes[1]], scoresL, PERSONAS);
assert(resL === "laozi", "触发老子隐藏卡，实际=" + resL);

console.log("== 5. 双隐藏触发取高分者 ==");
const kongziQuotes = QUOTES.filter(q => (q.weights || {}).kongzi);
const scoresK = { laozi: 6, kongzi: 9 };
const resK = decideResult([kongziQuotes[0], kongziQuotes[1], laoziQuotes[0], laoziQuotes[1]], scoresK, PERSONAS);
assert(resK === "kongzi", "孔子得分更高则胜出，实际=" + resK);

console.log("== 6. 未触发隐藏时走常规最高分 ==");
const resR = decideResult([], { sushi: 9, libai: 6 }, PERSONAS);
assert(resR === "sushi", "常规最高分胜出，实际=" + resR);

console.log("== 7. 同分按顺序取先（boya 在数组最前） ==");
const resT = decideResult([], { boya: 3, zhongziqi: 3 }, PERSONAS);
assert(resT === "boya", "同分取先，实际=" + resT);

console.log("== 8. 数据完整性 ==");
assert(QUOTES.length >= 30, "金句 >= 30 句，实际 " + QUOTES.length);
assert(PERSONAS.length === 14, "人格卡 14 张（12+2），实际 " + PERSONAS.length);
const hidden = PERSONAS.filter(p => p.hidden);
assert(hidden.length === 2, "隐藏卡 2 张");
const badW = QUOTES.filter(q => {
  const ids = Object.keys(q.weights || {});
  return ids.length === 0 || ids.some(pid => !PERSONAS.some(p => p.id === pid));
});
assert(badW.length === 0, "所有金句权重指向有效人格");

console.log("\n结果: " + passed + " 通过, " + failed + " 失败");
process.exit(failed ? 1 : 0);
