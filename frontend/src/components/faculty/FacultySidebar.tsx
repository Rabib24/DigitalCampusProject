"use client";

import type React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface FacultySidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface FacultySidebarProps {
  items: FacultySidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function FacultySidebar({ items, activeId, onSelect }: FacultySidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsMobileMenuOpen(false); // Close mobile menu when an item is selected
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-16 left-4 z-50 p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <aside className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-14 h-full w-64 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-4">
              <button
                className="p-2 rounded-md text-zinc-300 hover:bg-zinc-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
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
                  className={`w-full inline-flex items-center justify-start gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-64 flex-shrink-0">
        <div className="h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <nav className="space-y-2 top-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full inline-flex items-center justify-start gap-3 rounded-md mt-5 px-3 py-2 text-sm font-medium transition-colors ${
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