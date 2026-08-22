/* ============================================================
   高山流水 · 结果页渲染
   ============================================================ */

/** 渲染结果页 */
function renderResult(persona, picks) {
  const card = document.getElementById("p-card");
  card.style.setProperty("--c1", persona.colors[0]);
  card.style.setProperty("--c2", persona.colors[1]);
  card.classList.toggle("hidden", !!persona.hidden);

  const emoji = document.getElementById("p-emoji");
  emoji.style.background = "linear-gradient(135deg, " + persona.colors[0] + ", " + persona.colors[1] + ")";
  document.getElementById("p-emoji").textContent = persona.emoji;
  document.getElementById("p-name").textContent = persona.name;
  document.getElementById("p-title").textContent = persona.title;
  document.getElementById("p-allusion").textContent = persona.allusion;
  document.getElementById("p-quote").textContent = "「" + persona.quote + "」";

  const descBox = document.getElementById("p-desc");
  descBox.innerHTML = "";
  persona.desc.forEach((t, i) => {
    const p = document.createElement("p");
    p.textContent = t;
    p.style.animationDelay = (0.55 + i * 0.12) + "s";
    descBox.appendChild(p);
  });
  const chips = document.createElement("div");
  chips.className = "chips";
  persona.strengths.forEach(s => {
    const c = document.createElement("span");
    c.className = "chip";
    c.textContent = s;
    chips.appendChild(c);
  });
  descBox.appendChild(chips);

  const advice = document.getElementById("p-advice");
  advice.innerHTML = "<b>知音寄语</b><br/>" + persona.advice;

  // 用户的选择痕迹
  const picksBox = document.getElementById("p-picks");
  picksBox.innerHTML = "";
  if (picks && picks.length) {
    const h = document.createElement("h4");
    h.textContent = "你选择的金句";
    picksBox.appendChild(h);
    picks.forEach(q => {
      const div = document.createElement("div");
      div.className = "pick-item";
      div.textContent = "「" + q.text + "」——" + q.author;
      picksBox.appendChild(div);
    });
  }
}

/** 调试模式：列出全部人格卡片用于预览 */
function renderAllPersonas() {
  const box = document.getElementById("p-picks");
  box.innerHTML = "";
  const h = document.createElement("h4");
  h.textContent = "全部人格卡（调试预览）";
  box.appendChild(h);
  PERSONAS.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "btn btn-ghost btn-skip";
    btn.style.margin = "6px";
    btn.textContent = p.emoji + " " + p.name + " · " + p.title + (p.hidden ? "（隐藏）" : "");
    btn.onclick = () => showResult(p, []);
    box.appendChild(btn);
  });
}
