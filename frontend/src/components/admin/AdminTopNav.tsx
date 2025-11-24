"use client";

import { useState } from "react";
import { Bell, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

interface AdminTopNavProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AdminTopNav({ onMobileMenuToggle, isMobileMenuOpen }: AdminTopNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-topnav-border bg-topnav-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-topnav-foreground hover:bg-sidebar-hover"
            onClick={onMobileMenuToggle}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-active flex items-center justify-center">
              <span className="text-sidebar-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-topnav-foreground">Admin Dashboard</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px] border border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative text-topnav-foreground hover:bg-sidebar-hover">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-sidebar-active text-sidebar-foreground">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-foreground" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-topnav-foreground">Admin User</span>
          </div>
          
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}