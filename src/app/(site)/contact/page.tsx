import type { Metadata } from "next";
import { pageContent, pageMetadata } from "@/content/page-content";
import { CalendarCheck, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BookingEmbedSlot } from "@/components/booking-embed-slot";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/container";
import { MotionReveal } from "@/components/motion-reveal";
import { PageIntro } from "@/components/page-intro";
import { Section } from "@/components/section";
import { bookingUrl, isPhoneConfirmed, phoneNumber } from "@/lib/config";
import { insuranceAccepted, practiceDetails, practiceSettings } from "@/lib/content";

const copy = pageContent.contact;

export const metadata: Metadata = pageMetadata("contact");

const contactRows = [
  {
    label: "Phone",
    value: isPhoneConfirmed
      ? phoneNumber
      : copy.phoneFallback,
    icon: Phone,
  },
  {
    label: "Schedule",
    value: practiceDetails.schedule,
    icon: CalendarCheck,
  },
  {
    label: "Payment",
    value: practiceDetails.payment,
    icon: ShieldCheck,
  },
  {
    label: "Age range",
    value: practiceDetails.ageRange,
    icon: ShieldCheck,
  },
  {
    label: "Email",
    value: copy.emailNote,
    icon: Mail,
  },
  {
    label: "Address",
    value: practiceDetails.address,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        aside={
          <div className="rounded-[22px] border border-line bg-paper/82 p-5 shadow-[0_16px_50px_rgba(7,28,42,0.06)]">
            <div className="flex items-center gap-3 text-cobalt">
              <Phone aria-hidden="true" size={22} />
              <p className="label-caps">{copy.asideLabel}</p>
            </div>
            <p className="mt-3 leading-7 text-ink/76">
              {copy.asideDescription}
            </p>
            <p className="mt-3 font-semibold leading-7 text-ink">
              {practiceDetails.schedule}
            </p>
          </div>
        }
        eyebrow={copy.heroLabel}
        title={copy.heroTitle}
      >
        <p>
          {copy.heroDescription}
        </p>
      </PageIntro>

      <Section className="bg-paper py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <MotionReveal>
            <div>
              <div className="flex items-center gap-3 text-cobalt">
                <CalendarCheck aria-hidden="true" size={24} />
                <p className="label-caps">{copy.bookingLabel}</p>
              </div>
              <h2 className="mt-5 max-w-lg font-display text-4xl font-medium leading-[1.06] text-ink md:text-5xl">
                {copy.bookingTitle}
              </h2>
              <p className="mt-5 max-w-lg leading-8 text-ink/70">
                {copy.bookingDescription}
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <BookingEmbedSlot bookingUrl={bookingUrl} practiceName={practiceSettings.name} />
          </MotionReveal>
        </Container>
      </Section>

      <Section className="bg-mist py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <MotionReveal>
            <div>
              <p className="label-caps text-cobalt">{copy.inquiryLabel}</p>
              <h2 className="mt-5 max-w-lg font-display text-4xl font-medium leading-[1.06] text-ink md:text-5xl">
                {copy.inquiryTitle}
              </h2>
              <p className="mt-5 max-w-lg leading-8 text-ink/70">
                {copy.inquiryDescription}
              </p>
              <div className="mt-6">
                <WhatsAppButton />
              </div>
              <div className="mt-8 grid gap-3 border-y border-line py-5">
                {copy.safetyNotes.map((note, index) => (
                  <div className="flex items-start gap-3" key={`${index}-${note}`}>
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-cobalt"
                      size={18}
                    />
                    <p className="text-sm leading-6 text-ink/68">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div
              className="rounded-[28px] border border-line bg-paper p-6 shadow-[0_22px_70px_rgba(26,53,87,0.08)]"
              id="contact-form"
            >
              <ContactForm />
            </div>
          </MotionReveal>
        </Container>
      </Section>

      <Section className="bg-paper py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <MotionReveal>
            <p className="label-caps text-cobalt">{copy.practiceLabel}</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-medium leading-[1.06] text-ink md:text-5xl">
              {copy.practiceTitle}
            </h2>
          </MotionReveal>

          <div className="grid gap-4">
            {contactRows.map((row, index) => {
              const Icon = row.icon;
              return (
                <MotionReveal delay={index * 0.04} key={row.label}>
                  <article className="grid gap-4 border-t border-line py-6 md:grid-cols-[220px_1fr]">
                    <div className="flex items-center gap-3 text-cobalt">
                      <Icon aria-hidden="true" size={21} />
                      <p className="label-caps">{row.label}</p>
                    </div>
                    <div>
                      <p className="text-lg leading-8 text-ink/76">
                        {row.value}
                      </p>
                      {row.label === "Payment" ? (
                        <p className="mt-2 text-sm leading-6 text-ink/58">
                          {insuranceAccepted.examples.join(", ")}.{" "}
                          {insuranceAccepted.note}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
