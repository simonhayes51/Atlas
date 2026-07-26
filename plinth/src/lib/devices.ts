// Export presets sized to the dimensions app stores actually require.
// These are the canvas pixel dimensions for the final exported PNG —
// not decorative; getting them wrong means a rejected submission.

export type DevicePreset = {
  id: string;
  label: string;
  store: "App Store" | "Google Play" | "Mac App Store";
  width: number;
  height: number;
  bezel: "notch" | "island" | "punchhole" | "camera" | "none";
  cornerRatio: number; // corner radius as a fraction of the shorter screenshot edge
};

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: "iphone-6.9",
    label: "iPhone 6.9″",
    store: "App Store",
    width: 1320,
    height: 2868,
    bezel: "island",
    cornerRatio: 0.11,
  },
  {
    id: "iphone-6.5",
    label: "iPhone 6.5″",
    store: "App Store",
    width: 1284,
    height: 2778,
    bezel: "island",
    cornerRatio: 0.11,
  },
  {
    id: "iphone-5.5",
    label: "iPhone 5.5″",
    store: "App Store",
    width: 1242,
    height: 2208,
    bezel: "notch",
    cornerRatio: 0,
  },
  {
    id: "ipad-13",
    label: "iPad 13″",
    store: "App Store",
    width: 2064,
    height: 2752,
    bezel: "camera",
    cornerRatio: 0.045,
  },
  {
    id: "mac",
    label: "Mac",
    store: "Mac App Store",
    width: 2880,
    height: 1800,
    bezel: "camera",
    cornerRatio: 0.02,
  },
  {
    id: "android-phone",
    label: "Android Phone",
    store: "Google Play",
    width: 1080,
    height: 1920,
    bezel: "punchhole",
    cornerRatio: 0.07,
  },
  {
    id: "android-tablet",
    label: "Android 7″ Tablet",
    store: "Google Play",
    width: 1200,
    height: 1920,
    bezel: "none",
    cornerRatio: 0.03,
  },
];

export function devicePreset(id: string): DevicePreset {
  return DEVICE_PRESETS.find((d) => d.id === id) ?? DEVICE_PRESETS[0];
}

export const FREE_DEVICE_IDS = ["iphone-6.9"];

export type BackgroundPreset = {
  id: string;
  label: string;
  kind: "solid" | "gradient";
  colors: [string] | [string, string];
  angle?: number;
};

// Curated palette pulled from the brand system (see globals.css) plus a
// handful of neutral options — not the whole 16.7M colour wheel.
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "paper", label: "Paper", kind: "solid", colors: ["#F3EEE3"] },
  { id: "ink", label: "Ink", kind: "solid", colors: ["#1B1712"] },
  { id: "brass", label: "Brass", kind: "solid", colors: ["#B9793A"] },
  { id: "garnet", label: "Garnet", kind: "solid", colors: ["#7A2E3B"] },
  { id: "spruce", label: "Spruce", kind: "solid", colors: ["#2F4438"] },
  {
    id: "dusk",
    label: "Dusk",
    kind: "gradient",
    colors: ["#241E2E", "#7A2E3B"],
    angle: 165,
  },
  {
    id: "kiln",
    label: "Kiln",
    kind: "gradient",
    colors: ["#B9793A", "#7A2E3B"],
    angle: 145,
  },
  {
    id: "moss",
    label: "Moss",
    kind: "gradient",
    colors: ["#2F4438", "#1B1712"],
    angle: 160,
  },
  {
    id: "parchment",
    label: "Parchment",
    kind: "gradient",
    colors: ["#F3EEE3", "#DCCFB2"],
    angle: 180,
  },
];

export function backgroundPreset(id: string): BackgroundPreset {
  return BACKGROUND_PRESETS.find((b) => b.id === id) ?? BACKGROUND_PRESETS[0];
}

export type FontPairing = {
  id: string;
  label: string;
  headlineFamily: string;
  headlineWeight: string;
  bodyFamily: string;
};

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "gallery",
    label: "Gallery",
    headlineFamily: "Fraunces",
    headlineWeight: "600",
    bodyFamily: "Space Grotesk",
  },
  {
    id: "studio",
    label: "Studio",
    headlineFamily: "Space Grotesk",
    headlineWeight: "700",
    bodyFamily: "Space Grotesk",
  },
];

export function fontPairing(id: string): FontPairing {
  return FONT_PAIRINGS.find((f) => f.id === id) ?? FONT_PAIRINGS[0];
}

export const LOCALES = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "ja", label: "日本語" },
  { id: "pt", label: "Português" },
];
