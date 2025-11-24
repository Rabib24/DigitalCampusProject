"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, User, Bell, Shield, Palette, Globe, Loader2 } from "lucide-react";
import { getFacultyProfile, updateFacultyProfile, getFacultySettings, updateFacultySettings } from "@/lib/faculty/api";
import { toast } from "sonner";

export function FacultySettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    title: "",
    office_location: "",
    office_hours: "",
    bio: "",
  });
  const [settingsData, setSettingsData] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    theme: "light",
    language: "en",
    profile_visibility: "internal",
    show_email: true,
    show_office_hours: true,
    preferred_contact_method: "email",
    calendar_view: "week",
    working_hours_start: "09:00:00",
    working_hours_end: "17:00:00",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile data
        const profileResponse = await getFacultyProfile();
        if (profileResponse.success) {
          setProfileData({
            first_name: profileResponse.profile.first_name || "",
            last_name: profileResponse.profile.last_name || "",
            email: profileResponse.profile.email || "",
            phone_number: profileResponse.profile.phone_number || "",
            department: profileResponse.profile.department || "",
            title: profileResponse.profile.title || "",
            office_location: profileResponse.profile.office_location || "",
            office_hours: profileResponse.profile.office_hours || "",
            bio: profileResponse.profile.bio || "",
          });
        }

        // Fetch settings data
        const settingsResponse = await getFacultySettings();
        if (settingsResponse.success) {
          setSettingsData(settingsResponse.settings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      const response = await updateFacultyProfile(profileData);
      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSave = async () => {
    try {
      setSaving(true);
      const response = await updateFacultySettings(settingsData);
      if (response.success) {
        toast.success("Settings updated successfully");
        setSettingsData(response.settings);
      } else {
        toast.error(response.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Settings Menu</CardTitle>
              <CardDescription>Navigate through different settings sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { id: "profile", label: "Profile", icon: <User size={16} /> },
                { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
                { id: "privacy", label: "Privacy", icon: <Shield size={16} /> },
                { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
                { id: "language", label: "Language", icon: <Globe size={16} /> },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-xl">
                        {profileData.first_name?.charAt(0)}{profileData.last_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <Button variant="outline">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground mt-1">
                        JPG, GIF or PNG. Max size of 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="First name" 
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Last name" 
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email address" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Phone number" 
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Your title (e.g., Professor, Associate Professor)" 
                    value={profileData.title}
                    onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={profileData.department}
                    onValueChange={(value) => setProfileData({...profileData, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="arts">Arts & Humanities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location</Label>
                  <Input 
                    id="officeLocation" 
                    placeholder="Office location" 
                    value={profileData.office_location}
                    onChange={(e) => setProfileData({...profileData, office_location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input 
                    id="officeHours" 
                    placeholder="Office hours" 
                    value={profileData.office_hours}
                    onChange={(e) => setProfileData({...profileData, office_hours: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself" 
                    rows={4} 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  />
                </div>

                <Button 
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={handleProfileSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    checked={settingsData.email_notifications}
                    onCheckedChange={(checked) => setSettingsData({...settingsData, email_notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch 
                    checked={settingsData.push_notifications}
                    onCheckedChange={(checked) => setSettingsData({...settingsData, push_notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS notifications for urgent matters
                    </p>
                  </div>
                  <Switch 
                    checked={settingsData.sms_notifications}
                    onCheckedChange={(checked) => setSettingsData({...settingsData, sms_notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Assignment Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when students submit assignments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gradebook Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when grades are updated
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advising Appointments</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for advising appointment requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSettingsSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell size={16} />}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={settingsData.profile_visibility}
                    onValueChange={(value) => setSettingsData({...settingsData, profile_visibility: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Control who can view your profile
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email address on your profile
                    </p>
                  </div>
                  <Switch 
                    checked={settingsData.show_email}
                    onCheckedChange={(checked) => setSettingsData({...settingsData, show_email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Office Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your office hours on your profile
                    </p>
                  </div>
                  <Switch 
                    checked={settingsData.show_office_hours}
                    onCheckedChange={(checked) => setSettingsData({...settingsData, show_office_hours: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Contact Method</Label>
                  <Select 
                    value={settingsData.preferred_contact_method}
                    onValueChange={(value) => setSettingsData({...settingsData, preferred_contact_method: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="office">Office Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How would you prefer to be contacted?
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSettingsSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield size={16} />}
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select 
                    value={settingsData.theme}
                    onValueChange={(value) => setSettingsData({...settingsData, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={settingsData.language}
                    onValueChange={(value) => setSettingsData({...settingsData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSettingsSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Palette size={16} />}
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={settingsData.language}
                    onValueChange={(value) => setSettingsData({...settingsData, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-5">Eastern Time (ET)</SelectItem>
                      <SelectItem value="utc-6">Central Time (CT)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (MT)</SelectItem>
                      <SelectItem value="utc-8">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Your current time zone
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How dates should be displayed
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleSettingsSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe size={16} />}
                  Save Language Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}