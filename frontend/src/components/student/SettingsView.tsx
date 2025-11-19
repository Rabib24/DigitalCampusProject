"use client";

export function SettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your student dashboard preferences and notification settings.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Settings placeholder. Future work: notification preferences, theme options, and privacy controls.
        </p>
      </div>
    </div>
  );
}
