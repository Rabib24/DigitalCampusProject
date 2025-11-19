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
import ProtectedRoute from "@/components/ProtectedRoute";

type StudentView =
  | "dashboard"
  | "courses"
  | "assignments"
  | "grades"
  | "library"
  | "calendar"
  | "messages"
  | "settings";
type NavItem = { id: StudentView; label: string; icon: ComponentType<{ size?: number }> };

const studentNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "grades", label: "Grades", icon: PieChart },
  { id: "library", label: "Library", icon: Library },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageCircle },
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
      case "settings":
        return <SettingsView />;
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
          {/* Sidebar */}
          <StudentSidebar
            items={studentNavItems}
            activeId={activeView}
            onSelect={(id) => setActiveView(id as StudentView)}
          />

          {/* Main Content */}
          <main className="flex-1 min-h-[calc(100vh-80px)]">{renderView()}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}