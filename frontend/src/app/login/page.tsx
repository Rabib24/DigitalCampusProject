"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveAuthData } from "@/lib/auth";

const ROLES = [
  { id: "student", label: "Student", description: "Access courses and assignments" },
  { id: "faculty", label: "Faculty", description: "Manage classes and grades" },
  { id: "admin", label: "Department Admin", description: "Administrative control" },
  { id: "advisor", label: "Academic Advisor", description: "Student advising" },
  { id: "library", label: "Library Staff", description: "Library management" },
  { id: "finance", label: "Finance Admin", description: "Financial management" },
  { id: "research", label: "Research Admin", description: "Research management" },
  { id: "it-admin", label: "IT Admin", description: "System administration" },
];

export default function LoginPage() {
  const [step, setStep] = useState<"role-select" | "login">("role-select");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleFromQuery = searchParams.get("role");
    if (roleFromQuery && ROLES.some((r) => r.id === roleFromQuery)) {
      setSelectedRole(roleFromQuery);
      setStep("login");
    }
  }, [searchParams]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep("login");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Determine the correct endpoint based on the selected role
      const endpoint = selectedRole === 'faculty'
        ? "http://localhost:8000/api/v1/faculty/auth/login/"
        : "http://localhost:8000/api/v1/auth/login/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Server error. Please make sure the backend server is running and try again.");
        console.error("Non-JSON response received:", await response.text());
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Save authentication data
        saveAuthData(data.token, data.user);

        // Redirect based on role from user data
        const roleMap: Record<string, string> = {
          student: "/student",
          faculty: "/faculty",
          advisor: "/advisor",
          admin: "/admin",
          finance: "/finance",
          library: "/library",
          research: "/research",
          "it-admin": "/it-admin",
        };
        router.push(roleMap[data.user.role || "student"] || "/student");
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          setError(data.message || "Invalid credentials. Please check your email/username and password.");
        } else if (response.status === 403) {
          setError(data.message || "Account access denied. Please contact administrator.");
        } else if (response.status === 429) {
          setError(data.message || "Too many login attempts. Please try again later.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      setError("An error occurred during login. Please check your network connection and make sure the backend server is running.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRoles = () => {
    setStep("role-select");
    setSelectedRole(null);
    setEmail("");
    setPassword("");
    setError(null);
  };

  const selectedRoleInfo = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-4xl mx-auto">
        {step === "role-select" ? (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Welcome Back</h1>
              <p className="text-sm text-zinc-400">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-left transition-all hover:border-white/70 hover:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium group-hover:text-white transition-colors">
                      {role.label}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400">{role.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-zinc-200 hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-xl bg-zinc-950">
            <div className="space-y-3 border-b border-zinc-800 px-6 pt-6 pb-4">
              <button
                onClick={handleBackToRoles}
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-2"
              >
                ← Back to roles
              </button>
              <h2 className="text-2xl md:text-3xl font-semibold">Sign In</h2>
              <p className="text-xs text-zinc-400">
                Logging in as <span className="font-medium text-zinc-100">{selectedRoleInfo?.label}</span>
              </p>
            </div>

            <div className="px-6 pb-6 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-900/50 border border-red-800 p-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="text"
                    placeholder="student@iub.edu.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-zinc-300 hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 inline-flex items-center justify-center rounded-md bg-white text-black text-sm font-medium transition-colors hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-zinc-200 hover:underline font-medium">
                  Create one now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}