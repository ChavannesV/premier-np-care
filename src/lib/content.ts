import "server-only";
import {
  Brain, CalendarCheck, ClipboardCheck, FileText, HeartPulse, MessagesSquare,
  ShieldCheck, Stethoscope, TriangleAlert, UserRoundCheck,
} from "lucide-react";
import { insuranceData, practiceData, providerData, servicesData, sharedData } from "@/content/content-data";
import { weekdays } from "@/content/content-rules";

const icons = { Brain, CalendarCheck, ClipboardCheck, FileText, HeartPulse, MessagesSquare, ShieldCheck, Stethoscope, TriangleAlert, UserRoundCheck };

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Provider" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export const practiceSettings = practiceData;
const displayName = [providerData.name, providerData.credentials].filter(Boolean).join(", ");
const replacements: Record<string, string> = {
  practiceName: practiceData.name,
  providerName: displayName,
  providerFirstName: providerData.name.split(/\s+/)[0],
  minimumAge: String(practiceData.minimumAge),
  serviceArea: practiceData.serviceArea,
};

/** Plain-text tokens keep repeated practice facts in sync without HTML. */
export function resolveContentText(text: string): string {
  return text.replace(/\{(practiceName|providerName|providerFirstName|minimumAge|serviceArea)\}/g, (token, key: string) => replacements[key] ?? token);
}

function resolveTexts<T>(value: T): T {
  if (typeof value === "string") return resolveContentText(value) as T;
  if (Array.isArray(value)) return value.map(resolveTexts) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveTexts(item)])) as T;
  }
  return value;
}

export const providerDetails = { ...resolveTexts(providerData), displayName };
export const providerBio = providerDetails.bio;
export const missionStatement = providerDetails.mission;

const insurance = resolveTexts(insuranceData);
export const insuranceAccepted = {
  ...insurance,
  featured: insurance.plans.filter((plan) => plan.featured).map((plan) => plan.name),
  examples: insurance.plans.map((plan) => plan.name),
};

export const services = resolveTexts(servicesData.items).map((service) => ({ ...service, icon: icons[service.icon] }));
export const practiceAtAGlance = resolveTexts(sharedData.practiceAtAGlance).map((item) => ({ ...item, icon: icons[item.icon] }));
export const patientJourney = resolveTexts(sharedData.patientJourney).map((item) => ({ ...item, icon: icons[item.icon] }));
export const patientFit = resolveTexts(sharedData.patientFit);
export const providerStandards = resolveTexts(sharedData.providerStandards);
export const safetyBoundaries = resolveTexts(sharedData.safetyBoundaries).map((item) => ({ ...item, icon: icons[item.icon] }));

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, "0")}` : ""}${hour >= 12 ? "pm" : "am"}`;
}

function formatDays(days: typeof practiceData.hours[number]["weekdays"]) {
  const indexes = days.map((day) => weekdays.findIndex((option) => option.value === day));
  const labels = indexes.map((index) => weekdays[index].label);
  return indexes.length > 1 && indexes.every((index, i) => i === 0 || index === indexes[i - 1] + 1)
    ? `${labels[0]}–${labels[labels.length - 1]}`
    : labels.join(", ");
}

/** Schema.org openingHours, derived from the same rows shown on the website. */
export const practiceOpeningHours = practiceData.hours.map((row) => `${row.weekdays.join(",")} ${row.open}-${row.close}`);

export const practiceDetails = {
  schedule: practiceData.hours.map((row) => `${formatDays(row.weekdays)} ${formatTime(row.open)}–${formatTime(row.close)}`).join("; "),
  payment: insuranceAccepted.summary,
  address: `${practiceData.address.street}, ${practiceData.address.city}, ${practiceData.address.region} ${practiceData.address.postalCode}`,
  ageRange: `Treating patients from ${practiceData.minimumAge} and up`,
};
