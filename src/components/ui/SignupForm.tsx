"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email signup, UI only. It validates the address and shows a success state,
 * but nothing is sent or stored. To make it real, post `email` to your
 * provider (Klaviyo, Shopify, Mailchimp) inside `onSubmit`.
 */
export function SignupForm() {
  const { signup } = site.footer;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus(EMAIL.test(email.trim()) ? "done" : "error");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-md">
      <div
        className={`flex items-center gap-2 rounded-full border bg-ink-2 p-1.5 pl-5 transition-colors duration-300 focus-within:border-frost/60 ${
          status === "error" ? "border-accent" : "border-line"
        }`}
      >
        <label htmlFor="signup-email" className="sr-only">
          {signup.placeholder}
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          disabled={status === "done"}
          aria-invalid={status === "error"}
          aria-describedby="signup-status"
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={signup.placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-frost outline-none placeholder:text-mute disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "done"}
          className="shrink-0 rounded-full bg-frost px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-accent hover:text-accent-ink disabled:bg-accent disabled:text-accent-ink"
        >
          {status === "done" ? "Done" : signup.button}
        </button>
      </div>
      <p id="signup-status" role="status" className="eyebrow mt-3 min-h-4 pl-5 text-accent">
        {status === "done" ? signup.success : status === "error" ? signup.error : ""}
      </p>
    </form>
  );
}
