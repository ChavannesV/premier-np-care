import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { whatsappHref } from "@/lib/config";

export function WhatsAppButton() {
  if (!whatsappHref) return null;

  return (
    <ButtonLink href={whatsappHref} variant="secondary" rel="noopener noreferrer">
      <MessageCircle aria-hidden="true" size={19} />
      Message on WhatsApp
      <span className="sr-only"> (opens in a new tab)</span>
    </ButtonLink>
  );
}
