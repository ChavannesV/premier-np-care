import { z } from "zod";
import { formats, type TextFormat } from "./content-rules";

export function requiredText(max: number, format?: TextFormat) {
  const schema = z.string().trim().min(1, "This field is required.").max(max)
    .regex(formats.plainText.regex, formats.plainText.message);
  return format ? schema.regex(format.regex, format.message) : schema;
}

/** Keystatic omits blank optional fields when saving JSON. */
export function optionalText(max: number, format?: TextFormat) {
  return z.string().nullish().transform((value) => value?.trim() || "")
    .pipe(z.union([z.literal(""), requiredText(max, format)]));
}

export function boundedList<T extends z.ZodType>(item: T, min: number, max: number) {
  return z.array(item).min(min).max(max);
}

export function parseContent<T extends z.ZodType>(file: string, schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid website content in src/content/data/${file}.json:\n${z.prettifyError(result.error)}\nFix this file or use /admin, then publish again.`);
  }
  return result.data;
}

/** The editor allows repeated rows; keep the first so lists have stable keys. */
export function uniqueBy<T>(key: (value: T) => string) {
  return (values: T[]) => {
    const seen = new Set<string>();
    return values.filter((value) => {
      const id = key(value).toLocaleLowerCase();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };
}
