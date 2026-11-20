import { providerDetails } from "@/lib/content";
import { pageContent } from "@/content/page-content";
import { ArchPortrait } from "@/components/arch-portrait";

export function HeroPortrait() {
  return (
    <ArchPortrait
      alt={providerDetails.photoAlt}
      credential={pageContent.home.portraitCredential}
      href="/about"
      name={providerDetails.displayName}
      sizes="(min-width: 1024px) 42vw, 90vw"
      src={providerDetails.photo}
    />
  );
}
