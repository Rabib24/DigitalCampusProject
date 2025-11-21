"use client";

import { useState } from "react";
import { FinanceTopNav } from "@/components/finance/FinanceTopNav";
import { FinanceSidebar } from "@/components/finance/FinanceSidebar";
import { 
  LayoutDashboard, 
  DollarSign, 
  FileText, 
  BarChart3, 
  Settings, 
  Users,
  Calendar,
  CreditCard
} from "lucide-react";
import { FinanceDashboardView } from "@/components/finance/views/FinanceDashboardView";
import { FinanceProtectedRoute } from "@/components/finance/FinanceProtectedRoute";

export default function FinanceDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "subscriptions", label: "Subscriptions", icon: Calendar },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <FinanceDashboardView />;
      default:
        return <FinanceDashboardView />;
    }
  };

  return (
    <FinanceProtectedRoute>
      <div className="min-h-screen bg-background">
        <FinanceTopNav />
        
        <div className="flex">
          <FinanceSidebar 
            items={sidebarItems} 
            activeId={activeView} 
            onSelect={setActiveView} 
          />
          
          <main className="flex-1 p-6 pt-20 md:pt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </FinanceProtectedRoute>
  );
}