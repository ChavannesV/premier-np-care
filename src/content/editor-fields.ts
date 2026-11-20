import { fields } from "@keystatic/core";
import { createElement } from "react";
import { formats, imageExtensions, notBlank, optionalFormat, type TextFormat } from "./content-rules";

type TextOptions = { description?: string; multiline?: boolean; format?: TextFormat };

export function requiredText(label: string, max: number, { format, ...options }: TextOptions = {}) {
  return fields.text({ label, ...options, validation: {
    isRequired: true, length: { max }, pattern: format ?? notBlank(label),
  } });
}

export function optionalText(label: string, max: number, { format, ...options }: TextOptions = {}) {
  return fields.text({ label, ...options, validation: {
    length: { max }, pattern: optionalFormat(format ?? formats.plainText),
  } });
}

export function imageField(label: string, directory: string) {
  const field = fields.image({
    label,
    directory: `public/images/uploads/${directory}`,
    publicPath: `/images/uploads/${directory}/`,
    validation: { isRequired: true },
    description: "Upload a JPEG, PNG, WebP, AVIF or GIF. The image is saved with your content in GitHub.",
  });
  const message = "Choose a JPEG, PNG, WebP, AVIF or GIF image before saving.";
  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      const invalid = props.value && !imageExtensions.test(props.value.extension);
      return createElement("div", null,
        createElement(field.Input, props),
        invalid ? createElement("p", { role: "alert", style: { color: "#b42318" } }, message) : null,
      );
    },
    validate(value: Parameters<typeof field.validate>[0]) {
      const validated = field.validate(value);
      if (!imageExtensions.test(validated.extension)) throw new Error(message);
      return validated;
    },
  };
}
