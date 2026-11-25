import type { Metadata } from "next";
import { pageContent, pageMetadata } from "@/content/page-content";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, FileText } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { HomeHero } from "@/components/home/home-hero";
import { DrawRule, MotionReveal } from "@/components/motion-reveal";
import { Section } from "@/components/section";
import { bookingUrl } from "@/lib/config";
import { practiceAtAGlance, practiceSettings, services } from "@/lib/content";

const copy = pageContent.home;

export const metadata: Metadata = pageMetadata("home");

export default function Home() {
  return (
    <>
      <HomeHero />

      <Section className="relative overflow-hidden bg-deep-navy py-14 md:py-20 text-paper">
        <div className="care-current-lines absolute inset-0 opacity-10" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-cyan/14 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gold/8 blur-3xl"
        />
        <Container className="relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <MotionReveal>
            <p className="label-caps text-aqua">{copy.clarityLabel}</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-medium leading-tight md:text-5xl">
              {copy.clarityTitle}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-paper/72">
              {copy.clarityDescription}
            </p>
          </MotionReveal>

          <div className="border-y border-white/14">
            {practiceAtAGlance.map((item, index) => {
              return (
                <MotionReveal delay={index * 0.05} key={item.title}>
                  <article className="group grid gap-4 border-b border-white/14 py-6 transition-colors duration-300 last:border-b-0 hover:bg-white/4 md:grid-cols-[84px_1fr] md:px-4 md:-mx-4">
                    <span className="font-display text-3xl leading-none text-aqua/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-aqua">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-paper">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-2xl leading-7 text-paper/68">
                        {item.body}
                      </p>
                    </div>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-paper py-14 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(201,238,243,0.4),transparent)]"
        />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <MotionReveal>
              <p className="label-caps text-cobalt">{copy.servicesLabel}</p>
              <h2 className="mt-5 max-w-xl font-display text-4xl font-medium leading-[1.06] text-ink md:text-5xl">
                {copy.servicesTitle}
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <div className="grid gap-5 border-y border-gold/35 py-6 md:grid-cols-[1fr_auto] md:items-center">
                <p className="max-w-2xl text-lg leading-8 text-ink/70">
                  {copy.servicesDescription}
                </p>
                <ButtonLink href="/services" variant="secondary">
                  {copy.servicesCta}
                  <ArrowRight aria-hidden="true" size={19} />
                </ButtonLink>
              </div>
            </MotionReveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <MotionReveal className="h-full" delay={index * 0.05} key={service.title}>
                  <Link
                    className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(160deg,#ffffff_0%,#f7fcfd_55%,#f0f9fb_100%)] shadow-[0_14px_40px_rgba(26,53,87,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_24px_60px_rgba(26,53,87,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    href={`/services#${service.id}`}
                  >
                    <div className="relative min-h-[210px] overflow-hidden bg-mist">
                      <Image
                        alt={service.homeImageAlt}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        fill
                        sizes="(min-width: 640px) 46vw, 92vw"
                        src={service.homeImage}
                        style={{ objectPosition: service.homeImagePosition }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,53,87,0)_45%,rgba(26,53,87,0.52))]"
                      />
                      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
                        <span className="label-caps rounded-full border border-white/28 bg-white/82 px-3 py-2 text-cobalt shadow-[0_12px_32px_rgba(26,53,87,0.14)] backdrop-blur">
                          {service.eyebrow}
                        </span>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/24 bg-paper/90 text-cobalt shadow-[0_8px_20px_rgba(26,53,87,0.14)] backdrop-blur transition-colors duration-300 group-hover:border-gold group-hover:bg-deep-navy group-hover:text-paper">
                          <Icon aria-hidden="true" size={20} />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="font-display text-2xl font-medium leading-tight text-ink">
                          {service.title}
                        </h3>
                        <p className="mt-2 leading-7 text-ink/68">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink/62"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-harbor transition-transform duration-300 group-hover:translate-x-1">
                        {copy.exploreCta}
                        <ArrowRight aria-hidden="true" size={15} />
                      </p>
                    </div>
                  </Link>
                </MotionReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-mist py-14 md:py-20">
        <div className="care-current-lines absolute inset-0 opacity-30" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-paper/80 blur-3xl"
        />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <MotionReveal>
              <p className="label-caps text-cobalt">{copy.journeyLabel}</p>
              <h2 className="mt-5 max-w-xl font-display text-4xl font-medium leading-[1.06] text-ink md:text-5xl">
                {copy.journeyTitle}
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <ButtonLink href="/how-it-works" variant="secondary">
                {copy.journeyCta}
                <ArrowRight aria-hidden="true" size={19} />
              </ButtonLink>
            </MotionReveal>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {copy.journeySteps.map(({ title, body }, index, steps) => {
              const isLast = index === steps.length - 1;
              const gradient =
                index === 0
                  ? "linear-gradient(90deg,#1a3557,#12aec4)"
                  : "linear-gradient(90deg,#12aec4,#c9a84c)";
              const gradientVertical =
                index === 0
                  ? "linear-gradient(180deg,#1a3557,#12aec4)"
                  : "linear-gradient(180deg,#12aec4,#c9a84c)";
              return (
                <MotionReveal delay={0.15 + index * 0.18} key={`${index}-${title}`}>
                  <div className="relative grid grid-cols-[40px_1fr] gap-x-4 sm:block">
                    {isLast ? null : (
                      <>
                        <DrawRule
                          className="absolute left-5 top-5 hidden h-px w-[calc(100%+2rem)] sm:block"
                          delay={0.3 + index * 0.18}
                          style={{ backgroundImage: gradient }}
                        />
                        <DrawRule
                          className="absolute left-5 top-5 h-[calc(100%+2.5rem)] w-px sm:hidden"
                          delay={0.3 + index * 0.18}
                          orientation="y"
                          style={{ backgroundImage: gradientVertical }}
                        />
                      </>
                    )}
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan/30 bg-paper font-display text-lg font-semibold text-cobalt shadow-[0_10px_24px_rgba(26,53,87,0.1)]">
                      {index + 1}
                    </span>
                    <div className="sm:mt-4">
                      <h3 className="text-lg font-semibold text-ink">
                        {title}
                      </h3>
                      <p className="mt-1.5 max-w-xs leading-7 text-ink/66">
                        {body}
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>

          <MotionReveal delay={0.5}>
            <div className="mt-14 grid gap-6 rounded-[24px] border border-line bg-paper/86 p-6 shadow-[0_18px_60px_rgba(26,53,87,0.07)] backdrop-blur md:grid-cols-[0.58fr_1.42fr] md:items-center md:p-7">
              <div>
                <div className="flex items-center gap-3 text-cobalt">
                  <FileText aria-hidden="true" size={22} />
                  <p className="label-caps">{copy.prepLabel}</p>
                </div>
                <p className="mt-3 max-w-md leading-7 text-ink/68">
                  {copy.prepDescription}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.prepItems.map((item, index) => (
                  <div
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-porcelain px-4 py-3"
                    key={`${index}-${item}`}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="shrink-0 text-cobalt"
                      size={18}
                    />
                    <p className="text-sm font-semibold text-ink/78">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-porcelain py-32 md:py-40">
        <div className="ocean-field absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="hero-glow hero-glow-a pointer-events-none absolute -left-20 top-1/4 h-[360px] w-[360px] rounded-full bg-cyan/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="hero-glow hero-glow-c pointer-events-none absolute right-[12%] bottom-6 h-44 w-44 rounded-full bg-gold/15 blur-2xl"
        />
        <Container className="relative flex flex-col items-center text-center">
          <MotionReveal>
            <p className="label-caps text-cobalt">{practiceSettings.name}</p>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.06] text-ink md:text-6xl">
              {copy.closingTitle}{" "}
              <em className="font-normal italic text-cobalt">
                {copy.closingEmphasis}
              </em>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-5">
              <ButtonLink
                className="transition-transform duration-300 hover:-translate-y-0.5"
                href={bookingUrl}
                variant="cobalt"
              >
                <CalendarCheck aria-hidden="true" size={20} />
                {copy.bookCta}
              </ButtonLink>
              <p className="text-sm text-ink/56">
                {copy.urgentNote}
              </p>
            </div>
          </MotionReveal>
        </Container>
      </Section>
    </>
  );
}
