"use client"

import { Bell, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdvisorSettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your advisor profile and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Office Location</Label>
            <input type="text" defaultValue="Office A-102" className="w-full px-3 py-2 border rounded-md mt-1" />
          </div>
          <div>
            <Label>Phone Extension</Label>
            <input type="text" defaultValue="+92-300-1234567" className="w-full px-3 py-2 border rounded-md mt-1" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Low GPA Alerts", desc: "Notify when advisee CGPA drops below threshold" },
            { label: "Meeting Reminders", desc: "Remind about upcoming appointments" },
            { label: "Milestone Notifications", desc: "Alert about deadline reminders" },
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
