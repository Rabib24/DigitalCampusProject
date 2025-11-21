"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  BellOff, 
  Settings, 
  X,
  AlertCircle,
  Info,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export function MobileNotificationPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Assignment Due Reminder", message: "Data Structures Project is due tomorrow", time: "2 hours ago", type: "warning", read: false },
    { id: 2, title: "New Announcement", message: "Final exam schedule published", time: "5 hours ago", type: "info", read: false },
    { id: 3, title: "Grade Updated", message: "Your Calculus assignment has been graded", time: "1 day ago", type: "success", read: true },
    { id: 4, title: "Advisor Meeting", message: "Reminder: Meeting with Dr. Johnson at 2 PM", time: "1 day ago", type: "info", read: true },
    { id: 5, title: "Campus Event", message: "Tech Talk: AI in Education - Today 4 PM", time: "2 days ago", type: "info", read: true },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge variant="destructive">Warning</Badge>;
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "message":
        return <Badge className="bg-blue-100 text-blue-800">Message</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="font-bold">Notifications</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Notification Settings</h2>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications on your device</div>
            </div>
            <Switch 
              checked={notificationSettings.push} 
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, push: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive email updates</div>
            </div>
            <Switch 
              checked={notificationSettings.email} 
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">SMS Notifications</div>
              <div className="text-sm text-muted-foreground">Receive text messages</div>
            </div>
            <Switch 
              checked={notificationSettings.sms} 
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms: checked})}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BellOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Notifications</h2>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for new notifications.
            </p>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Notifications</h2>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`bg-card rounded-lg p-4 border ${notification.read ? '' : 'border-primary'}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{notification.title}</div>
                        {!notification.read && (
                          <Badge className="bg-primary w-2 h-2 p-0 rounded-full"></Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-muted-foreground">
                          {notification.time}
                        </div>
                        {getTypeBadge(notification.type)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => markAsRead(notification.id)}
                      disabled={notification.read}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}