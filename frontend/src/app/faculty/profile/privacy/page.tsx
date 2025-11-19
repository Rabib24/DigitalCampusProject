"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Users, 
  User,
  Building,
  Globe
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

export default function PrivacySettingsPage() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "faculty-only" as "public" | "faculty-only" | "department" | "private",
    emailVisibility: "faculty-only" as "public" | "faculty-only" | "department" | "private",
    phoneVisibility: "department" as "public" | "faculty-only" | "department" | "private",
    officeLocationVisibility: "faculty-only" as "public" | "faculty-only" | "department" | "private",
    officeHoursVisibility: "department" as "public" | "faculty-only" | "department" | "private",
    researchVisibility: "public" as "public" | "faculty-only" | "department" | "private",
    coursesVisibility: "public" as "public" | "faculty-only" | "department" | "private",
    allowMessaging: true,
    allowContactRequests: true,
    showOnlineStatus: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Saving privacy settings:", privacySettings);
      setIsSaving(false);
      alert("Privacy settings saved successfully!");
    }, 1000);
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public": return <Globe size={16} className="text-green-500" />;
      case "faculty-only": return <Users size={16} className="text-blue-500" />;
      case "department": return <Building size={16} className="text-purple-500" />;
      case "private": return <Lock size={16} className="text-red-500" />;
      default: return <Eye size={16} />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public": return "Public";
      case "faculty-only": return "Faculty Only";
      case "department": return "Department Only";
      case "private": return "Private";
      default: return "Unknown";
    }
  };

  const handleVisibilityChange = (setting: string, value: string) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: value
    });
  };

  const handleToggleChange = (setting: string, value: boolean) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: value
    });
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Privacy Settings</h1>
          <p className="text-muted-foreground">Control who can see your information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              Profile Visibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getVisibilityIcon(privacySettings.profileVisibility)}
              <span className="font-medium">
                {getVisibilityLabel(privacySettings.profileVisibility)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Who can view your profile
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">Enhanced</div>
            <div className="text-sm text-muted-foreground">
              All data encrypted
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">2FA Enabled</div>
            <div className="text-sm text-muted-foreground">
              Two-factor authentication
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Information Visibility
          </CardTitle>
          <CardDescription>Control who can see specific information about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Name, title, department, bio
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.profileVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handleVisibilityChange("profileVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Address</h3>
                <p className="text-sm text-muted-foreground">
                  Your university email
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.emailVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.emailVisibility}
                  onChange={(e) => handleVisibilityChange("emailVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p className="text-sm text-muted-foreground">
                  Office and mobile numbers
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.phoneVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.phoneVisibility}
                  onChange={(e) => handleVisibilityChange("phoneVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Office Location</h3>
                <p className="text-sm text-muted-foreground">
                  Building and room number
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.officeLocationVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.officeLocationVisibility}
                  onChange={(e) => handleVisibilityChange("officeLocationVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-sm text-muted-foreground">
                  When you&apos;re available for meetings
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.officeHoursVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.officeHoursVisibility}
                  onChange={(e) => handleVisibilityChange("officeHoursVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Research Information</h3>
                <p className="text-sm text-muted-foreground">
                  Projects, publications, interests
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.researchVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.researchVisibility}
                  onChange={(e) => handleVisibilityChange("researchVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Courses Taught</h3>
                <p className="text-sm text-muted-foreground">
                  Current and past courses
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getVisibilityIcon(privacySettings.coursesVisibility)}
                <select
                  className="p-2 border rounded"
                  value={privacySettings.coursesVisibility}
                  onChange={(e) => handleVisibilityChange("coursesVisibility", e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="faculty-only">Faculty Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Communication Preferences
          </CardTitle>
          <CardDescription>Control how others can communicate with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Allow Messaging</h3>
              <p className="text-sm text-muted-foreground">
                Let students and colleagues send you messages
              </p>
            </div>
            <Button 
              variant={privacySettings.allowMessaging ? "default" : "outline"}
              onClick={() => handleToggleChange("allowMessaging", !privacySettings.allowMessaging)}
            >
              {privacySettings.allowMessaging ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Allow Contact Requests</h3>
              <p className="text-sm text-muted-foreground">
                Allow students to request meetings or advising
              </p>
            </div>
            <Button 
              variant={privacySettings.allowContactRequests ? "default" : "outline"}
              onClick={() => handleToggleChange("allowContactRequests", !privacySettings.allowContactRequests)}
            >
              {privacySettings.allowContactRequests ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Show Online Status</h3>
              <p className="text-sm text-muted-foreground">
                Display when you&apos;re online to students
              </p>
            </div>
            <Button 
              variant={privacySettings.showOnlineStatus ? "default" : "outline"}
              onClick={() => handleToggleChange("showOnlineStatus", !privacySettings.showOnlineStatus)}
            >
              {privacySettings.showOnlineStatus ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Data Export & Management
          </CardTitle>
          <CardDescription>Manage your personal data and privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Download Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Export all your personal information
              </p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                Read our privacy policy and terms
              </p>
            </div>
            <Button variant="outline">View Policy</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                Learn about how long we keep your data
              </p>
            </div>
            <Button variant="outline">Learn More</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
          <Lock size={16} />
          {isSaving ? "Saving..." : "Save Privacy Settings"}
        </Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
    </FacultyProtectedRoute>
  );
}