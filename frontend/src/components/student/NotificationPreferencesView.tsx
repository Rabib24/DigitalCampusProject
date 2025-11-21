"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Calendar,
  FileText,
  Award,
  Users,
  BookOpen,
  AlertCircle,
  Save
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type NotificationPreference = {
  id: string;
  category: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
};

export function NotificationPreferencesView() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: "1",
      category: "Academic",
      title: "Course Updates",
      description: "Announcements, syllabus changes, and course materials",
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    {
      id: "2",
      category: "Academic",
      title: "Assignment Deadlines",
      description: "Upcoming assignment due dates and reminders",
      email: true,
      sms: true,
      push: true,
      inApp: true
    },
    {
      id: "3",
      category: "Academic",
      title: "Grade Updates",
      description: "New grades posted and grade changes",
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    {
      id: "4",
      category: "Campus Life",
      title: "Event Announcements",
      description: "Campus events, activities, and social gatherings",
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    {
      id: "5",
      category: "Campus Life",
      title: "Club Activities",
      description: "Updates from clubs and organizations you're part of",
      email: true,
      sms: false,
      push: false,
      inApp: true
    },
    {
      id: "6",
      category: "Financial",
      title: "Payment Reminders",
      description: "Tuition due dates and payment confirmations",
      email: true,
      sms: true,
      push: true,
      inApp: true
    },
    {
      id: "7",
      category: "Library",
      title: "Book Due Reminders",
      description: "Library book due dates and overdue notices",
      email: true,
      sms: true,
      push: true,
      inApp: true
    },
    {
      id: "8",
      category: "System",
      title: "Maintenance Notifications",
      description: "System updates, maintenance schedules, and downtime",
      email: true,
      sms: false,
      push: true,
      inApp: true
    }
  ]);

  const [globalPreferences, setGlobalPreferences] = useState({
    email: true,
    sms: true,
    push: true,
    inApp: true
  });

  const togglePreference = (id: string, type: keyof NotificationPreference) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, [type]: !pref[type] } : pref
    ));
  };

  const toggleAllForCategory = (category: string, type: keyof NotificationPreference) => {
    const newValue = !preferences
      .filter(pref => pref.category === category)
      .every(pref => pref[type]);
      
    setPreferences(preferences.map(pref => 
      pref.category === category ? { ...pref, [type]: newValue } : pref
    ));
  };

  const toggleGlobal = (type: keyof typeof globalPreferences) => {
    const newValue = !globalPreferences[type];
    setGlobalPreferences({ ...globalPreferences, [type]: newValue });
    
    // Update all preferences
    setPreferences(preferences.map(pref => ({
      ...pref,
      [type]: newValue
    })));
  };

  const savePreferences = () => {
    // In a real app, this would save to the backend
    console.log("Saving preferences:", preferences);
    alert("Notification preferences saved successfully!");
  };

  // Group preferences by category
  const categories = Array.from(new Set(preferences.map(p => p.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Customize how and when you receive notifications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Notification Settings</CardTitle>
          <CardDescription>
            Enable or disable notification channels for all categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={globalPreferences.email}
              onCheckedChange={() => toggleGlobal("email")}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              checked={globalPreferences.sms}
              onCheckedChange={() => toggleGlobal("sms")}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={globalPreferences.push}
              onCheckedChange={() => toggleGlobal("push")}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">In-App Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
              </div>
            </div>
            <Switch
              checked={globalPreferences.inApp}
              onCheckedChange={() => toggleGlobal("inApp")}
            />
          </div>
        </CardContent>
      </Card>

      {categories.map(category => {
        const categoryPreferences = preferences.filter(p => p.category === category);
        const allEmailEnabled = categoryPreferences.every(p => p.email);
        const allSmsEnabled = categoryPreferences.every(p => p.sms);
        const allPushEnabled = categoryPreferences.every(p => p.push);
        const allInAppEnabled = categoryPreferences.every(p => p.inApp);

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category} Notifications</CardTitle>
              <CardDescription>
                Customize notifications for {category.toLowerCase()} related activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Enable all for {category}:</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={allEmailEnabled}
                      onCheckedChange={() => toggleAllForCategory(category, "email")}
                    />
                    <Label className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={allSmsEnabled}
                      onCheckedChange={() => toggleAllForCategory(category, "sms")}
                    />
                    <Label className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>SMS</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={allPushEnabled}
                      onCheckedChange={() => toggleAllForCategory(category, "push")}
                    />
                    <Label className="flex items-center space-x-1">
                      <Bell className="h-4 w-4" />
                      <span>Push</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={allInAppEnabled}
                      onCheckedChange={() => toggleAllForCategory(category, "inApp")}
                    />
                    <Label className="flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>In-App</span>
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {categoryPreferences.map(pref => (
                  <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{pref.title}</h3>
                      <p className="text-sm text-muted-foreground">{pref.description}</p>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={pref.email}
                          onCheckedChange={() => togglePreference(pref.id, "email")}
                        />
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={pref.sms}
                          onCheckedChange={() => togglePreference(pref.id, "sms")}
                        />
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={pref.push}
                          onCheckedChange={() => togglePreference(pref.id, "push")}
                        />
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={pref.inApp}
                          onCheckedChange={() => togglePreference(pref.id, "inApp")}
                        />
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex justify-end">
        <Button onClick={savePreferences}>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}