"use client";

import { MobileDashboard } from "@/components/mobile/StudentMobileDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentMobilePage() {
  return (
    <ProtectedRoute requiredRole="student">
      <MobileDashboard />
    </ProtectedRoute>
  );
}