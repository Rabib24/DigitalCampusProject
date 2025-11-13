"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ROLES = [
  { id: "student", label: "Student", description: "Access courses and assignments" },
  { id: "faculty", label: "Faculty", description: "Manage classes and grades" },
  { id: "admin", label: "Department Admin", description: "Administrative control" },
  { id: "advisor", label: "Academic Advisor", description: "Student advising" },
  { id: "library", label: "Library Staff", description: "Library management" },
  { id: "finance", label: "Finance Admin", description: "Financial management" },
  { id: "research", label: "Research Admin", description: "Research management" },
  { id: "it-admin", label: "IT Admin", description: "System administration" },
]

export default function LoginPage() {
  const [step, setStep] = useState<"role-select" | "login">("role-select")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setStep("login")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      const roleMap: Record<string, string> = {
        student: "/",
        faculty: "/faculty",
        advisor: "/advisor",
        admin: "/admin",
        finance: "/finance",
        library: "/library",
        research: "/research",
        "it-admin": "/it-admin",
      }
      router.push(roleMap[selectedRole || "student"] || "/")
    }, 1500)
  }

  const handleBackToRoles = () => {
    setStep("role-select")
    setSelectedRole(null)
    setEmail("")
    setPassword("")
  }

  const selectedRoleInfo = ROLES.find((r) => r.id === selectedRole)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "role-select" ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground">Select your role to continue</p>
            </div>

            <div className="grid gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {role.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-3">
              <button
                onClick={handleBackToRoles}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                ← Back to roles
              </button>
              <CardTitle className="text-2xl md:text-3xl">Sign In</CardTitle>
              <CardDescription>
                Logging in as <span className="font-medium text-primary">{selectedRoleInfo?.label}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Username</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="student@iub.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <Button type="submit" className="w-full h-10 text-base" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Create one now
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
