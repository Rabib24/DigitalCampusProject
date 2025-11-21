"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminSettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin dashboard preferences and system settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Configure global system settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Digital Campus" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" defaultValue="admin@digitalcampus.edu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the system for maintenance.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security policies and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="standard">Standard (8+ chars, 1 number)</SelectItem>
                  <SelectItem value="strong">Strong (8+ chars, mixed case, symbols)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all admin accounts.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>IP Whitelisting</Label>
                <p className="text-sm text-muted-foreground">
                  Restrict admin access to specific IP addresses.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>
              Configure email and system notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification-email">Notification Email</Label>
              <Input id="notification-email" type="email" defaultValue="notifications@digitalcampus.edu" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notification-message">Custom Notification Message</Label>
              <Textarea 
                id="notification-message" 
                placeholder="Enter custom message for system notifications..."
                defaultValue="This is an automated system notification from Digital Campus."
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for critical system events.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Slack Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications to Slack channel.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}