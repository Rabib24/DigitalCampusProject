"use client";

import { useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  BookOpen,
  DollarSign,
  Calendar,
  FileText,
  User,
  TrendingUp,
  Award,
  Folder
} from "lucide-react";
import { AdminDashboardView } from "@/components/admin/views/AdminDashboardView";
import { AdminUserManagementView } from "@/components/admin/views/AdminUserManagementView";
import { AdminAnalyticsView } from "@/components/admin/views/AdminAnalyticsView";
import { AdminSettingsView } from "@/components/admin/views/AdminSettingsView";
import { AdminEnrollmentStatsView } from "@/components/admin/views/AdminEnrollmentStatsView";
import { AdminBudgetTrackingView } from "@/components/admin/views/AdminBudgetTrackingView";
import { AdminCourseManagementView } from "@/components/admin/views/AdminCourseManagementView";
import { AdminTimetableView } from "@/components/admin/views/AdminTimetableView";
import { AdminFacultyAssignmentView } from "@/components/admin/views/AdminFacultyAssignmentView";
import { AdminStaffRequestsView } from "@/components/admin/views/AdminStaffRequestsView";
import { AdminFacultyProfileView } from "@/components/admin/views/AdminFacultyProfileView";
import { AdminFacultyWorkloadView } from "@/components/admin/views/AdminFacultyWorkloadView";
import { AdminStudentEnrollmentView } from "@/components/admin/views/AdminStudentEnrollmentView";
import { AdminStudentProgressView } from "@/components/admin/views/AdminStudentProgressView";
import { AdminDocumentManagementView } from "@/components/admin/views/AdminDocumentManagementView";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "enrollment", label: "Enrollment Stats", icon: BarChart3 },
    { id: "budget", label: "Budget Tracking", icon: DollarSign },
    { id: "courses", label: "Course Management", icon: BookOpen },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "faculty", label: "Faculty Assignment", icon: Users },
    { id: "faculty-profile", label: "Faculty Profiles", icon: User },
    { id: "faculty-workload", label: "Faculty Workload", icon: TrendingUp },
    { id: "student-enrollment", label: "Student Enrollment", icon: Users },
    { id: "student-progress", label: "Student Progress", icon: Award },
    { id: "documents", label: "Document Management", icon: Folder },
    { id: "requests", label: "Staff Requests", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboardView />;
      case "users":
        return <AdminUserManagementView />;
      case "enrollment":
        return <AdminEnrollmentStatsView />;
      case "budget":
        return <AdminBudgetTrackingView />;
      case "courses":
        return <AdminCourseManagementView />;
      case "timetable":
        return <AdminTimetableView />;
      case "faculty":
        return <AdminFacultyAssignmentView />;
      case "faculty-profile":
        return <AdminFacultyProfileView />;
      case "faculty-workload":
        return <AdminFacultyWorkloadView />;
      case "student-enrollment":
        return <AdminStudentEnrollmentView />;
      case "student-progress":
        return <AdminStudentProgressView />;
      case "documents":
        return <AdminDocumentManagementView />;
      case "requests":
        return <AdminStaffRequestsView />;
      case "analytics":
        return <AdminAnalyticsView />;
      case "settings":
        return <AdminSettingsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminTopNav />
        
        <div className="flex">
          <AdminSidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}