"use client";

import type React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface StudentSidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface StudentSidebarProps {
  items: StudentSidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function StudentSidebar({ items, activeId, onSelect }: StudentSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsMobileMenuOpen(false); // Close mobile menu when an item is selected
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-6 left-4 z-50 p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300 shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
        type="button"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 p-4 overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 mt-2">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                className="p-2 rounded-md text-zinc-300 hover:bg-zinc-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full inline-flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeId === item.id
                      ? "bg-white text-black"
                      : "bg-transparent text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  {(() => {
                    const Icon = item.icon;
                    return <Icon size={18} />;
                  })()}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-64 flex-shrink-0">
        <div className="h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <nav className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full inline-flex items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeId === item.id
                    ? "bg-white text-black"
                    : "bg-transparent text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                {(() => {
                  const Icon = item.icon;
                  return <Icon size={18} />;
                })()}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
