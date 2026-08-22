/* ============================================================
   高山流水 · 核心引擎（选句 / 计分 / 人格匹配 / 隐藏卡）
   纯逻辑，无 DOM 依赖，可在 Node 中单测（module.exports 守卫）
   ============================================================ */

/** Fisher-Yates 洗牌（原地） */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 生成 N 轮 × 每轮 M 句的题目组（全局不重复）
 */
function buildRounds(quotes, rounds, per) {
  const pool = shuffle(quotes);
  const result = [];
  for (let i = 0; i < rounds; i++) {
    result.push(pool.splice(0, per));
  }
  return result;
}

/**
 * 隐藏卡判定（纯函数）：
 * 统计用户选中的金句里，哪些包含隐藏人格权重且命中 >=2 次
 * 命中隐藏卡 → 隐藏人格直接胜出（彩蛋），取隐藏中得分最高者
 * 未命中 → 常规人格中得分最高者（同分按 personas 数组顺序取先）
 */
function decideResult(picks, scores, personas) {
  const hidden = personas.filter(p => p.hidden);
  const hitCount = {};
  hidden.forEach(p => (hitCount[p.id] = 0));
  picks.forEach(q => {
    Object.keys(q.weights || {}).forEach(pid => {
      if (hitCount[pid] !== undefined) hitCount[pid]++;
    });
  });
  const triggered = hidden.filter(p => hitCount[p.id] >= 2);
  if (triggered.length) {
    let best = triggered[0];
    triggered.forEach(p => {
      if ((scores[p.id] || 0) > (scores[best.id] || 0)) best = p;
    });
    return best.id;
  }
  let bestId = null, bestScore = -1;
  personas.forEach(p => {
    if (p.hidden) return;
    const s = scores[p.id] || 0;
    if (s > bestScore) { bestScore = s; bestId = p.id; }
  });
  return bestId;
}

/**
 * 创建一次测试会话
 */
function createSession(quotes, personas, opts) {
  opts = opts || {};
  const rounds = buildRounds(quotes, opts.rounds || 5, opts.per || 6);
  const picks = [];
  const scores = {};
  personas.forEach(p => (scores[p.id] = 0));
  return {
    rounds,
    pick(roundIdx, quoteId) {
      const round = rounds[roundIdx];
      if (!round) return;
      const q = round.find(x => x.id === quoteId);
      if (!q) return;
      picks.push(q);
      Object.keys(q.weights || {}).forEach(pid => {
        scores[pid] = (scores[pid] || 0) + (q.weights[pid] || 0);
      });
    },
    getPicks() { return picks.slice(); },
    getScores() { return Object.assign({}, scores); },
    result() { return decideResult(picks, scores, personas); }
  };
}

if (typeof module !== "undefined") module.exports = { shuffle, buildRounds, decideResult, createSession };
