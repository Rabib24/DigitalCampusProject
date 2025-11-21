"use client";

import { AdminMobileDashboard } from "@/components/mobile/AdminMobileDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminMobilePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminMobileDashboard />
    </ProtectedRoute>
  );
}