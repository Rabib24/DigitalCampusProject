"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Search,
  Filter,
  Check,
  CheckCircle,
  X,
  Calendar,
  User,
  AlertCircle,
  Info,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success" | "announcement";
  isRead: boolean;
  createdAt: Date;
  relatedUrl?: string;
}

export function NotificationCenterView() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_001",
      title: "Assignment Due Reminder",
      message: "Your Mathematics assignment is due tomorrow at 11:59 PM",
      type: "warning",
      isRead: false,
      createdAt: new Date("2025-11-19"),
      relatedUrl: "/student/assignments/math-101"
    },
    {
      id: "notif_002",
      title: "Grade Posted",
      message: "Your Physics midterm grade has been posted",
      type: "success",
      isRead: true,
      createdAt: new Date("2025-11-18"),
      relatedUrl: "/student/grades/physics-201"
    },
    {
      id: "notif_003",
      title: "Campus Event",
      message: "Career Fair 2025 is happening this Friday in the Main Auditorium",
      type: "info",
      isRead: false,
      createdAt: new Date("2025-11-17"),
      relatedUrl: "/student/events"
    },
    {
      id: "notif_004",
      title: "Payment Due",
      message: "Your tuition payment is due by December 1st",
      type: "error",
      isRead: true,
      createdAt: new Date("2025-11-15"),
      relatedUrl: "/student/finance"
    },
    {
      id: "notif_005",
      title: "New Message",
      message: "Dr. Smith has sent you a message about your research project",
      type: "info",
      isRead: false,
      createdAt: new Date("2025-11-14"),
      relatedUrl: "/student/messages"
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "announcement":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case "announcement":
        return <Badge className="bg-purple-100 text-purple-800">Announcement</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, isRead: true} : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({...notification, isRead: true})
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notification Center</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notifications` 
              : "All notifications are read"}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              !notification.isRead ? "border-primary" : ""
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {notification.title}
                      {!notification.isRead && (
                        <Badge className="bg-primary text-primary-foreground">New</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {notification.message}
                    </CardDescription>
                  </div>
                </div>
                {getTypeBadge(notification.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{notification.createdAt.toLocaleDateString()}</span>
                  <span>at</span>
                  <span>{notification.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex gap-2">
                  {notification.relatedUrl && (
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  )}
                  {!notification.isRead && (
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground mb-4 text-center">
              You don't have any notifications at the moment. We'll let you know when something important happens.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}