"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  PieChart,
  Library,
  Calendar,
  MessageCircle,
  Cog,
  Phone,
  Bell,
  Target,
  User,
  CreditCard,
  Users,
  Calculator,
  ShoppingCart,
} from "lucide-react";
import { StudentTopNav } from "@/components/student/TopNav";
import { StudentSidebar } from "@/components/student/Sidebar";
import { DashboardView } from "@/components/student/DashboardView";
import { CoursesView } from "@/components/student/CoursesView";
import { AssignmentsView } from "@/components/student/AssignmentsView";
import { GradesView } from "@/components/student/GradesView";
import { LibraryView } from "@/components/student/LibraryView";
import { CalendarView } from "@/components/student/CalendarView";
import { MessagesView } from "@/components/student/MessagesView";
import { SettingsView } from "@/components/student/SettingsView";
import { EmergencyContactView } from "@/components/student/EmergencyContactView";
import { NotificationPreferencesView } from "@/components/student/NotificationPreferencesView";
import { DegreePlanningView } from "@/components/student/DegreePlanningView";
import { AdvisorCommunicationView } from "@/components/student/AdvisorCommunicationView";
import { FinanceServicesView } from "@/components/student/FinanceServicesView";
import { CampusLifeView } from "@/components/student/CampusLifeView";
import { CGPACalculatorView } from "@/components/student/CGPACalculatorView";
import { CourseRegistrationView } from "@/components/student/CourseRegistrationView";
import ProtectedRoute from "@/components/ProtectedRoute";

type StudentView =
  | "dashboard"
  | "courses"
  | "assignments"
  | "grades"
  | "library"
  | "calendar"
  | "messages"
  | "settings"
  | "emergency"
  | "notifications"
  | "degree-planning"
  | "advisor"
  | "finance"
  | "campus-life"
  | "cgpa-calculator"
  | "course-registration";
type NavItem = { id: StudentView; label: string; icon: ComponentType<{ size?: number }> };

const studentNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "course-registration", label: "Register for Courses", icon: ShoppingCart },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "grades", label: "Grades", icon: PieChart },
  { id: "library", label: "Library", icon: Library },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "emergency", label: "Emergency Contacts", icon: Phone },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "degree-planning", label: "Degree Planning", icon: Target },
  { id: "advisor", label: "Advisor", icon: User },
  { id: "finance", label: "Finance", icon: CreditCard },
  { id: "campus-life", label: "Campus Life", icon: Users },
  { id: "cgpa-calculator", label: "CGPA Calculator", icon: Calculator },
  { id: "settings", label: "Settings", icon: Cog },
];

export default function StudentDashboardPage() {
  const [activeView, setActiveView] = useState<StudentView>("dashboard");

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<string>;
      const detail = custom.detail as StudentView | undefined;
      if (detail) {
        setActiveView(detail);
      }
    };

    window.addEventListener("viewChange", handler as EventListener);
    return () => window.removeEventListener("viewChange", handler as EventListener);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "courses":
        return <CoursesView />;
      case "assignments":
        return <AssignmentsView />;
      case "grades":
        return <GradesView />;
      case "library":
        return <LibraryView />;
      case "calendar":
        return <CalendarView />;
      case "messages":
        return <MessagesView />;
      case "emergency":
        return <EmergencyContactView />;
      case "notifications":
        return <NotificationPreferencesView />;
      case "degree-planning":
        return <DegreePlanningView />;
      case "advisor":
        return <AdvisorCommunicationView />;
      case "finance":
        return <FinanceServicesView />;
      case "campus-life":
        return <CampusLifeView />;
      case "cgpa-calculator":
        return <CGPACalculatorView />;
      case "settings":
        return <SettingsView />;
      case "course-registration":
        return <CourseRegistrationView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-black text-white">
        {/* Top Navigation Bar */}
        <StudentTopNav />

        <div className="flex gap-0 md:gap-4 p-0 md:p-4">
          {/* Sidebar with mobile menu */}
          <StudentSidebar
            items={studentNavItems}
            activeId={activeView}
            onSelect={(id) => setActiveView(id as StudentView)}
          />

          {/* Main Content with responsive padding for mobile menu button */}
          <main className="flex-1 min-h-[calc(100vh-80px)] w-full md:w-auto">
            <div className="w-full">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}