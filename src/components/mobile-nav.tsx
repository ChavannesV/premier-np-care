"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Menu, MessageCircle, X } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { cn } from "@/components/utils";

interface MobileNavProps {
  bookingUrl: string;
  whatsappHref: string | null;
  navItems: { href: string; label: string }[];
  practiceName: string;
  acceptingNewPatients: boolean;
  statusLabel: string;
}

export function MobileNav({ bookingUrl, whatsappHref, navItems, practiceName, acceptingNewPatients, statusLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const focusableElements = () => Array.from(
      dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') ?? [],
    ).filter((element) => element.getClientRects().length > 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const elements = focusableElements();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog?.contains(event.target)) {
        focusableElements()[0]?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    document.body.style.overflow = "hidden";
    focusableElements()[0]?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", containFocus);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", containFocus);
      desktop.removeEventListener("change", closeOnDesktop);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={open ? "mobile-navigation-dialog" : undefined}
        aria-haspopup="dialog"
        aria-label="Open navigation"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-line bg-paper text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu aria-hidden="true" size={22} />
      </button>

      {open
        ? createPortal(
          <motion.div
            ref={dialogRef}
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-deep-navy text-paper"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="care-current-lines absolute inset-0 opacity-15" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-cyan/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 bottom-24 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
            />

            <div className="relative flex min-h-full flex-col px-6 pb-8 pt-4">
              <div className="flex min-h-[52px] items-center justify-between">
                <p className="font-display text-xl font-medium text-paper">
                  {practiceName}
                </p>
                <button
                  aria-label="Close navigation"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-white/20 bg-white/8 text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" size={22} />
                </button>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="mt-10 flex flex-col gap-1"
              >
                {navItems.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 14 }
                      }
                      key={item.href}
                      transition={{
                        delay: 0.06 + index * 0.05,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        className={cn(
                          "flex items-center justify-between border-b border-white/10 py-4 font-display text-3xl font-medium transition-colors focus-visible:rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                          isActive
                            ? "text-gold"
                            : "text-paper/88 hover:text-paper",
                        )}
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-gold"
                          />
                        ) : null}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto pt-10">
                {acceptingNewPatients ? <p className="inline-flex items-center gap-2.5 text-sm font-semibold text-paper/80">
                  <span
                    aria-hidden="true"
                    className="pulse-dot relative flex h-2.5 w-2.5"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-aqua/70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-aqua" />
                  </span>
                  {statusLabel}
                </p> : null}
                <ButtonLink
                  className="mt-4 w-full"
                  href={bookingUrl}
                  onClick={() => setOpen(false)}
                  variant="mist"
                >
                  <CalendarCheck aria-hidden="true" size={20} />
                  Book an Appointment
                </ButtonLink>
                {whatsappHref ? (
                  <ButtonLink
                    className="mt-3 w-full"
                    href={whatsappHref}
                    onClick={() => setOpen(false)}
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    <MessageCircle aria-hidden="true" size={20} />
                    Message on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </ButtonLink>
                ) : null}
                <p className="mt-4 text-center text-xs text-paper/50">
                  For emergencies, call 911
                </p>
              </div>
            </div>
          </motion.div>,
          document.body,
        )
        : null}
    </div>
  );
}
