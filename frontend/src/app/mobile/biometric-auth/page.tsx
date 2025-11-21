"use client";

import { BiometricAuthInterface } from "@/components/mobile/BiometricAuthInterface";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MobileBiometricAuthPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <BiometricAuthInterface />
    </ProtectedRoute>
  );
}