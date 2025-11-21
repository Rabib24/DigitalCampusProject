"use client";

import { DarkModeInterface } from "@/components/mobile/DarkModeInterface";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MobileDarkModePage() {
  return (
    <ProtectedRoute requiredRole="student">
      <DarkModeInterface />
    </ProtectedRoute>
  );
}