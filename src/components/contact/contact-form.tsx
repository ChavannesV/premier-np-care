"use client";

import { CheckCircle2, Send, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/button";

type Status =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type FieldName = "name" | "email" | "phone" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldNames: FieldName[] = ["name", "email", "phone", "message"];
const inputClassName =
  "min-h-12 rounded-[12px] border bg-porcelain px-4 py-3 text-base text-ink outline-none transition focus:ring-2";

function getInputClassName(hasError: boolean) {
  return `${inputClassName} ${
    hasError
      ? "border-warn ring-2 ring-warn/15 focus:border-warn focus:ring-warn/25"
      : "border-line focus:border-cyan focus:ring-cyan/20"
  }`;
}

function getFormField(form: HTMLFormElement, name: FieldName) {
  return form.elements.namedItem(name) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isSent = status.type === "success";

  useEffect(() => {
    if (!showSuccessOverlay) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowSuccessOverlay(false);
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [showSuccessOverlay]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData) as Record<FieldName, string>;
    const nextErrors: FieldErrors = {};
    const phoneDigits = values.phone.replace(/\D/g, "");

    if (values.name.trim().length < 2) {
      nextErrors.name = "Please enter your name.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!getFormField(form, "email")?.validity.valid) {
      nextErrors.email = "Enter a valid email address, such as name@example.com.";
    }

    if (
      values.phone.trim() &&
      (!/^\+?[\d\s().-]+$/.test(values.phone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15)
    ) {
      nextErrors.phone = "Enter a valid phone number. A country code is optional.";
    }

    if (values.message.trim().length < 10) {
      nextErrors.message = "Please enter a brief message (at least 10 characters).";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setStatus({
        type: "error",
        message: "Please correct the highlighted field and try again.",
      });
      const firstInvalidField = fieldNames.find((name) => nextErrors[name]);
      if (firstInvalidField) {
        getFormField(form, firstInvalidField)?.focus();
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        message?: string;
        fieldErrors?: Partial<Record<FieldName, string[]>>;
      };

      if (!response.ok) {
        if (data.fieldErrors) {
          const apiErrors = Object.fromEntries(
            Object.entries(data.fieldErrors)
              .filter(([, messages]) => messages?.[0])
              .map(([name, messages]) => [name, messages?.[0]]),
          ) as FieldErrors;
          setFieldErrors(apiErrors);
          const firstInvalidField = fieldNames.find((name) => apiErrors[name]);
          if (firstInvalidField) {
            getFormField(form, firstInvalidField)?.focus();
          }
        }
        throw new Error(data.message || "Please check the form and try again.");
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Thank you. Your message has been sent to the practice.",
      });
      setShowSuccessOverlay(true);
      setFieldErrors({});
      form.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFieldError(field: FieldName) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  return (
    <>
      <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="font-semibold text-ink" htmlFor="name">
            Name
          </label>
          <input
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={Boolean(fieldErrors.name)}
            autoComplete="name"
            className={getInputClassName(Boolean(fieldErrors.name))}
            disabled={isSent}
            id="name"
            name="name"
            onChange={() => clearFieldError("name")}
            required
            type="text"
          />
          {fieldErrors.name ? (
            <p className="text-sm font-semibold text-warn" id="name-error">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className="font-semibold text-ink" htmlFor="email">
            Email
          </label>
          <input
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            className={getInputClassName(Boolean(fieldErrors.email))}
            disabled={isSent}
            id="email"
            name="email"
            onChange={() => clearFieldError("email")}
            required
            type="email"
          />
          {fieldErrors.email ? (
            <p className="text-sm font-semibold text-warn" id="email-error">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className="font-semibold text-ink" htmlFor="phone">
            Phone
          </label>
          <input
            aria-describedby={fieldErrors.phone ? "phone-error phone-hint" : "phone-hint"}
            aria-invalid={Boolean(fieldErrors.phone)}
            autoComplete="tel"
            className={getInputClassName(Boolean(fieldErrors.phone))}
            disabled={isSent}
            id="phone"
            inputMode="tel"
            name="phone"
            onChange={() => clearFieldError("phone")}
            placeholder="(908) 555-1234"
            type="tel"
          />
          <p className="text-sm text-ink/60" id="phone-hint">
            Optional. A country code is not required.
          </p>
          {fieldErrors.phone ? (
            <p className="text-sm font-semibold text-warn" id="phone-error">
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label className="font-semibold text-ink" htmlFor="message">
            Message
          </label>
          <textarea
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            aria-invalid={Boolean(fieldErrors.message)}
            className={`${getInputClassName(Boolean(fieldErrors.message))} min-h-36`}
            disabled={isSent}
            id="message"
            name="message"
            onChange={() => clearFieldError("message")}
            required
          />
          {fieldErrors.message ? (
            <p className="text-sm font-semibold text-warn" id="message-error">
              {fieldErrors.message}
            </p>
          ) : null}
        </div>
        <p className="rounded-[16px] border border-cyan/20 bg-mist px-4 py-3 text-sm leading-6 text-ink">
          For urgent symptoms, call 911 or use urgent care. For this form, a
          general note is best.
        </p>
        <Button disabled={isSubmitting || isSent} type="submit" variant="cobalt">
          {isSent ? (
            <CheckCircle2 aria-hidden="true" size={18} />
          ) : (
            <Send aria-hidden="true" size={18} />
          )}
          {isSubmitting ? "Sending..." : isSent ? "Message Sent" : "Send Message"}
        </Button>
        {status.type !== "idle" ? (
          <p
            className={
              status.type === "success"
                ? "rounded-[12px] bg-mist p-3 font-semibold text-ink"
                : "rounded-[12px] bg-warn/12 p-3 font-semibold text-ink"
            }
            role="status"
          >
            {status.message}
          </p>
        ) : null}
      </form>

      {showSuccessOverlay ? (
        <div
          aria-labelledby="contact-success-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-deep-navy/84 px-5 py-8 backdrop-blur-sm"
          role="dialog"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-gold/55 bg-paper p-8 text-center shadow-[0_30px_100px_rgba(7,28,42,0.36)] md:p-10">
            <button
              aria-label="Close confirmation"
              autoFocus
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
              onClick={() => setShowSuccessOverlay(false)}
              type="button"
            >
              <X aria-hidden="true" size={19} />
            </button>
            <div className="mx-auto flex w-fit flex-col items-center">
              <div className="relative grid size-24 place-items-center rounded-[24px] border border-gold/60 bg-paper shadow-[0_18px_50px_rgba(26,53,87,0.16)]">
                <Image
                  alt="Premier NP Care"
                  className="h-16 w-16"
                  height={64}
                  priority
                  src="/images/logo-icon.png"
                  width={64}
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full border border-gold bg-deep-navy text-paper shadow-[0_10px_24px_rgba(26,53,87,0.22)]"
                >
                  <CheckCircle2 size={20} />
                </span>
              </div>
            </div>
            <p className="mt-6 label-caps text-cobalt">Premier NP Care</p>
            <h2
              className="mt-3 font-display text-4xl font-medium leading-tight text-ink md:text-5xl"
              id="contact-success-title"
            >
              Message sent.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-ink/72">
              Thank you. Your message was sent to the practice, and a
              confirmation email is on the way.
            </p>
            <div className="mx-auto mt-7 h-px w-24 bg-gold" />
            <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-ink/62">
              For urgent symptoms, call 911 or use urgent care.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
