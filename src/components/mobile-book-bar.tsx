import { CalendarCheck, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/button";

export function MobileBookBar({ bookingUrl, whatsappHref }: { bookingUrl: string; whatsappHref: string | null }) {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-xl lg:hidden"
    >
      <ButtonLink
        aria-label="Book an Appointment"
        className="min-w-0 flex-1 px-2 text-sm"
        href={bookingUrl}
        variant="cobalt"
      >
        <CalendarCheck aria-hidden="true" className="shrink-0" size={18} />
        Book
      </ButtonLink>
      {whatsappHref ? (
        <ButtonLink
          aria-label="Message on WhatsApp (opens in a new tab)"
          className="min-w-0 flex-1 px-2 text-sm"
          href={whatsappHref}
          rel="noopener noreferrer"
          variant="secondary"
        >
          <MessageCircle aria-hidden="true" className="shrink-0" size={18} />
          WhatsApp
        </ButtonLink>
      ) : null}
    </nav>
  );
}
