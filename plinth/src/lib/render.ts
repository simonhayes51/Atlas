import { backgroundPreset, fontPairing, type DevicePreset } from "@/lib/devices";

export type Frame = {
  id: string;
  screenshot: string | null;
  backgroundId: string;
  fontPairingId: string;
  textColor: "ink" | "paper";
  locales: Record<string, { headline: string; subheadline: string }>;
};

export function blankFrame(id: string): Frame {
  return {
    id,
    screenshot: null,
    backgroundId: "dusk",
    fontPairingId: "gallery",
    textColor: "paper",
    locales: { en: { headline: "Your headline here", subheadline: "A short supporting line" } },
  };
}

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Couldn't load image."));
    img.src = src;
  });
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawBezel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  screenshot: HTMLImageElement | null,
  bezel: DevicePreset["bezel"]
) {
  const frameThickness = w * 0.024;
  const outerRadius = w * 0.1;
  const innerRadius = outerRadius * 0.8;

  ctx.save();
  roundedRectPath(ctx, x, y, w, h, outerRadius);
  ctx.fillStyle = "#141014";
  ctx.fill();

  const ix = x + frameThickness;
  const iy = y + frameThickness;
  const iw = w - frameThickness * 2;
  const ih = h - frameThickness * 2;

  ctx.save();
  roundedRectPath(ctx, ix, iy, iw, ih, innerRadius);
  ctx.clip();
  if (screenshot) {
    drawCoverImage(ctx, screenshot, ix, iy, iw, ih);
  } else {
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(ix, iy, iw, ih);
    ctx.strokeStyle = "#4a4a4a";
    ctx.setLineDash([iw * 0.02, iw * 0.02]);
    ctx.lineWidth = iw * 0.006;
    ctx.strokeRect(ix + iw * 0.05, iy + ih * 0.05, iw * 0.9, ih * 0.9);
    ctx.fillStyle = "#8a8a8a";
    ctx.font = `${iw * 0.045}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Drop a screenshot", ix + iw / 2, iy + ih / 2);
  }
  ctx.restore();

  ctx.fillStyle = "#141014";
  if (bezel === "island") {
    const pw = iw * 0.28;
    const ph = iw * 0.075;
    roundedRectPath(ctx, ix + (iw - pw) / 2, iy + iw * 0.04, pw, ph, ph / 2);
    ctx.fill();
  } else if (bezel === "notch") {
    const nw = iw * 0.46;
    const nh = iw * 0.085;
    roundedRectPath(ctx, ix + (iw - nw) / 2, iy, nw, nh, nh / 2);
    ctx.fill();
  } else if (bezel === "punchhole") {
    ctx.beginPath();
    ctx.arc(ix + iw / 2, iy + iw * 0.035, iw * 0.018, 0, Math.PI * 2);
    ctx.fill();
  } else if (bezel === "camera") {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + frameThickness / 2, w * 0.006, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export async function renderFrame(
  canvas: HTMLCanvasElement,
  opts: {
    frame: Frame;
    device: DevicePreset;
    locale: string;
    watermark: boolean;
  }
): Promise<void> {
  const { frame, device, locale, watermark } = opts;
  canvas.width = device.width;
  canvas.height = device.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = backgroundPreset(frame.backgroundId);
  if (bg.kind === "solid") {
    ctx.fillStyle = bg.colors[0];
    ctx.fillRect(0, 0, device.width, device.height);
  } else {
    const angle = ((bg.angle ?? 180) * Math.PI) / 180;
    const x1 = device.width / 2 - (Math.sin(angle) * device.width) / 2;
    const y1 = device.height / 2 + (Math.cos(angle) * device.height) / 2;
    const x2 = device.width / 2 + (Math.sin(angle) * device.width) / 2;
    const y2 = device.height / 2 - (Math.cos(angle) * device.height) / 2;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, bg.colors[0]);
    grad.addColorStop(1, bg.colors[1] ?? bg.colors[0]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, device.width, device.height);
  }

  const fonts = fontPairing(frame.fontPairingId);
  const text = frame.locales[locale] ?? Object.values(frame.locales)[0];
  const textColor = frame.textColor === "ink" ? "#1b1712" : "#f3eee3";
  const wide = device.width / device.height > 1.25;

  const padX = device.width * (wide ? 0.09 : 0.08);
  let cursorY = device.height * (wide ? 0.08 : 0.075);

  if (text?.headline) {
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.font = `600 ${device.width * 0.07}px "${fonts.headlineFamily}", serif`;
    const lines = wrapText(ctx, text.headline, device.width - padX * 2);
    const lineHeight = device.width * 0.09;
    for (const line of lines) {
      cursorY += lineHeight;
      ctx.fillText(line, device.width / 2, cursorY);
    }
    cursorY += device.width * 0.026;
  }

  if (text?.subheadline) {
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.82;
    ctx.font = `400 ${device.width * 0.03}px "${fonts.bodyFamily}", sans-serif`;
    const lines = wrapText(ctx, text.subheadline, device.width - padX * 2.4);
    const lineHeight = device.width * 0.041;
    for (const line of lines) {
      cursorY += lineHeight;
      ctx.fillText(line, device.width / 2, cursorY);
    }
    ctx.globalAlpha = 1;
  }

  const screenshot = frame.screenshot ? await loadImage(frame.screenshot).catch(() => null) : null;

  // The device fills whatever room is left below the copy — a short headline
  // means a bigger device, not a dead gap — and bleeds slightly past the
  // bottom edge on portrait devices for a larger-than-frame, dynamic feel.
  const gap = device.height * 0.045;
  const bezelTop = cursorY + gap;
  const bleed = device.height * (wide ? 0.02 : 0.045);
  const bezelWidth = device.width * (wide ? 0.76 : 0.86);
  const minBezelHeight = device.height * 0.38;
  const bezelHeight = Math.max(device.height - bezelTop + bleed, minBezelHeight);
  const bezelX = (device.width - bezelWidth) / 2;
  const bezelY = bezelTop;

  drawBezel(ctx, bezelX, bezelY, bezelWidth, bezelHeight, screenshot, device.bezel);

  if (watermark) {
    const label = "Made with Plinth";
    ctx.font = `500 ${device.width * 0.018}px "JetBrains Mono", monospace`;
    ctx.textAlign = "right";
    const padding = device.width * 0.012;
    const metrics = ctx.measureText(label);
    const boxW = metrics.width + padding * 2;
    const boxH = device.width * 0.032;
    const boxX = device.width - device.width * 0.04 - boxW;
    const boxY = device.height - device.height * 0.025 - boxH;
    ctx.fillStyle = "rgba(20,16,12,0.55)";
    roundedRectPath(ctx, boxX, boxY, boxW, boxH, boxH / 2);
    ctx.fill();
    ctx.fillStyle = "#f3eee3";
    ctx.fillText(label, boxX + boxW - padding, boxY + boxH * 0.68);
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Export failed."));
    }, "image/png");
  });
}

export function makeThumbnail(canvas: HTMLCanvasElement, maxWidth = 220): string {
  const scale = maxWidth / canvas.width;
  const out = document.createElement("canvas");
  out.width = maxWidth;
  out.height = canvas.height * scale;
  const ctx = out.getContext("2d");
  if (ctx) ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.6);
}
