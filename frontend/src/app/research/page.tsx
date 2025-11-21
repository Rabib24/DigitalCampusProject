"use client";

import { useState } from "react";
import { ResearchTopNav } from "@/components/research/ResearchTopNav";
import { ResearchSidebar } from "@/components/research/ResearchSidebar";
import { 
  LayoutDashboard, 
  FlaskConical, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  Calendar,
  Award,
  CheckCircle,
  Shield,
  UserCheck
} from "lucide-react";
import { ResearchDashboardView } from "@/components/research/views/ResearchDashboardView";
import { ResearchProjectsView } from "@/components/research/views/ResearchProjectsView";
import { ResearchPublicationsView } from "@/components/research/views/ResearchPublicationsView";
import { ResearchResearchersView } from "@/components/research/views/ResearchResearchersView";
import { ResearchGrantsView } from "@/components/research/views/ResearchGrantsView";
import { ResearchEventsView } from "@/components/research/views/ResearchEventsView";
import { ResearchAnalyticsView } from "@/components/research/views/ResearchAnalyticsView";
import { ResearchApprovalWorkflowView } from "@/components/research/views/ResearchApprovalWorkflowView";
import { ResearchEthicsView } from "@/components/research/views/ResearchEthicsView";
import { ResearchPublicationManagementView } from "@/components/research/views/ResearchPublicationManagementView";
import { ResearchCollaborationView } from "@/components/research/views/ResearchCollaborationView";
import { ResearchProtectedRoute } from "@/components/research/ResearchProtectedRoute";

export default function ResearchDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FlaskConical },
    { id: "publications", label: "Publications", icon: FileText },
    { id: "researchers", label: "Researchers", icon: Users },
    { id: "grants", label: "Grants", icon: Award },
    { id: "events", label: "Events", icon: Calendar },
    { id: "approval", label: "Approval Workflow", icon: CheckCircle },
    { id: "ethics", label: "Ethics Management", icon: Shield },
    { id: "pub-management", label: "Publication Management", icon: FileText },
    { id: "collaboration", label: "Collaboration", icon: UserCheck },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <ResearchDashboardView />;
      case "projects":
        return <ResearchProjectsView />;
      case "publications":
        return <ResearchPublicationsView />;
      case "researchers":
        return <ResearchResearchersView />;
      case "grants":
        return <ResearchGrantsView />;
      case "events":
        return <ResearchEventsView />;
      case "approval":
        return <ResearchApprovalWorkflowView />;
      case "ethics":
        return <ResearchEthicsView />;
      case "pub-management":
        return <ResearchPublicationManagementView />;
      case "collaboration":
        return <ResearchCollaborationView />;
      case "analytics":
        return <ResearchAnalyticsView />;
      default:
        return <ResearchDashboardView />;
    }
  };

  return (
    <ResearchProtectedRoute>
      <div className="min-h-screen bg-background">
        <ResearchTopNav />
        
        <div className="flex">
          <ResearchSidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </ResearchProtectedRoute>
  );
}