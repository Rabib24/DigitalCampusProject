"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Cog, Lock, Bell, Eye } from "lucide-react"

export function SettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog size={20} />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              defaultValue="Ahmed Hassan"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Your email"
              defaultValue="ahmed.hassan@iub.edu.pk"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Student ID</label>
            <input
              type="text"
              placeholder="Student ID"
              defaultValue="IUB-2022-12345"
              disabled
              className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email Notifications", description: "Receive updates via email" },
            { label: "Assignment Reminders", description: "Get notified before due dates" },
            { label: "Grade Updates", description: "Receive grade notifications" },
            { label: "Course Announcements", description: "Get course-related announcements" },
          ].map((notif, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{notif.label}</p>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add extra security to your account</p>
            </div>
            <Badge variant="outline">Disabled</Badge>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Enable 2FA
          </Button>

          <div className="border-t border-border pt-4 mt-4">
            <p className="font-medium text-sm mb-3">Active Sessions</p>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm">Current Device</p>
                <p className="text-xs text-muted-foreground">Chrome on Windows</p>
              </div>
              <Badge className="bg-green-500/20 text-green-700 dark:text-green-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Accessibility Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "High Contrast Mode", description: "Improve visibility with higher contrast" },
            { label: "Larger Text", description: "Increase font size for better readability" },
            { label: "Dyslexia-Friendly Font", description: "Use a font optimized for dyslexia" },
          ].map((option, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <Switch />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
