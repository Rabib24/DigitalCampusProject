"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-0 rounded-xl shadow-lg bg-card">
          <div className="space-y-3 px-6 pt-6 pb-4 border-b">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              12 Back to login
            </Link>

            {!isSubmitted ? (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center pt-4">
                  <div className="text-5xl">✓</div>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-center">Email Sent</h1>
                <p className="text-sm text-muted-foreground text-center">
                  Check your email for a link to reset your password.
                </p>
              </>
            )}
          </div>

          <div className="px-6 pb-6 pt-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="student@iub.edu.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <button
                  type="button"
                  className="w-full h-10 inline-flex items-center justify-center rounded-md border bg-transparent text-sm font-medium text-foreground hover:bg-accent"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                >
                  Try Another Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
