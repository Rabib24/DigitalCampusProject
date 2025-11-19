"use client";

import type React from "react";

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
  return (
    <aside className="hidden md:block md:w-64 flex-shrink-0">
      <div className="h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
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
  );
}
