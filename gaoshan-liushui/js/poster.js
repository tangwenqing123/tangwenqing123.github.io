/* ============================================================
   高山流水 · 分享海报生成（Canvas 2D，1080×1440，抖音快手 3:4 兼容）
   ============================================================ */

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * 生成海报 Canvas
 * @param {object} persona 人格卡对象
 * @param {string} url 官网链接（用于二维码）
 * @returns {HTMLCanvasElement}
 */
function renderPoster(persona, url) {
  const W = 1080, H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const c1 = persona.colors[0] || "#3a5a6e";
  const c2 = persona.colors[1] || "#6b8f71";

  // 背景：暖白 + 对角渐变
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#faf6ef");
  bg.addColorStop(1, "#eef2ea");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 装饰圆斑
  const blob1 = ctx.createRadialGradient(880, 120, 20, 880, 120, 320);
  blob1.addColorStop(0, "rgba(107,143,113,.20)");
  blob1.addColorStop(1, "rgba(107,143,113,0)");
  ctx.fillStyle = blob1; ctx.fillRect(0, 0, W, H);
  const blob2 = ctx.createRadialGradient(140, 1280, 20, 140, 1280, 300);
  blob2.addColorStop(0, "rgba(217,185,138,.22)");
  blob2.addColorStop(1, "rgba(217,185,138,0)");
  ctx.fillStyle = blob2; ctx.fillRect(0, 0, W, H);

  // 山形剪影
  ctx.save();
  ctx.globalAlpha = .4;
  ctx.fillStyle = c1;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, 1120);
  ctx.lineTo(220, 900);
  ctx.lineTo(400, 1060);
  ctx.lineTo(620, 820);
  ctx.lineTo(840, 1040);
  ctx.lineTo(1080, 880);
  ctx.lineTo(1080, H);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = .28;
  ctx.fillStyle = c2;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, 1180);
  ctx.lineTo(300, 1000);
  ctx.lineTo(560, 1130);
  ctx.lineTo(780, 960);
  ctx.lineTo(1080, 1100);
  ctx.lineTo(1080, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 顶部品牌
  ctx.textAlign = "center";
  ctx.fillStyle = "#3a5a6e";
  ctx.font = "600 40px 'Songti SC','STSong','SimSun',serif";
  ctx.fillText("高 山 流 水", W / 2, 150);
  ctx.fillStyle = "#8a9488";
  ctx.font = "26px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText("· 遇 知 音 ·", W / 2, 205);

  // 人格卡
  const cw = 860, ch = 520, cx = (W - cw) / 2, cy = 300;
  ctx.save();
  ctx.shadowColor = "rgba(58,90,110,.18)";
  ctx.shadowBlur = 40;
  roundedRect(ctx, cx, cy, cw, ch, 44);
  ctx.fillStyle = "rgba(255,255,255,.86)";
  ctx.fill();
  ctx.restore();
  // 渐变描边
  ctx.save();
  const grad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  grad.addColorStop(0, c1); grad.addColorStop(1, c2);
  ctx.strokeStyle = grad; ctx.lineWidth = 6;
  roundedRect(ctx, cx, cy, cw, ch, 44);
  ctx.stroke();
  ctx.restore();

  // emoji 圆
  const er = 96, ex = W / 2, ey = cy + 150;
  const eg = ctx.createLinearGradient(ex - er, ey - er, ex + er, ey + er);
  eg.addColorStop(0, c1); eg.addColorStop(1, c2);
  ctx.save();
  ctx.shadowColor = "rgba(58,90,110,.30)";
  ctx.shadowBlur = 26;
  ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
  ctx.fillStyle = eg; ctx.fill();
  ctx.restore();
  ctx.font = "96px serif";
  ctx.textBaseline = "middle";
  ctx.fillText(persona.emoji, ex, ey + 6);

  // 名字 + 称号
  ctx.fillStyle = "#3a5a6e";
  ctx.font = "700 84px 'Songti SC','STSong','SimSun',serif";
  ctx.fillText(persona.name, W / 2, cy + 330);
  ctx.fillStyle = c2;
  ctx.font = "600 38px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText(persona.title, W / 2, cy + 400);

  // 专属金句
  ctx.fillStyle = "#2f3a45";
  ctx.font = "42px 'Songti SC','STSong','SimSun',serif";
  const qLines = wrapText(ctx, "「" + persona.quote + "」", cw - 120);
  qLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 930 + i * 62);
  });

  // 底部：链接 + 引导
  ctx.fillStyle = "#8a9488";
  ctx.font = "30px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText("测测你灵魂里的知音", W / 2, 1230);
  ctx.fillStyle = "#7a8694";
  ctx.font = "26px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText(url, W / 2, 1290);

  // 二维码（右侧）—— 有 QRCode 库则绘制
  if (typeof QRCode !== "undefined") {
    try {
      const qrSize = 170, qrX = W - qrSize - 90, qrY = 1170;
      const qrCanvas = document.createElement("canvas");
      new QRCode(qrCanvas, { text: url, width: qrSize, height: qrSize, correctLevel: QRCode.CorrectLevel.M });
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
    } catch (e) { /* 二维码失败不影响海报 */ }
  }

  return canvas;
}
