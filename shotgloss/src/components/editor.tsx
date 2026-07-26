"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toPng, toBlob } from "html-to-image";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The whole product: a styled DOM node rendered to PNG in the browser.
// Nothing is uploaded anywhere.

const BACKGROUNDS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
  "linear-gradient(160deg, #0f172a 0%, #334155 100%)",
  "#f4f4f5",
  "#18181b",
  "#ffffff",
];

const SIZE_PRESETS = [
  { name: "Auto", aspect: null },
  { name: "16:9", aspect: 16 / 9 },
  { name: "OG", aspect: 1.91 },
  { name: "Square", aspect: 1 },
  { name: "4:5", aspect: 4 / 5 },
] as const;

const SHADOWS = {
  none: "none",
  soft: "0 12px 32px rgba(0,0,0,0.25)",
  heavy: "0 24px 64px rgba(0,0,0,0.45)",
} as const;

const PLACEHOLDER_CODE = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("world");`;

// Preview node is a fixed 640px wide; exports multiply with pixelRatio,
// so scale 2 → 1280px, etc. (base 640 × 2 = 1x public size of 1280).
const PREVIEW_WIDTH = 640;

export function Editor({
  isLoggedIn,
  isPro,
  maxExportScale,
  watermark,
}: {
  isLoggedIn: boolean;
  isPro: boolean;
  maxExportScale: number;
  watermark: boolean;
}) {
  const [mode, setMode] = useState<"screenshot" | "code">("screenshot");
  const [image, setImage] = useState<string | null>(null);
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [padding, setPadding] = useState(48);
  const [radius, setRadius] = useState(12);
  const [shadow, setShadow] = useState<keyof typeof SHADOWS>("soft");
  const [chrome, setChrome] = useState(true);
  const [aspect, setAspect] = useState<number | null>(null);
  const [exportScale, setExportScale] = useState(2); // ×640 → 1280px
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
    setMode("screenshot");
  }, []);

  // Paste a screenshot anywhere on the page.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      const file = item?.getAsFile();
      if (file) loadFile(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadFile]);

  const highlighted = useMemo(
    () => hljs.highlightAuto(code || " ").value,
    [code]
  );

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 2500);
  };

  const capture = async () => {
    const node = captureRef.current;
    if (!node) return null;
    // cacheBust avoids stale-image issues; fonts are embedded automatically.
    return toPng(node, { pixelRatio: exportScale, cacheBust: true });
  };

  const download = async () => {
    setBusy(true);
    try {
      const dataUrl = await capture();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.download = "shotgloss.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async () => {
    const node = captureRef.current;
    if (!node) return;
    setBusy(true);
    try {
      const blob = await toBlob(node, { pixelRatio: exportScale, cacheBust: true });
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      flash("Copied to clipboard");
    } catch {
      flash("Copy failed — try Download instead");
    } finally {
      setBusy(false);
    }
  };

  const frameHeight = aspect ? PREVIEW_WIDTH / aspect : undefined;

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-bold tracking-tight">
            ShotGloss
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {isPro ? (
              <Link href="/account" className="text-zinc-600 hover:text-zinc-900">
                Account
              </Link>
            ) : (
              <>
                <Link
                  href={isLoggedIn ? "/account" : "/signup"}
                  className="rounded-md bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-700"
                >
                  Upgrade — no watermark
                </Link>
                {!isLoggedIn && (
                  <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
                    Log in
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[1fr_280px]">
        {/* Canvas */}
        <div className="overflow-x-auto">
          <div
            ref={captureRef}
            className="relative flex items-center justify-center"
            style={{
              width: PREVIEW_WIDTH,
              height: frameHeight,
              padding,
              background,
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file?.type.startsWith("image/")) loadFile(file);
            }}
          >
            <div
              className="max-w-full overflow-hidden"
              style={{ borderRadius: radius, boxShadow: SHADOWS[shadow] }}
            >
              {chrome && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5",
                    mode === "code" ? "bg-[#161b22]" : "bg-zinc-800"
                  )}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
              )}

              {mode === "screenshot" ? (
                image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Your screenshot"
                    className="block max-w-full"
                    style={{ maxHeight: frameHeight ? frameHeight - padding * 2 - 40 : 600 }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-48 w-96 max-w-full flex-col items-center justify-center gap-2 bg-white/90 text-sm text-zinc-500"
                  >
                    <span className="font-medium text-zinc-700">
                      Paste (Ctrl+V), drop, or click to upload
                    </span>
                    <span>PNG · JPG · anything from your clipboard</span>
                  </button>
                )
              ) : (
                <pre className="max-w-full overflow-hidden bg-[#0d1117] p-5 font-mono text-[13px] leading-6 text-zinc-100">
                  <code
                    className="hljs !bg-transparent !p-0"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                </pre>
              )}
            </div>

            {watermark && (
              <span className="absolute bottom-2 right-3 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
                shotgloss.com
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <aside className="space-y-5">
          <Section label="Mode">
            <div className="grid grid-cols-2 gap-2">
              <Chip active={mode === "screenshot"} onClick={() => setMode("screenshot")}>
                Screenshot
              </Chip>
              <Chip active={mode === "code"} onClick={() => setMode("code")}>
                Code
              </Chip>
            </div>
            {mode === "screenshot" ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) loadFile(file);
                  }}
                />
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="mt-2 text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-900"
                  >
                    Remove image
                  </button>
                )}
              </>
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="mt-2 w-full rounded-md border border-zinc-300 bg-white p-2 font-mono text-xs focus:border-zinc-500 focus:outline-none"
                placeholder="Paste your code here"
              />
            )}
          </Section>

          <Section label="Background">
            <div className="grid grid-cols-6 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  aria-label="Background option"
                  onClick={() => setBackground(bg)}
                  className={cn(
                    "h-8 rounded-md border",
                    background === bg
                      ? "border-zinc-900 ring-2 ring-zinc-900/20"
                      : "border-zinc-200"
                  )}
                  style={{ background: bg }}
                />
              ))}
            </div>
          </Section>

          <Section label={`Padding — ${padding}px`}>
            <input
              type="range"
              min={16}
              max={112}
              step={8}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </Section>

          <Section label={`Corner radius — ${radius}px`}>
            <input
              type="range"
              min={0}
              max={24}
              step={2}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </Section>

          <Section label="Shadow">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(SHADOWS) as Array<keyof typeof SHADOWS>).map((s) => (
                <Chip key={s} active={shadow === s} onClick={() => setShadow(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </Section>

          <Section label="Window bar">
            <div className="grid grid-cols-2 gap-2">
              <Chip active={chrome} onClick={() => setChrome(true)}>
                macOS
              </Chip>
              <Chip active={!chrome} onClick={() => setChrome(false)}>
                None
              </Chip>
            </div>
          </Section>

          <Section label="Canvas size">
            <div className="grid grid-cols-5 gap-2">
              {SIZE_PRESETS.map((p) => (
                <Chip
                  key={p.name}
                  active={aspect === p.aspect}
                  onClick={() => setAspect(p.aspect)}
                >
                  {p.name}
                </Chip>
              ))}
            </div>
          </Section>

          <Section label="Export size">
            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 2, label: "1280px" },
                { scale: 4, label: "2560px" },
                { scale: 6, label: "3840px" },
              ].map((option) => {
                // pixelRatio 2 on the 640px preview = the plan's "1x" (1280px).
                const locked = option.scale / 2 > maxExportScale;
                return (
                  <Chip
                    key={option.scale}
                    active={exportScale === option.scale}
                    onClick={() => {
                      if (locked) {
                        flash("Hi-res export is a Pro feature");
                        return;
                      }
                      setExportScale(option.scale);
                    }}
                    className={locked ? "opacity-50" : undefined}
                  >
                    {option.label}
                    {locked ? " 🔒" : ""}
                  </Chip>
                );
              })}
            </div>
            {!isPro && (
              <p className="mt-2 text-xs text-zinc-500">
                <Link
                  href={isLoggedIn ? "/account" : "/signup"}
                  className="underline underline-offset-2"
                >
                  Go Pro
                </Link>{" "}
                for hi-res exports and no watermark.
              </p>
            )}
          </Section>

          <div className="space-y-2 border-t border-zinc-200 pt-5">
            <Button className="w-full" onClick={download} disabled={busy}>
              {busy ? "Rendering…" : "Download PNG"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={copyToClipboard}
              disabled={busy}
            >
              Copy to clipboard
            </Button>
            {notice && (
              <p className="text-center text-xs font-medium text-zinc-600">
                {notice}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500",
        className
      )}
    >
      {children}
    </button>
  );
}
