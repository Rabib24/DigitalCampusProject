"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Wifi, 
  Calendar,
  FileText,
  Users,
  BookOpen,
  BarChart,
  MessageCircle,
  AlertCircle
} from "lucide-react";

export default function NotificationPreferencesPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assignmentSubmissions: true,
    gradeUpdates: true,
    courseAnnouncements: true,
    advisingRequests: true,
    researchUpdates: true,
    meetingReminders: true,
    systemAlerts: true,
    dailyDigest: false,
    weeklySummary: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving notification settings:", notificationSettings);
      setIsSaving(false);
      alert("Notification preferences saved successfully!");
    }, 1000);
  };

  const handleToggleChange = (setting: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: value
    });
  };

  const getEmailNotificationCount = () => {
    return [
      notificationSettings.assignmentSubmissions,
      notificationSettings.gradeUpdates,
      notificationSettings.courseAnnouncements,
      notificationSettings.advisingRequests,
      notificationSettings.researchUpdates,
      notificationSettings.meetingReminders,
      notificationSettings.systemAlerts
    ].filter(Boolean).length;
  };

  const getPushNotificationCount = () => {
    return [
      notificationSettings.assignmentSubmissions,
      notificationSettings.gradeUpdates,
      notificationSettings.courseAnnouncements,
      notificationSettings.advisingRequests,
      notificationSettings.meetingReminders,
      notificationSettings.systemAlerts
    ].filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notification Preferences</h1>
          <p className="text-muted-foreground">Customize how you receive notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getEmailNotificationCount()}
            </div>
            <div className="text-muted-foreground">Types enabled</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={20} />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {getPushNotificationCount()}
            </div>
            <div className="text-muted-foreground">Types enabled</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {notificationSettings.smsNotifications ? "1" : "0"}
            </div>
            <div className="text-muted-foreground">Types enabled</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi size={20} />
            Notification Channels
          </CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.emailNotifications ? "default" : "outline"}
              onClick={() => handleToggleChange("emailNotifications", !notificationSettings.emailNotifications)}
            >
              {notificationSettings.emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.pushNotifications ? "default" : "outline"}
              onClick={() => handleToggleChange("pushNotifications", !notificationSettings.pushNotifications)}
            >
              {notificationSettings.pushNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for important alerts
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.smsNotifications ? "default" : "outline"}
              onClick={() => handleToggleChange("smsNotifications", !notificationSettings.smsNotifications)}
            >
              {notificationSettings.smsNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Assignment & Grading
          </CardTitle>
          <CardDescription>Notifications related to assignments and grades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Assignment Submissions</h3>
                <p className="text-sm text-muted-foreground">
                  When students submit assignments
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.assignmentSubmissions ? "default" : "outline"}
              onClick={() => handleToggleChange("assignmentSubmissions", !notificationSettings.assignmentSubmissions)}
            >
              {notificationSettings.assignmentSubmissions ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Grade Updates</h3>
                <p className="text-sm text-muted-foreground">
                  When grades are updated or published
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.gradeUpdates ? "default" : "outline"}
              onClick={() => handleToggleChange("gradeUpdates", !notificationSettings.gradeUpdates)}
            >
              {notificationSettings.gradeUpdates ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Course & Advising
          </CardTitle>
          <CardDescription>Notifications related to courses and student advising</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Course Announcements</h3>
                <p className="text-sm text-muted-foreground">
                  New announcements in your courses
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.courseAnnouncements ? "default" : "outline"}
              onClick={() => handleToggleChange("courseAnnouncements", !notificationSettings.courseAnnouncements)}
            >
              {notificationSettings.courseAnnouncements ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Advising Requests</h3>
                <p className="text-sm text-muted-foreground">
                  When students request advising meetings
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.advisingRequests ? "default" : "outline"}
              onClick={() => handleToggleChange("advisingRequests", !notificationSettings.advisingRequests)}
            >
              {notificationSettings.advisingRequests ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart size={20} />
            Research & Meetings
          </CardTitle>
          <CardDescription>Notifications related to research and meetings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Research Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Updates on research projects and publications
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.researchUpdates ? "default" : "outline"}
              onClick={() => handleToggleChange("researchUpdates", !notificationSettings.researchUpdates)}
            >
              {notificationSettings.researchUpdates ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Meeting Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Reminders for scheduled meetings
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.meetingReminders ? "default" : "outline"}
              onClick={() => handleToggleChange("meetingReminders", !notificationSettings.meetingReminders)}
            >
              {notificationSettings.meetingReminders ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={20} />
            System & Administrative
          </CardTitle>
          <CardDescription>System and administrative notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">System Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Important system updates and maintenance
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.systemAlerts ? "default" : "outline"}
              onClick={() => handleToggleChange("systemAlerts", !notificationSettings.systemAlerts)}
            >
              {notificationSettings.systemAlerts ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Daily Digest</h3>
                <p className="text-sm text-muted-foreground">
                  Daily summary of notifications
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.dailyDigest ? "default" : "outline"}
              onClick={() => handleToggleChange("dailyDigest", !notificationSettings.dailyDigest)}
            >
              {notificationSettings.dailyDigest ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart className="text-muted-foreground" size={20} />
              <div>
                <h3 className="font-medium">Weekly Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of activities and updates
                </p>
              </div>
            </div>
            <Button 
              variant={notificationSettings.weeklySummary ? "default" : "outline"}
              onClick={() => handleToggleChange("weeklySummary", !notificationSettings.weeklySummary)}
            >
              {notificationSettings.weeklySummary ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
          <Bell size={16} />
          {isSaving ? "Saving..." : "Save Notification Preferences"}
        </Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
}