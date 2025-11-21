"use client";

import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  Calendar,
  BarChart3,
  Search
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

interface LibrarySidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function LibrarySidebar({ items, activeId, onSelect }: LibrarySidebarProps) {
  return (
    <TooltipProvider>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col border-r bg-background">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-4 border-b">
              <h2 className="text-lg font-semibold">Library Panel</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-2">
                {items.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeId === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => onSelect(item.id)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className="fixed inset-y-0 left-0 z-50 w-16 flex-col border-r bg-background flex">
          <div className="flex flex-col items-center py-4 space-y-4">
            {items.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeId === item.id ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onSelect(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}