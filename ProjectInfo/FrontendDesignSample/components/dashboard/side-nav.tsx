"use client"

import { Button } from "@/components/ui/button"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  Cog,
  Library,
  MessageCircle,
  PieChart,
  Users,
  Video,
  TrendingUp,
  BookMarked,
  Building,
  Briefcase,
  Shield,
  AlertCircle,
  Award,
  DollarSign,
} from "lucide-react"

const studentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "grades", label: "Grades", icon: PieChart },
  { id: "library", label: "Library", icon: Library },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "settings", label: "Settings", icon: Cog },
]

const facultyNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Classes", icon: BookOpen },
  { id: "gradebook", label: "Gradebook", icon: PieChart },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "recordings", label: "Recordings", icon: Video },
  { id: "advising", label: "Advising", icon: Users },
  { id: "research", label: "Research", icon: BookMarked },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Cog },
]

const advisorNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "advisees", label: "My Advisees", icon: Users },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "cgpa-simulator", label: "CGPA Simulator", icon: PieChart },
  { id: "milestones", label: "Milestones", icon: ClipboardList },
  { id: "settings", label: "Settings", icon: Cog },
]

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "budget", label: "Budget", icon: TrendingUp },
  { id: "faculty", label: "Faculty", icon: Users },
  { id: "students", label: "Students", icon: Library },
  { id: "requests", label: "Requests", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "settings", label: "Settings", icon: Cog },
]

const financeNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "scholarships", label: "Scholarships", icon: Award },
  { id: "billing", label: "Billing History", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "settings", label: "Settings", icon: Cog },
]

const libraryNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "catalog", label: "Catalog", icon: BookOpen },
  { id: "loans", label: "Loans", icon: Briefcase },
  { id: "patrons", label: "Patrons", icon: Users },
  { id: "digital", label: "Digital Resources", icon: Library },
  { id: "overdue", label: "Overdue Items", icon: AlertCircle },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "settings", label: "Settings", icon: Cog },
]

const researchNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "approvals", label: "Project Approvals", icon: CheckCircle },
  { id: "grants", label: "Grants", icon: DollarSign },
  { id: "publications", label: "Publications", icon: BookOpen },
  { id: "ethics", label: "Ethics Approval", icon: Shield },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "settings", label: "Settings", icon: Cog },
]

const itAdminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "security", label: "Security", icon: Shield },
  { id: "health", label: "System Health", icon: TrendingUp },
  { id: "backup", label: "Backup", icon: Building },
  { id: "logs", label: "Logs", icon: ClipboardList },
  { id: "integrations", label: "Integrations", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Cog },
]

import { FileText, CheckCircle } from "lucide-react"

export function SideNav({
  activeView,
  onViewChange,
  userRole = "student",
}: {
  activeView: string
  onViewChange: (view: string) => void
  userRole?: "student" | "faculty" | "admin" | "library" | "it-admin" | "advisor" | "finance" | "research"
}) {
  const getNavItems = () => {
    switch (userRole) {
      case "faculty":
        return facultyNavItems
      case "advisor":
        return advisorNavItems
      case "admin":
        return adminNavItems
      case "finance":
        return financeNavItems
      case "library":
        return libraryNavItems
      case "research":
        return researchNavItems
      case "it-admin":
        return itAdminNavItems
      default:
        return studentNavItems
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-border bg-card p-4 md:sticky md:top-20">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              variant={activeView === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
