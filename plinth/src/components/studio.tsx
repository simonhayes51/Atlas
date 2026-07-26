"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  BACKGROUND_PRESETS,
  DEVICE_PRESETS,
  FONT_PAIRINGS,
  FREE_DEVICE_IDS,
  LOCALES,
  devicePreset,
} from "@/lib/devices";
import type { PlanLimits } from "@/lib/plans";
import { blankFrame, canvasToBlob, makeThumbnail, renderFrame, type Frame } from "@/lib/render";
import { cn } from "@/lib/utils";

const ANON_KEY = "plinth-anon-set";
const DRAFT_LOCALE = "en";

type StudioSet = {
  id: string | null;
  name: string;
  frames: Frame[];
};

function freshSet(): StudioSet {
  return { id: null, name: "Untitled set", frames: [blankFrame(crypto.randomUUID())] };
}

export function Studio({
  isLoggedIn,
  plan,
  initialSet,
}: {
  isLoggedIn: boolean;
  plan: PlanLimits;
  initialSet: StudioSet | null;
}) {
  const [set, setSet] = useState<StudioSet>(() => initialSet ?? freshSet());
  const [hydrated, setHydrated] = useState(Boolean(initialSet));
  const [activeIndex, setActiveIndex] = useState(0);
  const [locale, setLocale] = useState(DRAFT_LOCALE);
  const [previewDevice, setPreviewDevice] = useState("iphone-6.9");
  const [exportDevices, setExportDevices] = useState<string[]>(["iphone-6.9"]);
  const [exportLocales, setExportLocales] = useState<string[]>([DRAFT_LOCALE]);
  const [status, setStatus] = useState<{
    kind: "idle" | "saving" | "exporting" | "error" | "saved" | "render-error";
    message?: string;
  }>({
    kind: "idle",
  });
  const [aiOpen, setAiOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load an anonymous draft from localStorage once, if no server-provided set.
  useEffect(() => {
    if (hydrated) return;
    try {
      const raw = window.localStorage.getItem(ANON_KEY);
      if (raw) setSet(JSON.parse(raw));
    } catch {
      // corrupt draft — ignore and start fresh
    }
    setHydrated(true);
  }, [hydrated]);

  // Autosave anonymous drafts locally so a refresh doesn't lose work.
  useEffect(() => {
    if (!hydrated || isLoggedIn) return;
    const timeout = setTimeout(() => {
      window.localStorage.setItem(ANON_KEY, JSON.stringify(set));
    }, 400);
    return () => clearTimeout(timeout);
  }, [set, hydrated, isLoggedIn]);

  const frame = set.frames[activeIndex];
  const device = devicePreset(previewDevice);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !frame) return;
    try {
      await renderFrame(canvas, {
        frame,
        device,
        locale,
        watermark: plan.watermark,
      });
      setStatus((s) => (s.kind === "render-error" ? { kind: "idle" } : s));
    } catch (err) {
      console.error("Preview render failed:", err);
      setStatus({ kind: "render-error" });
    }
  }, [frame, device, locale, plan.watermark]);

  useEffect(() => {
    draw();
  }, [draw]);

  function updateFrame(patch: Partial<Frame>) {
    setSet((s) => ({
      ...s,
      frames: s.frames.map((f, i) => (i === activeIndex ? { ...f, ...patch } : f)),
    }));
  }

  function updateLocaleText(patch: Partial<{ headline: string; subheadline: string }>) {
    setSet((s) => ({
      ...s,
      frames: s.frames.map((f, i) => {
        if (i !== activeIndex) return f;
        const existing = f.locales[locale] ?? { headline: "", subheadline: "" };
        return { ...f, locales: { ...f.locales, [locale]: { ...existing, ...patch } } };
      }),
    }));
  }

  function addFrame() {
    if (set.frames.length >= plan.maxFramesPerSet) {
      setStatus({ kind: "error", message: `Free is capped at ${plan.maxFramesPerSet} frames per set — upgrade for unlimited.` });
      return;
    }
    setSet((s) => ({ ...s, frames: [...s.frames, blankFrame(crypto.randomUUID())] }));
    setActiveIndex(set.frames.length);
  }

  function removeFrame(index: number) {
    if (set.frames.length <= 1) return;
    setSet((s) => ({ ...s, frames: s.frames.filter((_, i) => i !== index) }));
    setActiveIndex((i) => Math.max(0, i === index ? i - 1 : i > index ? i - 1 : i));
  }

  function onUploadScreenshot(file: File) {
    const reader = new FileReader();
    reader.onload = () => updateFrame({ screenshot: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onUploadScreenshot(file);
  }

  function onPaste(e: React.ClipboardEvent) {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (file) onUploadScreenshot(file);
  }

  async function handleSave() {
    if (!isLoggedIn) {
      setStatus({ kind: "error", message: "Create a free account to save sets across sessions." });
      return;
    }
    setStatus({ kind: "saving" });
    const canvas = canvasRef.current;
    const thumbnail = canvas ? makeThumbnail(canvas) : null;
    try {
      const res = await fetch("/api/sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: set.id,
          name: set.name,
          data: JSON.stringify(set.frames),
          thumbnail,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Couldn't save.");
      setSet((s) => ({ ...s, id: body.id }));
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "idle" }), 2000);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't save." });
    }
  }

  async function handleExportCurrentFrame() {
    setStatus({ kind: "exporting" });
    try {
      const canvas = document.createElement("canvas");
      await renderFrame(canvas, { frame, device, locale, watermark: plan.watermark });
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob, `${device.id}-${locale}.png`);
      setStatus({ kind: "idle" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Export failed." });
    }
  }

  async function handleBatchExport() {
    setStatus({ kind: "exporting" });
    try {
      const devices = plan.batchExport ? exportDevices : FREE_DEVICE_IDS;
      const locales = plan.multiLocale ? exportLocales : [DRAFT_LOCALE];
      const frames = plan.maxFramesPerSet === Infinity ? set.frames : set.frames.slice(0, plan.maxFramesPerSet);

      if (devices.length === 0 || locales.length === 0) {
        setStatus({ kind: "error", message: "Pick at least one device and one language to export." });
        return;
      }

      const zip = new JSZip();
      const canvas = document.createElement("canvas");
      for (const loc of locales) {
        for (const devId of devices) {
          const dev = devicePreset(devId);
          for (let i = 0; i < frames.length; i++) {
            await renderFrame(canvas, { frame: frames[i], device: dev, locale: loc, watermark: plan.watermark });
            const blob = await canvasToBlob(canvas);
            zip.file(`${loc}/${devId}-frame-${i + 1}.png`, blob);
          }
        }
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${slugify(set.name)}.zip`);
      setStatus({ kind: "idle" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Export failed." });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">
      <TopBar
        set={set}
        setSet={setSet}
        isLoggedIn={isLoggedIn}
        plan={plan}
        status={status}
        onSave={handleSave}
      />
      <div className="flex flex-1 flex-col lg:flex-row">
        <FrameRail
          set={set}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onAdd={addFrame}
          onRemove={removeFrame}
          maxFrames={plan.maxFramesPerSet}
        />

        <main
          className="flex flex-1 flex-col items-center justify-center gap-6 border-y border-[var(--line)] bg-[var(--paper-raised)] px-6 py-10"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="flex items-center gap-2">
            {DEVICE_PRESETS.map((d) => {
              const locked = !plan.allDevices && !FREE_DEVICE_IDS.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => (locked ? setStatus({ kind: "error", message: "Upgrade to preview every device." }) : setPreviewDevice(d.id))}
                  className={cn(
                    "font-mono rounded-full border px-3 py-1 text-xs transition-colors",
                    previewDevice === d.id
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--line-strong)] text-[var(--muted)] hover:text-[var(--ink)]",
                    locked && "opacity-40"
                  )}
                  aria-pressed={previewDevice === d.id}
                >
                  {d.label}
                  {locked && <LockIcon className="ml-1 inline-block h-2.5 w-2.5 align-[1px]" />}
                </button>
              );
            })}
          </div>

          <div className="max-w-full overflow-hidden rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
            <canvas
              ref={canvasRef}
              className="block h-auto max-h-[62vh] w-auto max-w-full"
              style={{ aspectRatio: `${device.width} / ${device.height}` }}
              tabIndex={0}
              onPaste={onPaste}
              aria-label="Screenshot preview canvas — click and paste an image, or drag one in"
            />
          </div>
          {status.kind === "render-error" && (
            <p className="text-xs text-[var(--terracotta)]">
              Couldn&apos;t render the preview in this browser. Try reloading, or switch browsers if it persists.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Upload screenshot
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadScreenshot(f);
              }}
            />
            <p className="text-xs text-[var(--muted)]">or paste (⌘/Ctrl+V) into the canvas, or drag a file in</p>
          </div>
        </main>

        <ControlPanel
          frame={frame}
          locale={locale}
          setLocale={setLocale}
          plan={plan}
          updateFrame={updateFrame}
          updateLocaleText={updateLocaleText}
          aiOpen={aiOpen}
          setAiOpen={setAiOpen}
          onHeadlineFromAi={(headline, subheadline) => updateLocaleText({ headline, subheadline })}
        />
      </div>

      <ExportBar
        plan={plan}
        exportDevices={exportDevices}
        setExportDevices={setExportDevices}
        exportLocales={exportLocales}
        setExportLocales={setExportLocales}
        status={status}
        onExportOne={handleExportCurrentFrame}
        onExportAll={handleBatchExport}
      />
    </div>
  );
}

function TopBar({
  set,
  setSet,
  isLoggedIn,
  plan,
  status,
  onSave,
}: {
  set: StudioSet;
  setSet: React.Dispatch<React.SetStateAction<StudioSet>>;
  isLoggedIn: boolean;
  plan: PlanLimits;
  status: { kind: string; message?: string };
  onSave: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-[var(--line)] bg-[var(--paper)] px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-display text-base font-semibold tracking-tight">
          Plinth
        </Link>
        <input
          value={set.name}
          onChange={(e) => setSet((s) => ({ ...s, name: e.target.value }))}
          aria-label="Set name"
          className="border-none bg-transparent text-sm font-medium text-[var(--ink-soft)] outline-none focus:text-[var(--ink)]"
        />
        <Badge tone={plan.name === "Pro" ? "brass" : "neutral"}>{plan.name}</Badge>
      </div>
      <div className="flex items-center gap-3">
        {status.kind === "error" && <p className="text-xs text-[var(--terracotta)]">{status.message}</p>}
        {status.kind === "saved" && <p className="text-xs text-[var(--spruce)]">Saved</p>}
        {isLoggedIn ? (
          <>
            <Link href="/history" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
              History
            </Link>
            <Link href="/account" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Account
            </Link>
            <Button size="sm" onClick={onSave} disabled={status.kind === "saving"}>
              {status.kind === "saving" ? "Saving…" : "Save"}
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Log in
            </Link>
            <Link href="/signup">
              <Button size="sm">Save this set</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

function FrameRail({
  set,
  activeIndex,
  onSelect,
  onAdd,
  onRemove,
  maxFrames,
}: {
  set: StudioSet;
  activeIndex: number;
  onSelect: (i: number) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  maxFrames: number;
}) {
  return (
    <aside className="flex shrink-0 gap-3 overflow-x-auto border-b border-[var(--line)] bg-[var(--paper)] p-4 lg:w-56 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
      {set.frames.map((f, i) => (
        <div
          key={f.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(i);
          }}
          className={cn(
            "group relative flex shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-left text-sm lg:w-full",
            i === activeIndex ? "border-[var(--ink)] bg-[var(--paper-raised)]" : "border-[var(--line)] text-[var(--muted)]"
          )}
        >
          <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
          <span className="truncate">{f.locales.en?.headline || "Untitled frame"}</span>
          {set.frames.length > 1 && (
            <button
              type="button"
              aria-label={`Remove frame ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(i);
              }}
              className="ml-auto shrink-0 rounded-full px-1.5 text-[var(--muted)] opacity-0 hover:bg-[var(--line)] group-hover:opacity-100"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="shrink-0 rounded-md border border-dashed border-[var(--line-strong)] px-3 py-2 text-sm text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)] lg:w-full"
      >
        + Add frame ({set.frames.length}/{maxFrames === Infinity ? "∞" : maxFrames})
      </button>
    </aside>
  );
}

function ControlPanel({
  frame,
  locale,
  setLocale,
  plan,
  updateFrame,
  updateLocaleText,
  aiOpen,
  setAiOpen,
  onHeadlineFromAi,
}: {
  frame: Frame;
  locale: string;
  setLocale: (l: string) => void;
  plan: PlanLimits;
  updateFrame: (p: Partial<Frame>) => void;
  updateLocaleText: (p: Partial<{ headline: string; subheadline: string }>) => void;
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  onHeadlineFromAi: (headline: string, subheadline: string) => void;
}) {
  const text = frame.locales[locale] ?? { headline: "", subheadline: "" };

  return (
    <aside className="w-full shrink-0 space-y-6 overflow-y-auto bg-[var(--paper)] p-5 lg:w-80">
      <section>
        <Label>Language</Label>
        <div className="flex flex-wrap gap-2">
          {LOCALES.map((l) => {
            const locked = !plan.multiLocale && l.id !== DRAFT_LOCALE;
            return (
              <button
                key={l.id}
                disabled={locked}
                onClick={() => setLocale(l.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  locale === l.id ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-strong)]",
                  locked && "opacity-40"
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>
        {!plan.multiLocale && <p className="mt-2 text-xs text-[var(--muted)]">Pro unlocks per-language copy.</p>}
      </section>

      <section>
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={text.headline}
          onChange={(e) => updateLocaleText({ headline: e.target.value })}
          maxLength={70}
        />
        <Label htmlFor="subheadline" className="mt-3">
          Subheadline
        </Label>
        <Input
          id="subheadline"
          value={text.subheadline}
          onChange={(e) => updateLocaleText({ subheadline: e.target.value })}
          maxLength={110}
        />
      </section>

      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <Label className="mb-0">Headline Assist</Label>
          {!plan.aiAssist && <Badge tone="brass">Pro</Badge>}
        </div>
        {plan.aiAssist ? (
          <AiAssistPanel appDefaultName={frame.locales.en?.headline ?? ""} onPick={onHeadlineFromAi} open={aiOpen} setOpen={setAiOpen} />
        ) : (
          <p className="text-xs text-[var(--muted)]">Draft three headline angles from your app name with Claude. Upgrade to unlock.</p>
        )}
      </section>

      <section>
        <Label>Background</Label>
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUND_PRESETS.map((b) => (
            <button
              key={b.id}
              onClick={() => updateFrame({ backgroundId: b.id })}
              aria-label={b.label}
              title={b.label}
              className={cn(
                "aspect-square rounded-md border-2",
                frame.backgroundId === b.id ? "border-[var(--brass)]" : "border-transparent"
              )}
              style={{
                background:
                  b.kind === "solid" ? b.colors[0] : `linear-gradient(${b.angle}deg, ${b.colors[0]}, ${b.colors[1]})`,
              }}
            />
          ))}
        </div>
      </section>

      <section>
        <Label>Typography</Label>
        <div className="flex gap-2">
          {FONT_PAIRINGS.map((f) => (
            <button
              key={f.id}
              onClick={() => updateFrame({ fontPairingId: f.id })}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm",
                frame.fontPairingId === f.id ? "border-[var(--ink)]" : "border-[var(--line)] text-[var(--muted)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <Label>Text colour</Label>
        <div className="flex gap-2">
          <button
            onClick={() => updateFrame({ textColor: "paper" })}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm",
              frame.textColor === "paper" ? "border-[var(--ink)]" : "border-[var(--line)] text-[var(--muted)]"
            )}
          >
            Paper
          </button>
          <button
            onClick={() => updateFrame({ textColor: "ink" })}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-sm",
              frame.textColor === "ink" ? "border-[var(--ink)]" : "border-[var(--line)] text-[var(--muted)]"
            )}
          >
            Ink
          </button>
        </div>
      </section>
    </aside>
  );
}

function AiAssistPanel({
  appDefaultName,
  onPick,
  open,
  setOpen,
}: {
  appDefaultName: string;
  onPick: (headline: string, subheadline: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [appName, setAppName] = useState(appDefaultName);
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("confident");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ headline: string; subheadline: string }[] | null>(null);

  async function generate(retryCount = 0): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, appDescription: description, tone }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Headline Assist failed.");
      setOptions(body.options);
    } catch (err) {
      if (retryCount < 1) {
        return generate(retryCount + 1);
      }
      setError(err instanceof Error ? err.message : "Headline Assist failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-md border border-dashed border-[var(--line-strong)] px-3 py-2 text-left text-sm text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
      >
        Draft 3 headline angles with Claude →
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-[var(--line)] bg-[var(--paper-raised)] p-3">
      <Input placeholder="App name" value={appName} onChange={(e) => setAppName(e.target.value)} />
      <Input
        placeholder="One-line description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full rounded-md border border-[var(--line-strong)] bg-[var(--paper-raised)] px-3 py-2 text-sm"
      >
        <option value="confident">Confident</option>
        <option value="playful">Playful</option>
        <option value="minimal">Minimal</option>
        <option value="technical">Technical</option>
      </select>
      <Button size="sm" className="w-full" disabled={loading || !appName || !description} onClick={() => generate()}>
        {loading ? "Thinking…" : "Generate 3 options"}
      </Button>
      {error && <p className="text-xs text-[var(--terracotta)]">{error}</p>}
      {options && (
        <div className="space-y-2 pt-1">
          {options.map((o, i) => (
            <button
              key={i}
              onClick={() => onPick(o.headline, o.subheadline)}
              className="block w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-2 text-left text-xs hover:border-[var(--brass)]"
            >
              <p className="font-medium">{o.headline}</p>
              <p className="text-[var(--muted)]">{o.subheadline}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportBar({
  plan,
  exportDevices,
  setExportDevices,
  exportLocales,
  setExportLocales,
  status,
  onExportOne,
  onExportAll,
}: {
  plan: PlanLimits;
  exportDevices: string[];
  setExportDevices: (d: string[]) => void;
  exportLocales: string[];
  setExportLocales: (l: string[]) => void;
  status: { kind: string; message?: string };
  onExportOne: () => void;
  onExportAll: () => void;
}) {
  function toggle(list: string[], set: (v: string[]) => void, id: string) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  return (
    <footer className="flex flex-col gap-4 border-t border-[var(--line)] bg-[var(--paper)] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        {plan.batchExport ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {DEVICE_PRESETS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggle(exportDevices, setExportDevices, d.id)}
                  className={cn(
                    "font-mono rounded-full border px-2.5 py-1 text-[11px]",
                    exportDevices.includes(d.id) ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-strong)] text-[var(--muted)]"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => toggle(exportLocales, setExportLocales, l.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    exportLocales.includes(l.id) ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--line-strong)] text-[var(--muted)]"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-[var(--muted)]">
            Free exports the iPhone 6.9″ size with a small watermark. Upgrade for every device, every language, batched.
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {status.kind === "exporting" && <p className="text-xs text-[var(--muted)]">Rendering…</p>}
        <Button variant="secondary" size="sm" onClick={onExportOne}>
          Export current frame
        </Button>
        <Button size="sm" onClick={onExportAll} disabled={status.kind === "exporting"}>
          {plan.batchExport ? "Export set (zip)" : "Export set"}
        </Button>
      </div>
    </footer>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="7" width="9" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "plinth-set";
}
