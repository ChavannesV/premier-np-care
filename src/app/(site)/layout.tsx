import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { StructuredData } from "@/components/structured-data";
import { bookingUrl, whatsappHref } from "@/lib/config";
import { practiceSettings, providerDetails } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const siteDescription =
  `${practiceSettings.name} is a ${practiceSettings.serviceArea} Nurse Practitioner-led medical practice led by ${providerDetails.displayName}, offering provider-led telehealth visits.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: practiceSettings.name,
    template: `%s | ${practiceSettings.name}`,
  },
  description: siteDescription,
  applicationName: practiceSettings.name,
  openGraph: {
    title: practiceSettings.name,
    description: siteDescription,
    url: siteUrl,
    siteName: practiceSettings.name,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: practiceSettings.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: practiceSettings.name,
    description: siteDescription,
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">Skip to main content</a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <StructuredData />
      <div aria-hidden="true" className="h-[calc(76px+env(safe-area-inset-bottom))] lg:hidden" />
      <MobileBookBar bookingUrl={bookingUrl} whatsappHref={whatsappHref} />
    </>
  );
}
