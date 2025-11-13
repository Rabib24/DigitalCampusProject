"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdminSettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage department settings and preferences</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email notifications for staff requests</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Weekly budget reports</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Course approval alerts</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Department Name</Label>
              <div className="mt-2 p-3 rounded-lg border border-border bg-muted text-foreground">Computer Science</div>
            </div>
            <div>
              <Label className="text-sm">Head of Department</Label>
              <div className="mt-2 p-3 rounded-lg border border-border bg-muted text-foreground">Dr. Ahmed Khan</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
          <Button variant="outline" className="bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
