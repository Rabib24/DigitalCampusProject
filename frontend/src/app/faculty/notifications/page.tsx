"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Bell, Clock, Filter, Search, X } from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "announcement" | "assignment" | "grading" | "advising" | "research" | "system";
  courseId?: string;
  priority: "low" | "medium" | "high";
}

export default function FacultyNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Assignment Submission",
      message: "A student has submitted an assignment for CS-301: Data Science and Machine Learning",
      timestamp: "2023-06-15T09:30:00Z",
      read: false,
      type: "assignment",
      courseId: "CS-301",
      priority: "high"
    },
    {
      id: "2",
      title: "Department Meeting Reminder",
      message: "Faculty meeting scheduled for tomorrow at 2:00 PM in Conference Room A",
      timestamp: "2023-06-14T14:15:00Z",
      read: true,
      type: "announcement",
      priority: "medium"
    },
    {
      id: "3",
      title: "Grading Deadline Approaching",
      message: "Please complete grading for CS-205 assignments by end of week",
      timestamp: "2023-06-14T10:45:00Z",
      read: false,
      type: "grading",
      courseId: "CS-205",
      priority: "high"
    },
    {
      id: "4",
      title: "Research Grant Update",
      message: "Your research grant application has been approved",
      timestamp: "2023-06-13T16:20:00Z",
      read: true,
      type: "research",
      priority: "medium"
    },
    {
      id: "5",
      title: "System Maintenance",
      message: "Scheduled maintenance this weekend from 12:00 AM to 4:00 AM",
      timestamp: "2023-06-12T08:00:00Z",
      read: true,
      type: "system",
      priority: "low"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const toggleReadStatus = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: !notification.read } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeVariant = (type: Notification["type"]) => {
    switch (type) {
      case "announcement": return "default";
      case "assignment": return "secondary";
      case "grading": return "destructive";
      case "advising": return "outline";
      case "research": return "secondary";
      case "system": return "outline";
      default: return "default";
    }
  };

  const getPriorityVariant = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
              : "All notifications are read"}
          </p>
        </div>
        <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark All as Read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={notification.read}
                        onCheckedChange={() => toggleReadStatus(notification.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          {notification.courseId && (
                            <span className="font-medium">{notification.courseId}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={getTypeVariant(notification.type)}>
                          {notification.type}
                        </Badge>
                        <Badge variant={getPriorityVariant(notification.priority)}>
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No notifications found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterType !== "all" || filterPriority !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You're all caught up!"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}