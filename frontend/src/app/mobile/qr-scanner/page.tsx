"use client";

import { QRScanner } from "@/components/mobile/QRScanner";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MobileQRScannerPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <QRScanner />
    </ProtectedRoute>
  );
}