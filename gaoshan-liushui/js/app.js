/* ============================================================
   高山流水 · 主控（视图路由 / 测试流程 / 事件绑定 / 埋点）
   ============================================================ */

(function () {
  "use strict";

  var state = { view: "home", session: null, roundIdx: 0, persona: null, picks: [] };
  var ROUNDS = 5, PER = 6;

  /* ---------- 埋点（v1 localStorage 计数，匿名） ---------- */
  function track(key) {
    try {
      var k = "gsls_" + key;
      localStorage.setItem(k, String((parseInt(localStorage.getItem(k), 10) || 0) + 1));
    } catch (e) { /* 忽略 */ }
  }

  /* ---------- 视图路由 ---------- */
  function showView(name) {
    state.view = name;
    ["home", "test", "result", "quote"].forEach(function (v) {
      var el = document.getElementById("view-" + v);
      if (el) el.classList.toggle("active", v === name);
    });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------- 首页 ---------- */
  function startTest() {
    state.session = createSession(QUOTES, PERSONAS, { rounds: ROUNDS, per: PER });
    state.roundIdx = 0;
    state.picks = [];
    track("test_start");
    renderRound();
    showView("test");
  }

  function renderRound() {
    var round = state.session.rounds[state.roundIdx];
    var fill = document.getElementById("progress-fill");
    var label = document.getElementById("round-label");
    fill.style.width = ((state.roundIdx + 1) / ROUNDS * 100) + "%";
    label.textContent = "第 " + (state.roundIdx + 1) + " / " + ROUNDS + " 轮";

    var list = document.getElementById("card-list");
    list.innerHTML = "";
    round.forEach(function (q, i) {
      var card = document.createElement("div");
      card.className = "quote-card";
      card.style.animationDelay = (i * 0.06) + "s";
      card.innerHTML = '<div class="qc-text">' + q.text + '</div><div class="qc-author">——' + q.author + "</div>";
      card.addEventListener("click", function () {
        card.classList.add("picking");
        setTimeout(function () { onPick(q.id); }, 380);
      });
      list.appendChild(card);
    });
  }

  function onPick(quoteId) {
    state.session.pick(state.roundIdx, quoteId);
    state.roundIdx++;
    if (state.roundIdx >= state.session.rounds.length) {
      finish();
    } else {
      renderRound();
    }
  }

  function finish() {
    var pid = state.session.result();
    state.persona = PERSONAS.find(function (p) { return p.id === pid; });
    state.picks = state.session.getPicks();
    track("test_complete");
    track("persona_" + pid);
    showResult(state.persona, state.picks);
  }

  /* ---------- 结果页 ---------- */
  function showResult(persona, picks) {
    renderResult(persona, picks);
    var debugRow = document.getElementById("debug-row");
    if (debugRow) debugRow.style.display = getParam("debug") ? "block" : "none";
    showView("result");
  }

  /* ---------- 海报 & 分享 ---------- */
  function siteUrl() {
    return location.origin + location.pathname.replace(/\/$/, "");
  }

  function openPoster(persona) {
    var canvas = renderPoster(persona, siteUrl());
    var img = document.getElementById("poster-img");
    img.src = canvas.toDataURL("image/png");
    var dl = document.getElementById("poster-download");
    dl.href = img.src;
    document.getElementById("poster-modal").classList.add("open");
    track("poster");
  }

  function shareResult(persona) {
    track("share");
    var canvas = renderPoster(persona, siteUrl());
    canvas.toBlob(function (blob) {
      var file = new File([blob], "gaoshan-liushui.png", { type: "image/png" });
      var nav = navigator;
      if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
        nav.share({
          title: "高山流水 · 遇知音",
          text: "我测出了我的灵魂知音是「" + persona.name + "·" + persona.title + "」" + persona.quote + "，你也来测测？",
          files: [file]
        }).catch(function () { /* 用户取消 */ });
      } else {
        // 降级：弹出海报
        openPoster(persona);
      }
    }, "image/png");
  }

  /* ---------- 每日一签 ---------- */
  function openQuote() {
    showView("quote");
    track("quote_open");
    loadQuote();
  }

  function loadQuote() {
    var textEl = document.getElementById("quote-text");
    var authEl = document.getElementById("quote-author");
    textEl.textContent = "正在求签…";
    authEl.textContent = "";
    fetchDailyQuote().then(function (q) {
      textEl.textContent = q.text;
      authEl.textContent = q.author ? "—— " + q.author : "";
    });
  }

  function shareQuote() {
    track("quote_share");
    var text = document.getElementById("quote-text").textContent;
    var author = document.getElementById("quote-author").textContent;
    var nav = navigator;
    if (nav.share) {
      nav.share({ title: "高山流水 · 今日一签", text: text + " " + author + " ——来自「高山流水」" });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text + " " + author;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); alert("已复制：" + text); } catch (e) { /* 忽略 */ }
      ta.remove();
    }
  }

  /* ---------- 工具 ---------- */
  function getParam(name) {
    return new URLSearchParams(location.search).get(name) === "1";
  }

  /* ---------- 事件绑定 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-start").addEventListener("click", startTest);
    document.getElementById("btn-quote-home").addEventListener("click", openQuote);
    document.getElementById("btn-quote-back").addEventListener("click", function () { showView("home"); });
    document.getElementById("btn-quote-refresh").addEventListener("click", loadQuote);
    document.getElementById("btn-quote-share").addEventListener("click", shareQuote);
    document.getElementById("btn-test-home").addEventListener("click", function () { showView("home"); });
    document.getElementById("btn-skip").addEventListener("click", function () {
      var round = state.session.rounds[state.roundIdx];
      var rand = round[Math.floor(Math.random() * round.length)];
      onPick(rand.id);
    });
    document.getElementById("btn-poster").addEventListener("click", function () { openPoster(state.persona); });
    document.getElementById("btn-share").addEventListener("click", function () { shareResult(state.persona); });
    document.getElementById("btn-retest").addEventListener("click", startTest);
    document.getElementById("poster-close").addEventListener("click", function () {
      document.getElementById("poster-modal").classList.remove("open");
    });
    document.getElementById("btn-debug-all").addEventListener("click", renderAllPersonas);
  });
})();
