import { fields, singleton, type ComponentSchema } from "@keystatic/core";
import { requiredText } from "./editor-fields";
import { pageDefinitions, type PageField } from "./page-fields";

const tokenHelp = "Plain text. You can use {practiceName}, {providerName}, {providerFirstName}, {minimumAge}, or {serviceArea} to keep details in sync with Practice and Provider. Save updates the website after the next deployment.";

function editorField(field: PageField): ComponentSchema {
  if (field.kind === "text") {
    return requiredText(field.label, field.max, {
      description: tokenHelp,
      multiline: field.multiline,
    });
  }
  if (field.kind === "array") {
    return fields.array(editorField(field.item), {
      label: field.label,
      description: `Add, remove, or drag rows to reorder them. Keep ${field.min}–${field.max} rows.`,
      validation: { length: { min: field.min, max: field.max } },
    });
  }
  return fields.object(editorSchema(field.fields), { label: field.label });
}

function editorSchema(schema: Record<string, PageField>) {
  return Object.fromEntries(Object.entries(schema).map(([key, field]) => [key, editorField(field)]));
}

function pageSingleton(name: keyof typeof pageDefinitions) {
  const definition = pageDefinitions[name];
  return singleton({
    label: definition.label,
    path: `src/content/data/page-${name}`,
    format: { data: "json" },
    schema: editorSchema(definition.fields),
  });
}

export const pageSingletons = {
  homePage: pageSingleton("home"),
  aboutPage: pageSingleton("about"),
  servicesPage: pageSingleton("services"),
  howItWorksPage: pageSingleton("howItWorks"),
  contactPage: pageSingleton("contact"),
};
