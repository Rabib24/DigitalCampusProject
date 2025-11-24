"use client";

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  DollarSign, 
  Settings, 
  Monitor, 
  Shield,
  FileText,
  BarChart3,
  Calendar,
  MessageCircle,
  TrendingUp,
  Award,
  Folder,
  GraduationCap,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function AdminSidebar({ items, activeId, onSelect }: AdminSidebarProps) {
  return (
    <TooltipProvider>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-30">
        <div className="flex flex-col border-r bg-sidebar-background h-full">
          <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h2>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {items.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeId === item.id ? "secondary" : "ghost"}
                      className={`w-full justify-start h-10 px-3 py-2 text-left ${
                        activeId === item.id 
                          ? "bg-sidebar-active text-sidebar-foreground hover:bg-sidebar-active/90" 
                          : "text-sidebar-foreground hover:bg-sidebar-hover"
                      }`}
                      onClick={() => onSelect(item.id)}
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">{item.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar - improved positioning */}
      <div className="md:hidden fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-sidebar-background flex">
        <div className="flex flex-col items-center py-4 space-y-4 overflow-y-auto">
          {items.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeId === item.id ? "secondary" : "ghost"}
                  onClick={() => onSelect(item.id)}
                  className={`h-10 flex-row items-center justify-start p-0 ${
                    activeId === item.id 
                      ? "bg-sidebar-active text-sidebar-foreground hover:bg-sidebar-active/90" 
                      : "text-sidebar-foreground hover:bg-sidebar-hover"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}