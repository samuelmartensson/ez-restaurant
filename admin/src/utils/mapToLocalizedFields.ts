export const mapToLocalizedFields = <T extends Record<string, T[string]>>(
  languages: string[],
  data: T,
  keys: (keyof T[string])[],
) => {
  return Object.fromEntries(
    languages.map((lang) => [
      lang,
      Object.fromEntries(keys.map((key) => [key, data?.[lang]?.[key]])),
    ]),
  );
};
