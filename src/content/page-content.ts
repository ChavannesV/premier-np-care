import "server-only";
import type { Metadata } from "next";
import { z } from "zod";
import { requiredText } from "./content-schema";
import home from "./data/page-home.json";
import about from "./data/page-about.json";
import services from "./data/page-services.json";
import howItWorks from "./data/page-howItWorks.json";
import contact from "./data/page-contact.json";
import { pageDefinitions, type PageField } from "./page-fields";
import { practiceSettings, resolveContentText } from "@/lib/content";

function fieldSchema(field: PageField): z.ZodType {
  if (field.kind === "text") {
    return requiredText(field.max);
  }
  if (field.kind === "array") {
    return z.array(fieldSchema(field.item)).min(field.min).max(field.max);
  }
  return z.strictObject(Object.fromEntries(
    Object.entries(field.fields).map(([key, value]) => [key, fieldSchema(value)]),
  ));
}

function resolveTokens<T>(value: T): T {
  if (typeof value === "string") return resolveContentText(value) as T;
  if (Array.isArray(value)) return value.map(resolveTokens) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveTokens(item)])) as T;
  }
  return value;
}

function loadPage<T>(name: keyof typeof pageDefinitions, value: T): T {
  const fields = pageDefinitions[name].fields;
  const schema = z.strictObject(Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, fieldSchema(field)]),
  ));
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`src/content/data/page-${name}.json is invalid:\n${z.prettifyError(result.error)}`);
  }
  return resolveTokens(result.data) as T;
}

export const pageContent = {
  home: loadPage("home", home),
  about: loadPage("about", about),
  services: loadPage("services", services),
  howItWorks: loadPage("howItWorks", howItWorks),
  contact: loadPage("contact", contact),
};

export function pageMetadata(name: keyof typeof pageContent): Metadata {
  const { seoTitle, seoDescription } = pageContent[name];
  const route = pageDefinitions[name].route;
  return {
    title: name === "home" ? { absolute: seoTitle } : seoTitle,
    description: seoDescription,
    alternates: { canonical: route },
    // Nested metadata is replaced rather than deeply merged by Next.js.
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: route,
      siteName: practiceSettings.name,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: practiceSettings.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: ["/opengraph-image"],
    },
  };
}
