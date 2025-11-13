"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ITSettingsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">IT Settings</h2>
        <p className="text-muted-foreground mt-1">Configure IT administration preferences</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Security alerts</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>System performance alerts</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Backup failure notifications</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enforce MFA for all users</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable session timeout</Label>
              <Switch defaultChecked />
            </div>
            <div>
              <Label className="text-sm">Session Timeout Duration</Label>
              <div className="mt-2 p-3 rounded-lg border border-border bg-muted">30 minutes</div>
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
