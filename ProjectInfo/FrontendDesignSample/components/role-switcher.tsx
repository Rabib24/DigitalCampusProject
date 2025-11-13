"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, BookOpen, Shield, LogOut, Briefcase, DollarSign, Award } from "lucide-react"

interface RoleSwitcherProps {
  onSelectRole: (
    role: "student" | "faculty" | "admin" | "library" | "it-admin" | "advisor" | "finance" | "research",
  ) => void
  onLogout?: () => void
}

export function RoleSwitcher({ onSelectRole, onLogout }: RoleSwitcherProps) {
  const roles = [
    {
      role: "student" as const,
      title: "Student",
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Access courses, assignments, and grades",
    },
    {
      role: "faculty" as const,
      title: "Faculty",
      icon: Users,
      color: "bg-purple-500",
      description: "Manage classes and grading",
    },
    {
      role: "advisor" as const,
      title: "Academic Advisor",
      icon: Briefcase,
      color: "bg-cyan-500",
      description: "Guide students and track progress",
    },
    {
      role: "admin" as const,
      title: "Department Admin",
      icon: Building,
      color: "bg-green-500",
      description: "Manage departments and resources",
    },
    {
      role: "finance" as const,
      title: "Finance Admin",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: "Manage payments and invoices",
    },
    {
      role: "library" as const,
      title: "Library Staff",
      icon: BookOpen,
      color: "bg-orange-500",
      description: "Manage books and patrons",
    },
    {
      role: "research" as const,
      title: "Research Admin",
      icon: Award,
      color: "bg-violet-500",
      description: "Manage research projects",
    },
    {
      role: "it-admin" as const,
      title: "IT Admin",
      icon: Shield,
      color: "bg-red-500",
      description: "Monitor system and security",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">IUB Digital Campus</h1>
          <p className="text-muted-foreground text-lg">Select your role to access the dashboard</p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {roles.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.role}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary group"
                onClick={() => onSelectRole(item.role)}
              >
                <CardHeader className="text-center p-4 md:p-6">
                  <div
                    className={`w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-xs mt-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Access
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer with Logout */}
        {onLogout && (
          <div className="flex justify-center">
            <Button variant="outline" className="bg-transparent gap-2" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 text-muted-foreground text-sm">
          <p>© 2025 IUB Digital Campus. All rights reserved.</p>
          <p className="mt-2">Click on a role to access the respective dashboard</p>
        </div>
      </div>
    </div>
  )
}
