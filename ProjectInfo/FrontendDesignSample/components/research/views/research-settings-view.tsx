"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function ResearchSettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Research admin preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "New Submissions", desc: "Notify of new project proposals" },
            { label: "Ethics Reviews Due", desc: "Reminder for ethics review deadlines" },
            { label: "Grant Updates", desc: "Notify of grant approvals" },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{notif.label}</p>
                <p className="text-sm text-muted-foreground">{notif.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
