export const themes = [
  { id: "zinc", name: "Zinc", description: "Neutral gray and Geist" },
  { id: "editorial", name: "Editorial", description: "Warm neutrals and serif headings" },
  { id: "technical", name: "Technical", description: "Dark graphite with mint accents" },
] as const;

export type Theme = (typeof themes)[number]["id"];
export const themeStorageKey = "folidock.theme";

export function isTheme(value: unknown): value is Theme {
  return themes.some(({ id }) => id === value);
}
