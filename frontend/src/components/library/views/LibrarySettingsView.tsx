"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LibrarySettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library Settings</h1>
        <p className="text-muted-foreground">
          Configure library system preferences and policies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Policies</CardTitle>
            <CardDescription>
              Configure loan periods and limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-period">Standard Loan Period (days)</Label>
              <Input id="loan-period" type="number" defaultValue="28" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renewal-limit">Renewal Limit</Label>
              <Input id="renewal-limit" type="number" defaultValue="2" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fine-rate">Fine Rate ($ per day)</Label>
              <Input id="fine-rate" type="number" defaultValue="0.50" step="0.01" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Overdue Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send automated notifications for overdue items.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Configure system-wide settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="library-name">Library Name</Label>
              <Input id="library-name" defaultValue="University Library" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" defaultValue="library@university.edu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the library system for maintenance.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure email and system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification-email">Notification Email</Label>
              <Input id="notification-email" type="email" defaultValue="notifications@library.university.edu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notification-message">Custom Notification Message</Label>
              <Textarea 
                id="notification-message" 
                placeholder="Enter custom message for library notifications..."
                defaultValue="This is an automated notification from the University Library."
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for loan reminders and overdue items.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS notifications for urgent library notices.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}