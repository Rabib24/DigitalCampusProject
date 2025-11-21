"use client";

import { useState } from "react";
import { Bell, Search, User, Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ResearchTopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Research Admin Dashboard</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search projects, publications..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px] border"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              7
            </Badge>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:inline text-sm font-medium">Research Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}