"use client";

import { MobileEmergencyInterface } from "@/components/mobile/MobileEmergencyInterface";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MobileEmergencyPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <MobileEmergencyInterface />
    </ProtectedRoute>
  );
}