/** Browser-safe rules shared by the editor and build-time validation. */
export type TextFormat = { regex: RegExp; message: string };

export const limits = {
  name: 100,
  title: 160,
  shortText: 240,
  body: 1200,
  paragraph: 2400,
  phone: 30,
  url: 500,
  image: 300,
  alt: 240,
  planName: 100,
  insuranceSummary: 240,
  rows: 20,
  plans: 50,
  hours: 7,
} as const;

export const weekdays = [
  { value: "Mo", label: "Monday" },
  { value: "Tu", label: "Tuesday" },
  { value: "We", label: "Wednesday" },
  { value: "Th", label: "Thursday" },
  { value: "Fr", label: "Friday" },
  { value: "Sa", label: "Saturday" },
  { value: "Su", label: "Sunday" },
] as const;

export const iconOptions = [
  { value: "Brain", label: "Mental health" },
  { value: "CalendarCheck", label: "Calendar" },
  { value: "ClipboardCheck", label: "Checklist" },
  { value: "FileText", label: "Document" },
  { value: "HeartPulse", label: "Heart" },
  { value: "MessagesSquare", label: "Conversation" },
  { value: "ShieldCheck", label: "Shield" },
  { value: "Stethoscope", label: "Stethoscope" },
  { value: "TriangleAlert", label: "Urgent notice" },
  { value: "UserRoundCheck", label: "Provider" },
] as const;

export const imageExtensions = /^(?:jpe?g|png|webp|avif|gif)$/i;

export const formats = {
  plainText: { regex: /^[^<>]*$/, message: "Use plain text without HTML tags." },
  httpsUrl: {
    regex: /^https:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:[/?#][^\s<>\\]*)?$/,
    message: "Enter a complete public link starting with https:// (without spaces).",
  },
  usPhone: {
    regex: /^(?:\+?1[\s().-]*)?(?:\d[\s().-]*){10}$/,
    message: "Enter a US phone number including the area code, for example (201) 555-0123.",
  },
  imagePath: {
    regex: /^\/images\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:jpe?g|png|webp|avif|gif)$/i,
    message: "Choose an image from this website's /images/ folder (JPEG, PNG, WebP, AVIF or GIF).",
  },
  time: {
    regex: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    message: "Use 24-hour time, for example 08:00 or 17:00.",
  },
  country: { regex: /^[A-Z]{2}$/, message: "Use the two-letter country code, for example US." },
  imagePosition: {
    regex: /^(?:left|center|right) (?:\d{1,2}|100)%$/,
    message: "Use left, center or right followed by a percentage from 0% to 100%, for example center 44%.",
  },
} satisfies Record<string, TextFormat>;

export function notBlank(label: string): TextFormat {
  return { regex: /^(?=[\s\S]*\S)[^<>]+$/, message: `${label} must contain plain text without HTML tags.` };
}

export function optionalFormat(format: TextFormat): TextFormat {
  return { regex: new RegExp(`^(?:\\s*|(?:${format.regex.source}))$`, format.regex.flags), message: format.message };
}
