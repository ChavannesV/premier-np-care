import "server-only";
import { practiceSettings } from "@/lib/content";

// Published JSON is authoritative. Set these in /admin → Practice details;
// legacy NEXT_PUBLIC_BOOKING_URL / NEXT_PUBLIC_PHONE_NUMBER are not consulted.
export const bookingUrl = practiceSettings.bookingUrl;
export const phoneNumber = practiceSettings.phone;
export const isPhoneConfirmed = phoneNumber.length > 0;

export const whatsappHref = practiceSettings.whatsappNumber
  ? `https://wa.me/${practiceSettings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${practiceSettings.name}, I have a question about scheduling an appointment.`)}`
  : null;
