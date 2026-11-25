import { ArrowRight, CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/button";
import Link from "next/link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Container } from "@/components/container";
import { HeroPortrait } from "@/components/home/hero-portrait";
import { HeroEntrance, HeroItem } from "@/components/motion-reveal";
import { bookingUrl } from "@/lib/config";
import { insuranceAccepted, practiceSettings } from "@/lib/content";
import { pageContent } from "@/content/page-content";

const copy = pageContent.home;

export function HomeHero() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-porcelain">
        <div className="ocean-field absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="hero-glow hero-glow-a pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-cyan/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="hero-glow hero-glow-b pointer-events-none absolute -right-16 bottom-0 h-[360px] w-[360px] rounded-full bg-pale-mist/90 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="hero-glow hero-glow-c pointer-events-none absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-gold/15 blur-2xl"
        />

        <Container className="relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          <HeroEntrance className="max-w-xl">
            <HeroItem>
              <p className="label-caps text-harbor">
                {copy.heroEyebrow}
              </p>
              <span
                aria-hidden="true"
                className="hero-accent-line mt-4 block h-1 w-16 rounded-full bg-[linear-gradient(90deg,#12aec4,#58c7d6,#c9a84c)]"
              />
            </HeroItem>

            <HeroItem>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl md:text-[3.5rem] md:leading-[1.02]">
                {copy.heroTitle}{" "}
                <em className="hero-emphasis font-normal italic text-harbor">
                  {copy.heroEmphasis}
                </em>
              </h1>
            </HeroItem>

            <HeroItem>
              <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-ink/74">
                {copy.heroDescription}
              </p>
            </HeroItem>

            {practiceSettings.acceptingNewPatients ? (
              <HeroItem>
                <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/80 px-4 py-2 text-sm font-semibold text-ink/78">
                  <span
                    aria-hidden="true"
                    className="pulse-dot relative flex h-2.5 w-2.5"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-harbor/60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-harbor" />
                  </span>
                  {practiceSettings.statusLabel}
                </p>
              </HeroItem>
            ) : null}

            <HeroItem>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  className="hero-cta-primary transition-transform duration-300 hover:-translate-y-0.5"
                  href={bookingUrl}
                  id="hero-book"
                  variant="cobalt"
                >
                  <CalendarCheck aria-hidden="true" size={20} />
                  {copy.bookCta}
                </ButtonLink>
                <WhatsAppButton compact />
              </div>
            </HeroItem>

            <HeroItem>
              <p className="mt-4 text-sm leading-6 text-ink/70">
                Ages {practiceSettings.minimumAge}+ · Insurance &amp; self-pay
              </p>
            </HeroItem>
          </HeroEntrance>

          <HeroPortrait />
        </Container>
      </section>

      <div className="border-b border-line bg-paper/90">
        <Container className="grid items-center gap-4 py-5 md:grid-cols-2 md:gap-8">
          <div>
            <p className="text-sm font-semibold leading-6 text-ink/72">
              {insuranceAccepted.summary}
            </p>
            <Link className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-harbor underline underline-offset-4 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold" href="/contact#insurance">
              View accepted insurance <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <ul aria-label="Accepted insurance" className="flex flex-wrap gap-2">
            {insuranceAccepted.examples.map((plan) => (
              <li key={plan} className={insuranceAccepted.featured.includes(plan)
                ? "rounded-full border border-cyan/30 bg-mist px-3 py-1.5 text-sm font-semibold text-harbor"
                : "rounded-full border border-line bg-porcelain px-3 py-1.5 text-sm text-ink/75"}>
                {plan}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  );
}
