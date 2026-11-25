import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { whatsappHref } from "@/lib/config";

export function WhatsAppButton({ compact = false, className }: { compact?: boolean; className?: string }) {
  if (!whatsappHref) return null;

  return (
    <ButtonLink className={className} href={whatsappHref} variant="secondary" rel="noopener noreferrer">
      <MessageCircle aria-hidden="true" size={19} />
      {compact ? "WhatsApp" : "Message on WhatsApp"}
      <span className="sr-only"> (opens in a new tab)</span>
    </ButtonLink>
  );
}
