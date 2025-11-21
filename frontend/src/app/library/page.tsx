"use client";

import { useState } from "react";
import { LibraryTopNav } from "@/components/library/LibraryTopNav";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  Calendar,
  BarChart3,
  Search,
  Clock,
  Package
} from "lucide-react";
import { LibraryDashboardView } from "@/components/library/views/LibraryDashboardView";
import { LibraryAnalyticsView } from "@/components/library/views/LibraryAnalyticsView";
import { LibraryBookCatalogView } from "@/components/library/views/LibraryBookCatalogView";
import { LibraryDigitalResourcesView } from "@/components/library/views/LibraryDigitalResourcesView";
import { LibraryLoanManagementView } from "@/components/library/views/LibraryLoanManagementView";
import { LibraryOverdueItemsView } from "@/components/library/views/LibraryOverdueItemsView";
import { LibraryPatronManagementView } from "@/components/library/views/LibraryPatronManagementView";
import { LibrarySettingsView } from "@/components/library/views/LibrarySettingsView";
import { LibraryReservationView } from "@/components/library/views/LibraryReservationView";
import { LibraryInventoryView } from "@/components/library/views/LibraryInventoryView";
import { LibraryProtectedRoute } from "@/components/library/LibraryProtectedRoute";

export default function LibraryDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "catalog", label: "Book Catalog", icon: BookOpen },
    { id: "members", label: "Patron Management", icon: Users },
    { id: "loans", label: "Loan Management", icon: FileText },
    { id: "overdue", label: "Overdue Items", icon: Calendar },
    { id: "digital", label: "Digital Resources", icon: Search },
    { id: "reservations", label: "Reservations", icon: Clock },
    { id: "inventory", label: "Inventory Management", icon: Package },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <LibraryDashboardView />;
      case "catalog":
        return <LibraryBookCatalogView />;
      case "members":
        return <LibraryPatronManagementView />;
      case "loans":
        return <LibraryLoanManagementView />;
      case "overdue":
        return <LibraryOverdueItemsView />;
      case "digital":
        return <LibraryDigitalResourcesView />;
      case "reservations":
        return <LibraryReservationView />;
      case "inventory":
        return <LibraryInventoryView />;
      case "analytics":
        return <LibraryAnalyticsView />;
      case "settings":
        return <LibrarySettingsView />;
      default:
        return <LibraryDashboardView />;
    }
  };

  return (
    <LibraryProtectedRoute>
      <div className="min-h-screen bg-background">
        <LibraryTopNav />
        
        <div className="flex">
          <LibrarySidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </LibraryProtectedRoute>
  );
}