import { config, fields, singleton } from "@keystatic/core";
import { formats, iconOptions, limits, weekdays } from "./src/content/content-rules";
import { imageField, optionalText, requiredText } from "./src/content/editor-fields";
import { pageSingletons } from "./src/content/page-editor";
import { resolveEditorStorage } from "./src/lib/editor-storage";

const DEFAULT_REPO = "ChavannesV/premier-np-care";
const json = { data: "json" } as const;
const editorStorage = resolveEditorStorage({
  mode: process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE,
  cloudProject: process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT,
  isDevelopment: process.env.NODE_ENV === "development",
  repo: githubRepo(),
});
export const editorConfigurationError = editorStorage.error;
const useLocalStorage = editorStorage.storage.kind === "local";
const publishNote = useLocalStorage
  ? "Save updates the files in this local checkout. Refresh the local website to see your changes; nothing is published to GitHub."
  : "Save commits your changes to the selected GitHub branch. Changes on the production branch go live after the deployment succeeds.";
const tokenNote = "Use {practiceName}, {providerName}, {providerFirstName}, {minimumAge} or {serviceArea} to keep repeated facts in sync.";

function githubRepo(): `${string}/${string}` {
  const repo = process.env.NEXT_PUBLIC_KEYSTATIC_REPO?.trim();
  if (repo && /^[\w.-]+\/[\w.-]+$/.test(repo)) return repo as `${string}/${string}`;
  if (repo) console.warn(`Invalid NEXT_PUBLIC_KEYSTATIC_REPO; using ${DEFAULT_REPO}.`);
  return DEFAULT_REPO;
}

function textList(label: string, max: number, count: number = limits.rows, description = tokenNote) {
  return fields.array(requiredText("Text", max, { multiline: true, description: tokenNote }), {
    label, description,
    itemLabel: ({ value }) => value.trim() ? value.slice(0, 90) : "Empty — add text before saving",
    validation: { length: { min: 1, max: count } },
  });
}

function iconField() {
  return fields.select({ label: "Icon", options: iconOptions, defaultValue: "ShieldCheck" });
}

function cards(label: string, withIcon = false) {
  return fields.array(fields.object({
    title: requiredText("Title", limits.title),
    body: requiredText("Description", limits.body, { multiline: true, description: tokenNote }),
    ...(withIcon ? { icon: iconField() } : {}),
  }), {
    label,
    description: "Drag rows to reorder. Repeated titles are shown only once.",
    itemLabel: ({ fields }) => fields.title.value || "Untitled — add a title before saving",
    validation: { length: { min: 1, max: 12 } },
  });
}

export default config({
  storage: editorStorage.storage,
  ...(editorStorage.cloud ? { cloud: editorStorage.cloud } : {}),
  ui: {
    brand: { name: "Premier NP Care" },
    navigation: {
      "Practice": ["practice", "insurance", "provider", "services"],
      "Website pages": ["homePage", "aboutPage", "servicesPage", "howItWorksPage", "contactPage"],
      "Shared content": ["shared"],
    },
  },
  singletons: {
    practice: singleton({
      label: "Practice details",
      path: "src/content/data/practice",
      format: json,
      schema: {
        name: requiredText("Practice name", limits.name, { description: publishNote }),
        address: fields.object({
          street: requiredText("Street address", limits.shortText),
          city: requiredText("City", limits.name),
          region: requiredText("State or region", limits.name, { description: "For example, New Jersey." }),
          postalCode: requiredText("ZIP or postal code", 20),
          country: requiredText("Country code", 2, { format: formats.country, description: "Two-letter country code, for example US." }),
        }, { label: "Practice address" }),
        serviceArea: requiredText("Service area", limits.name, { description: "For example, New Jersey. Used wherever text includes {serviceArea}." }),
        minimumAge: fields.integer({ label: "Minimum patient age", defaultValue: 14, validation: { isRequired: true, min: 0, max: 120 } }),
        hours: fields.array(fields.object({
          weekdays: fields.array(fields.select({ label: "Weekday", options: weekdays, defaultValue: "Mo" }), {
            label: "Open on these days", itemLabel: ({ value }) => weekdays.find((day) => day.value === value)?.label ?? value,
            validation: { length: { min: 1, max: 7 } },
          }),
          open: requiredText("Opens at", 5, { format: formats.time, description: "24-hour time, for example 08:00." }),
          close: requiredText("Closes at", 5, { format: formats.time, description: "24-hour time, for example 17:00. An earlier closing time means the following day." }),
        }), {
          label: "Office hours",
          description: "Add a row for each group of days with the same hours. Displayed hours and search-engine information update together.",
          itemLabel: ({ fields }) => `${fields.weekdays.elements.map((day) => day.value).join(", ")}: ${fields.open.value}–${fields.close.value}`,
          validation: { length: { min: 1, max: limits.hours } },
        }),
        phone: optionalText("Phone number", limits.phone, { format: formats.usPhone, description: "Include the US area code. Leave blank to hide phone links." }),
        whatsappNumber: optionalText("WhatsApp number", limits.phone, { format: formats.whatsapp, description: "Include + and the country code, without spaces (for example +15612296153). Leave blank to hide WhatsApp buttons." }),
        bookingUrl: requiredText("Appointment booking link", limits.url, { format: formats.httpsUrl, description: "The scheduling URL used by every Book button and the booking calendar." }),
        acceptingNewPatients: fields.checkbox({ label: "Show the new-patient status", defaultValue: true }),
        statusLabel: requiredText("New-patient status label", limits.shortText, { description: "For example, Accepting new patients. Hide the status above when it should not be displayed." }),
      },
    }),
    insurance: singleton({
      label: "Insurance & payment",
      path: "src/content/data/insurance",
      format: json,
      schema: {
        summary: requiredText("Insurance summary", limits.insuranceSummary, { description: `${publishNote} ${tokenNote}` }),
        note: optionalText("Coverage note", limits.body, { multiline: true }),
        plans: fields.array(fields.object({
          name: requiredText("Plan name", limits.planName),
          featured: fields.checkbox({ label: "Feature this plan", defaultValue: false, description: "Highlights this plan in the insurance list." }),
        }), {
          label: "Accepted plans and payment options",
          description: "Include Self pay if accepted. Drag to reorder. Repeated names are shown only once. Leave empty to show just your summary.",
          itemLabel: ({ fields }) => fields.name.value || "Empty — enter a plan name",
          validation: { length: { max: limits.plans } },
        }),
      },
    }),
    provider: singleton({
      label: "Provider profile",
      path: "src/content/data/provider",
      format: json,
      schema: {
        name: requiredText("Provider name", limits.name, { description: "Name without credentials. " + publishNote }),
        credentials: optionalText("Credentials", limits.name, { description: "For example, APN. Displayed after the provider name." }),
        role: requiredText("Provider role", limits.shortText),
        photo: imageField("Provider photo", "provider"),
        photoAlt: requiredText("Photo description", limits.alt, { description: "Describe the portrait for people using screen readers. " + tokenNote }),
        bio: textList("Biography paragraphs", limits.paragraph, 12),
        mission: requiredText("Mission statement", limits.paragraph, { multiline: true, description: tokenNote }),
      },
    }),
    services: singleton({
      label: "Services",
      path: "src/content/data/services",
      format: json,
      schema: {
        items: fields.array(fields.object({
          title: requiredText("Service title", limits.title),
          eyebrow: requiredText("Short category label", limits.name),
          description: requiredText("Description", limits.body, { multiline: true, description: tokenNote }),
          image: imageField("Services page image", "services"),
          imageAlt: requiredText("Services image description", limits.alt),
          imagePosition: requiredText("Services image focus", 20, { format: formats.imagePosition, description: "For example, center 44%. Adjusts the crop without changing the image." }),
          homeImage: imageField("Homepage image", "services"),
          homeImageAlt: requiredText("Homepage image description", limits.alt),
          homeImagePosition: requiredText("Homepage image focus", 20, { format: formats.imagePosition }),
          items: textList("What this service includes", limits.body),
          fit: requiredText("Who this service suits", limits.body, { multiline: true, description: tokenNote }),
          boundary: requiredText("Care limitations", limits.body, { multiline: true, description: tokenNote }),
          tags: textList("Short tags", limits.name, 6, "Up to six short labels, such as Annual physicals or Screenings."),
          icon: iconField(),
        }), {
          label: "Services",
          description: `${publishNote} These are shared by the Home and Services pages. Drag to reorder. Repeated titles are shown only once.`,
          itemLabel: ({ fields }) => fields.title.value || "Untitled — enter a service title",
          validation: { length: { min: 1, max: 12 } },
        }),
      },
    }),
    shared: singleton({
      label: "Patient guidance & practice values",
      path: "src/content/data/shared",
      format: json,
      schema: {
        practiceAtAGlance: cards("Practice at a glance", true),
        patientJourney: fields.array(fields.object({
          title: requiredText("Step title", limits.title),
          description: requiredText("Step description", limits.body, { multiline: true, description: tokenNote }),
          icon: iconField(),
        }), {
          label: "Patient journey steps",
          description: "Shown on the How It Works page. Drag to reorder. Repeated titles are shown only once.",
          itemLabel: ({ fields }) => fields.title.value || "Untitled step",
          validation: { length: { min: 1, max: 12 } },
        }),
        patientFit: textList("Who the practice suits", limits.body, 12),
        providerStandards: cards("Provider standards"),
        safetyBoundaries: cards("Care and safety guidance", true),
      },
    }),
    ...pageSingletons,
  },
});
