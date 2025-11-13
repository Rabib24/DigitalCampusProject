"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

export function FacultySettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                defaultValue="Dr. Ahmed Khan"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                defaultValue="ahmed.khan@iub.edu"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                defaultValue="Computer Science"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Office Location</label>
              <input
                type="text"
                className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                defaultValue="Building A, Room 301"
              />
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Assignment Submissions", description: "Get notified when students submit assignments" },
            { label: "Grade Appeals", description: "Receive alerts for grade appeal requests" },
            { label: "Meeting Reminders", description: "Remind me of upcoming advising meetings" },
            { label: "Course Announcements", description: "Daily digest of course-related announcements" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy & Consent */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your data and recording visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              These settings control who can access your recordings and research data.
            </AlertDescription>
          </Alert>
          {[
            { label: "Make recordings visible to students", defaultChecked: true },
            { label: "Allow research data sharing with department", defaultChecked: false },
            { label: "Enable student access to grading rubrics", defaultChecked: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <p className="font-medium">{item.label}</p>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
