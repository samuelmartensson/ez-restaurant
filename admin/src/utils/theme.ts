export const getTheme = async (color: string) => {
  const response = await fetch(
    `/api/scrape-theme?color=${color.split("#").at(-1)}`,
  ).then((r) => r.json());

  return response.theme;
};

export const getThemePrimaryFromConfig = (config: string) => {
  const primaryRegex = /--primary:\s*([^;]+)/;
  const match = primaryRegex.exec(config);

  const color = match?.[1]?.trim() ?? "";

  const [h, s, l] = color.split(" ").map((c) => parseInt(c));

  return hslToHex(h, s, l);
};

export function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
