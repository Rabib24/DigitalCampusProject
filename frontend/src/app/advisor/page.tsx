"use client";

import { useState } from "react";
import { AdvisorTopNav } from "@/components/advisor/AdvisorTopNav";
import { AdvisorSidebar } from "@/components/advisor/AdvisorSidebar";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  Award,
  MessageCircle,
  RotateCcw,
  Calculator,
  AlertTriangle
} from "lucide-react";
import { AdvisorDashboardView } from "@/components/advisor/views/AdvisorDashboardView";
import { AdvisorAdviseesView } from "@/components/advisor/views/AdvisorAdviseesView";
import { AdvisorAppointmentsView } from "@/components/advisor/views/AdvisorAppointmentsView";
import { AdvisorReviewsView } from "@/components/advisor/views/AdvisorReviewsView";
import { AdvisorProgressTrackingView } from "@/components/advisor/views/AdvisorProgressTrackingView";
import { AdvisorMessagesView } from "@/components/advisor/views/AdvisorMessagesView";
import { AdvisorReportsView } from "@/components/advisor/views/AdvisorReportsView";
import { AdvisorRetakeRecommendationView } from "@/components/advisor/views/AdvisorRetakeRecommendationView";
import { AdvisorWhatIfScenarioView } from "@/components/advisor/views/AdvisorWhatIfScenarioView";
import { AdvisorEarlyWarningView } from "@/components/advisor/views/AdvisorEarlyWarningView";
import { AdvisorProtectedRoute } from "@/components/advisor/AdvisorProtectedRoute";

export default function AdvisorDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "advisees", label: "Advisees", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "reviews", label: "Reviews", icon: FileText },
    { id: "progress", label: "Progress Tracking", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "reports", label: "Reports", icon: Award },
    { id: "retake", label: "Retake Recommendations", icon: RotateCcw },
    { id: "whatif", label: "What-if Scenarios", icon: Calculator },
    { id: "warning", label: "Early Warning", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <AdvisorDashboardView />;
      case "advisees":
        return <AdvisorAdviseesView />;
      case "appointments":
        return <AdvisorAppointmentsView />;
      case "reviews":
        return <AdvisorReviewsView />;
      case "progress":
        return <AdvisorProgressTrackingView />;
      case "messages":
        return <AdvisorMessagesView />;
      case "reports":
        return <AdvisorReportsView />;
      case "retake":
        return <AdvisorRetakeRecommendationView />;
      case "whatif":
        return <AdvisorWhatIfScenarioView />;
      case "warning":
        return <AdvisorEarlyWarningView />;
      default:
        return <AdvisorDashboardView />;
    }
  };

  return (
    <AdvisorProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdvisorTopNav />
        
        <div className="flex">
          <AdvisorSidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </AdvisorProtectedRoute>
  );
}