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
import { Save, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

export default function FacultyProfilePage() {
  const { state } = useFaculty();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    bio: "",
    profileVisibility: true,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    assignmentSubmissions: true,
    gradebookUpdates: false,
    advisingAppointments: true,
  });

  // In a real implementation, we would fetch profile data from an API
  useEffect(() => {
    if (state.profile) {
      setProfile({
        firstName: state.profile.first_name,
        lastName: state.profile.last_name,
        email: state.profile.email,
        department: state.profile.department,
        bio: "Experienced faculty member with expertise in computer science and data analytics.",
        profileVisibility: true,
      });
    }
  }, [state.profile]);

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real implementation, we would save to an API
    console.log("Saving profile:", profile);
  };

  const handleSaveNotifications = () => {
    // In a real implementation, we would save to an API
    console.log("Saving notifications:", notifications);
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
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
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium text-xl">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
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
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Last name" 
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address" 
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself" 
                  rows={4} 
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={profile.department}
                  onValueChange={(value) => handleProfileChange("department", value)}
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

              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to students
                  </p>
                </div>
                <Switch 
                  checked={profile.profileVisibility}
                  onCheckedChange={(checked) => handleProfileChange("profileVisibility", checked)}
                />
              </div>

              <Button className="gap-2" onClick={handleSaveProfile}>
                <Save size={16} />
                Save Changes
              </Button>
            </CardContent>
          </Card>

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
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Assignment Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when students submit assignments
                  </p>
                </div>
                <Switch 
                  checked={notifications.assignmentSubmissions}
                  onCheckedChange={(checked) => handleNotificationChange("assignmentSubmissions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Gradebook Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when grades are updated
                  </p>
                </div>
                <Switch 
                  checked={notifications.gradebookUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("gradebookUpdates", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Advising Appointments</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify for advising appointment requests
                  </p>
                </div>
                <Switch 
                  checked={notifications.advisingAppointments}
                  onCheckedChange={(checked) => handleNotificationChange("advisingAppointments", checked)}
                />
              </div>

              <Button variant="outline" className="gap-2" onClick={handleSaveNotifications}>
                <Bell size={16} />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </FacultyProtectedRoute>
  );
}