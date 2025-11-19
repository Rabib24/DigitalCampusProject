"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Users, 
  BookOpen, 
  CheckCircle,
  XCircle,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "assignment" | "announcement" | "discussion" | "grade" | "meeting";
  isRead: boolean;
  priority: "low" | "medium" | "high";
  courseId?: string;
  courseName?: string;
}

export default function MobileNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Assignment Submission",
      description: "New submission for 'Web APIs Project' from Alice Johnson",
      time: "2 min ago",
      type: "assignment",
      isRead: false,
      priority: "high",
      courseId: "CS-205",
      courseName: "Web Development"
    },
    {
      id: "2",
      title: "Department Announcement",
      description: "Faculty meeting scheduled for Friday at 3:00 PM",
      time: "1 hour ago",
      type: "announcement",
      isRead: false,
      priority: "medium"
    },
    {
      id: "3",
      title: "Discussion Reply",
      description: "Bob Smith replied to your post in 'Data Structures'",
      time: "3 hours ago",
      type: "discussion",
      isRead: true,
      priority: "low",
      courseId: "CS-201",
      courseName: "Data Structures"
    },
    {
      id: "4",
      title: "Grade Published",
      description: "Midterm grades for 'Intro to CS' have been published",
      time: "1 day ago",
      type: "grade",
      isRead: true,
      priority: "medium",
      courseId: "CS-101",
      courseName: "Introduction to Computer Science"
    },
    {
      id: "5",
      title: "Meeting Reminder",
      description: "Advising meeting with Carol Davis in 30 minutes",
      time: "1 day ago",
      type: "meeting",
      isRead: false,
      priority: "high"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: false } : notification
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment": return <FileText className="h-5 w-5" />;
      case "announcement": return <Bell className="h-5 w-5" />;
      case "discussion": return <MessageSquare className="h-5 w-5" />;
      case "grade": return <CheckCircle className="h-5 w-5" />;
      case "meeting": return <Users className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case "assignment": return "default";
      case "announcement": return "secondary";
      case "discussion": return "outline";
      case "grade": return "default";
      case "meeting": return "secondary";
      default: return "default";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.courseName && notification.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          {unreadCount} unread notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded flex-1"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="assignment">Assignments</option>
                <option value="announcement">Announcements</option>
                <option value="discussion">Discussions</option>
                <option value="grade">Grades</option>
                <option value="meeting">Meetings</option>
              </select>
              <select
                className="p-2 border rounded flex-1"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:shadow-md transition-shadow ${!notification.isRead ? 'border-primary' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <Badge variant={getPriorityVariant(notification.priority)} className="h-5">
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    {notification.courseName && (
                      <div className="flex items-center gap-1 mt-1">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{notification.courseName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <div className="flex gap-1">
                        {!notification.isRead ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleMarkAsUnread(notification.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No notifications found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterType !== "all" || filterPriority !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}