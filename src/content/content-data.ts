import "server-only";
import { z } from "zod";
import practiceJson from "./data/practice.json";
import insuranceJson from "./data/insurance.json";
import providerJson from "./data/provider.json";
import servicesJson from "./data/services.json";
import sharedJson from "./data/shared.json";
import { formats, iconOptions, limits, weekdays } from "./content-rules";
import { boundedList, optionalText, parseContent, requiredText, uniqueBy } from "./content-schema";

const icon = z.enum(iconOptions.map((option) => option.value));
const textList = (max: number, min = 1, count: number = limits.rows) =>
  boundedList(requiredText(max), min, count).transform(uniqueBy((text) => text));

export const practiceData = parseContent("practice", z.object({
  name: requiredText(limits.name),
  address: z.object({
    street: requiredText(limits.shortText),
    city: requiredText(limits.name),
    region: requiredText(limits.name),
    postalCode: requiredText(20),
    country: requiredText(2, formats.country),
  }),
  serviceArea: requiredText(limits.name),
  minimumAge: z.number().int().min(0).max(120),
  hours: boundedList(z.object({
    weekdays: boundedList(z.enum(weekdays.map((day) => day.value)), 1, 7)
      .transform((days) => [...new Set(days)].sort((a, b) => weekdays.findIndex((day) => day.value === a) - weekdays.findIndex((day) => day.value === b))),
    open: requiredText(5, formats.time),
    close: requiredText(5, formats.time),
  }), 1, limits.hours),
  phone: optionalText(limits.phone, formats.usPhone),
  whatsappNumber: optionalText(limits.phone, formats.whatsapp),
  bookingUrl: requiredText(limits.url, formats.httpsUrl),
  acceptingNewPatients: z.boolean().default(false),
  statusLabel: requiredText(limits.shortText),
}), practiceJson);

export const insuranceData = parseContent("insurance", z.object({
  summary: requiredText(limits.insuranceSummary),
  note: optionalText(limits.body),
  plans: boundedList(z.object({
    name: requiredText(limits.planName),
    featured: z.boolean().default(false),
  }), 0, limits.plans).default([]).transform(uniqueBy((plan) => plan.name)),
}), insuranceJson);

export const providerData = parseContent("provider", z.object({
  name: requiredText(limits.name),
  credentials: optionalText(limits.name),
  role: requiredText(limits.shortText),
  photo: requiredText(limits.image, formats.imagePath),
  photoAlt: requiredText(limits.alt),
  bio: textList(limits.paragraph, 1, 12),
  mission: requiredText(limits.paragraph),
}), providerJson);

export const servicesData = parseContent("services", z.object({
  items: boundedList(z.object({
    title: requiredText(limits.title),
    eyebrow: requiredText(limits.name),
    image: requiredText(limits.image, formats.imagePath),
    imageAlt: requiredText(limits.alt),
    imagePosition: requiredText(20, formats.imagePosition),
    homeImage: requiredText(limits.image, formats.imagePath),
    homeImageAlt: requiredText(limits.alt),
    homeImagePosition: requiredText(20, formats.imagePosition),
    description: requiredText(limits.body),
    items: textList(limits.body),
    fit: requiredText(limits.body),
    boundary: requiredText(limits.body),
    tags: textList(limits.name, 1, 6),
    icon,
  }), 1, 12).transform(uniqueBy((service) => service.title)),
}), servicesJson);

const card = z.object({ title: requiredText(limits.title), body: requiredText(limits.body) });
export const sharedData = parseContent("shared", z.object({
  practiceAtAGlance: boundedList(card.extend({ icon }), 1, 12).transform(uniqueBy((item) => item.title)),
  patientJourney: boundedList(z.object({
    title: requiredText(limits.title), description: requiredText(limits.body), icon,
  }), 1, 12).transform(uniqueBy((item) => item.title)),
  patientFit: textList(limits.body, 1, 12),
  providerStandards: boundedList(card, 1, 12).transform(uniqueBy((item) => item.title)),
  safetyBoundaries: boundedList(card.extend({ icon }), 1, 12).transform(uniqueBy((item) => item.title)),
}), sharedJson);
