"use client";

import { useState } from "react";
import { ITAdminTopNav } from "@/components/it-admin/ITAdminTopNav";
import { ITAdminSidebar } from "@/components/it-admin/ITAdminSidebar";
import { 
  LayoutDashboard, 
  Shield, 
  Monitor, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Database,
  Wifi
} from "lucide-react";
import { ITAdminDashboardView } from "@/components/it-admin/views/ITAdminDashboardView";
import { ITAdminSecurityView } from "@/components/it-admin/views/ITAdminSecurityView";
import { ITAdminSystemsView } from "@/components/it-admin/views/ITAdminSystemsView";
import { ITAdminNetworkView } from "@/components/it-admin/views/ITAdminNetworkView";
import { ITAdminDatabaseView } from "@/components/it-admin/views/ITAdminDatabaseView";
import { ITAdminUserManagementView } from "@/components/it-admin/views/ITAdminUserManagementView";
import { ITAdminReportsView } from "@/components/it-admin/views/ITAdminReportsView";
import { ITAdminProtectedRoute } from "@/components/it-admin/ITAdminProtectedRoute";

export default function ITAdminDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "security", label: "Security", icon: Shield },
    { id: "systems", label: "Systems", icon: Monitor },
    { id: "network", label: "Network", icon: Wifi },
    { id: "database", label: "Database", icon: Database },
    { id: "users", label: "User Management", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <ITAdminDashboardView />;
      case "security":
        return <ITAdminSecurityView />;
      case "systems":
        return <ITAdminSystemsView />;
      case "network":
        return <ITAdminNetworkView />;
      case "database":
        return <ITAdminDatabaseView />;
      case "users":
        return <ITAdminUserManagementView />;
      case "reports":
        return <ITAdminReportsView />;
      default:
        return <ITAdminDashboardView />;
    }
  };

  return (
    <ITAdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <ITAdminTopNav />
        
        <div className="flex">
          <ITAdminSidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </ITAdminProtectedRoute>
  );
}