"use client";

import { MobileNotificationPage } from "@/components/mobile/MobileNotificationPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MobileNotificationsPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <MobileNotificationPage />
    </ProtectedRoute>
  );
}