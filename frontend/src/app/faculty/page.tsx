"use client";

import { useState } from "react";
import { FacultyProvider } from "@/hooks/faculty/FacultyContext";
import { FacultyTopNav } from "@/components/faculty/FacultyTopNav";
import { FacultySidebar } from "@/components/faculty/FacultySidebar";
import { BookOpen, Users, FileText, BarChart3, Calendar, MessageCircle, Video, Search, Award, Settings, CheckCircle } from "lucide-react";
import { FacultyDashboardView } from "@/components/faculty/views/FacultyDashboardView";
import { FacultyCoursesView } from "@/components/faculty/views/FacultyCoursesView";
import { FacultyAssignmentsView } from "@/components/faculty/views/FacultyAssignmentsView";
import { FacultyGradebookView } from "@/components/faculty/views/FacultyGradebookView";
import { FacultyAdvisingView } from "@/components/faculty/views/FacultyAdvisingView";
import { FacultyResearchView } from "@/components/faculty/views/FacultyResearchView";
import { FacultyRecordingsView } from "@/components/faculty/views/FacultyRecordingsView";
import { FacultyAnalyticsView } from "@/components/faculty/views/FacultyAnalyticsView";
import { FacultySettingsView } from "@/components/faculty/views/FacultySettingsView";
import { FacultyApprovalRequestsView } from "@/components/faculty/views/FacultyApprovalRequestsView";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

export default function FacultyDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BookOpen },
    { id: "courses", label: "My Classes", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "gradebook", label: "Gradebook", icon: BarChart3 },
    { id: "advising", label: "Advising", icon: Users },
    { id: "approval-requests", label: "Approval Requests", icon: CheckCircle },
    { id: "research", label: "Research", icon: Award },
    { id: "recordings", label: "Recordings", icon: Video },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <FacultyDashboardView />;
      case "courses":
        return <FacultyCoursesView />;
      case "assignments":
        return <FacultyAssignmentsView />;
      case "gradebook":
        return <FacultyGradebookView />;
      case "advising":
        return <FacultyAdvisingView />;
      case "approval-requests":
        return <FacultyApprovalRequestsView />;
      case "research":
        return <FacultyResearchView />;
      case "recordings":
        return <FacultyRecordingsView />;
      case "analytics":
        return <FacultyAnalyticsView />;
      case "settings":
        return <FacultySettingsView />;
      default:
        return <FacultyDashboardView />;
    }
  };

  return (
    <FacultyProtectedRoute>
      <FacultyProvider>
        <div className="min-h-screen bg-background">
          <FacultyTopNav />
          
          <div className="flex">
            <FacultySidebar 
              items={sidebarItems} 
              activeId={activeView} 
              onSelect={setActiveView} 
            />
            
            <main className="flex-1 p-6 pt-20 md:pt-6">
              {renderView()}
            </main>
          </div>
        </div>
      </FacultyProvider>
    </FacultyProtectedRoute>
  );
}