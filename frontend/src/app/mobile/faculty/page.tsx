"use client";

import { FacultyMobileDashboard } from "@/components/mobile/FacultyMobileDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FacultyMobilePage() {
  return (
    <ProtectedRoute requiredRole="faculty">
      <FacultyMobileDashboard />
    </ProtectedRoute>
  );
}