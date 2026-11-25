import { CalendarDays, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/button";

export function BookingEmbedSlot({ bookingUrl, practiceName }: { bookingUrl: string; practiceName: string }) {
  return (
    <section
      className="rounded-[22px] border border-line bg-porcelain p-6 md:p-8"
      id="booking-calendar"
    >
      <div className="flex items-center gap-3 text-cobalt">
        <CalendarDays aria-hidden="true" size={25} />
        <p className="label-caps">Online scheduling</p>
      </div>
      <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-deep-navy">
        Choose a time with {practiceName}.
      </h3>
      <p className="mt-3 leading-7 text-ink/76">
        View available appointments and enter your visit details in Tebra.
      </p>
      <ButtonLink className="mt-6 w-full sm:w-auto" href={bookingUrl} variant="cobalt">
        <CalendarDays aria-hidden="true" size={19} />
        Book an Appointment
      </ButtonLink>
      <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-ink/70">
        <ExternalLink aria-hidden="true" className="shrink-0" size={15} />
        Opens our secure scheduler in a new tab.
      </p>
    </section>
  );
}
