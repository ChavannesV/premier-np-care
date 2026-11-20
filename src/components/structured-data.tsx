import { siteUrl } from "@/lib/site";
import { phoneNumber } from "@/lib/config";
import { practiceSettings, providerDetails, practiceOpeningHours, services } from "@/lib/content";

export function StructuredData() {
  const medicalPracticeJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${siteUrl}/#medical-practice`,
    name: practiceSettings.name,
    url: siteUrl,
    image: new URL(providerDetails.photo, siteUrl).href,
    logo: `${siteUrl}/images/logo-icon.png`,
    description: `${practiceSettings.name} offers provider-led telehealth care in ${practiceSettings.serviceArea} for patients age ${practiceSettings.minimumAge} and up.`,
    medicalSpecialty: services.map((service) => service.title),
    areaServed: { "@type": "AdministrativeArea", name: practiceSettings.serviceArea },
    address: {
      "@type": "PostalAddress",
      streetAddress: practiceSettings.address.street,
      addressLocality: practiceSettings.address.city,
      addressRegion: practiceSettings.address.region,
      postalCode: practiceSettings.address.postalCode,
      addressCountry: practiceSettings.address.country,
    },
    openingHours: practiceOpeningHours,
    ...(phoneNumber ? { telephone: phoneNumber } : {}),
    provider: {
      "@type": "Person",
      name: providerDetails.displayName,
      jobTitle: providerDetails.role,
      image: new URL(providerDetails.photo, siteUrl).href,
    },
    availableService: services.map((service) => ({ "@type": "MedicalProcedure", name: service.title })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify(medicalPracticeJsonLd).replace(/</g, "\\u003c"),
  }} />;
}
