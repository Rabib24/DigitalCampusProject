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
  Folder,
  Shield,
  GraduationCap,
  FileSpreadsheet
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
// New imports for unified admin dashboard
import { AdminPermissionManagementView } from "@/components/admin/views/AdminPermissionManagementView";
import { AdminGradeManagementView } from "@/components/admin/views/AdminGradeManagementView";
import { AdminReportingView } from "@/components/admin/views/AdminReportingView";
import { AdminStudentManagementView } from "@/components/admin/views/AdminStudentManagementView";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "permissions", label: "Permission Management", icon: Shield },
    { id: "enrollment", label: "Enrollment Stats", icon: BarChart3 },
    { id: "budget", label: "Budget Tracking", icon: DollarSign },
    { id: "courses", label: "Course Management", icon: BookOpen },
    { id: "grades", label: "Grade Management", icon: FileSpreadsheet },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "faculty", label: "Faculty Assignment", icon: Users },
    { id: "faculty-profile", label: "Faculty Profiles", icon: User },
    { id: "faculty-workload", label: "Faculty Workload", icon: TrendingUp },
    { id: "student-management", label: "Student Management", icon: GraduationCap },
    { id: "student-enrollment", label: "Student Enrollment", icon: Users },
    { id: "student-progress", label: "Student Progress", icon: Award },
    { id: "documents", label: "Document Management", icon: Folder },
    { id: "requests", label: "Staff Requests", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboardView />;
      case "users":
        return <AdminUserManagementView />;
      case "permissions":
        return <AdminPermissionManagementView />;
      case "enrollment":
        return <AdminEnrollmentStatsView />;
      case "budget":
        return <AdminBudgetTrackingView />;
      case "courses":
        return <AdminCourseManagementView />;
      case "grades":
        return <AdminGradeManagementView />;
      case "timetable":
        return <AdminTimetableView />;
      case "faculty":
        return <AdminFacultyAssignmentView />;
      case "faculty-profile":
        return <AdminFacultyProfileView />;
      case "faculty-workload":
        return <AdminFacultyWorkloadView />;
      case "student-management":
        return <AdminStudentManagementView />;
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
      case "reports":
        return <AdminReportingView />;
      case "settings":
        return <AdminSettingsView />;
      default:
        return <AdminDashboardView />;
    }
  };

  // Function to handle view selection (closes mobile menu)
  const handleViewSelect = (id: string) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminTopNav 
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <div className="flex">
          {/* Desktop sidebar - always visible on md+ screens */}
          <div className="hidden md:block">
            <AdminSidebar 
              items={sidebarItems} 
              activeId={activeView} 
              onSelect={handleViewSelect} 
            />
          </div>
          
          {/* Mobile sidebar - only visible when menu is open */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-background flex" onClick={e => e.stopPropagation()}>
                <AdminSidebar 
                  items={sidebarItems} 
                  activeId={activeView} 
                  onSelect={handleViewSelect} 
                />
              </div>
            </div>
          )}
          
          {/* Main content with proper padding to avoid overlap with sidebar */}
          <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'md:ml-0' : 'md:ml-64'} pt-16 md:pt-0 p-6`}>
            {renderView()}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}