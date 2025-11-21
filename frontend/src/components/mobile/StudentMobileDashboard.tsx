"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  PieChart, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Bell, 
  User, 
  CreditCard, 
  Users, 
  Menu,
  Search,
  Settings,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MobileView = 
  | "dashboard"
  | "courses"
  | "assignments"
  | "grades"
  | "calendar"
  | "messages"
  | "emergency"
  | "notifications";

export function MobileDashboard() {
  const [activeView, setActiveView] = useState<MobileView>("dashboard");
  const [isOffline, setIsOffline] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="p-4 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
              <p className="text-muted-foreground text-sm">Here's your academic overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">Current CGPA</div>
                <div className="text-2xl font-bold text-primary">3.45</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">Attendance</div>
                <div className="text-2xl font-bold text-primary">92%</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("courses")}>
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">Courses</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("assignments")}>
                  <ClipboardList className="h-5 w-5" />
                  <span className="text-xs">Assignments</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("grades")}>
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs">Grades</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("calendar")}>
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Calendar</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("messages")}>
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">Messages</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("emergency")}>
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Emergency</span>
                </Button>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Upcoming Assignments</h2>
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">Data Structures Project</div>
                  <div className="text-xs text-muted-foreground">Due in 2 days</div>
                  <Badge className="mt-2 bg-destructive/10 text-destructive text-xs">Urgent</Badge>
                </div>
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">Essay: Global Economics</div>
                  <div className="text-xs text-muted-foreground">Due in 5 days</div>
                  <Badge className="mt-2 bg-muted text-foreground text-xs">Pending</Badge>
                </div>
              </div>
            </div>
          </div>
        );
      case "courses":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Courses</h1>
            <div className="space-y-3">
              {[
                { code: "CS-203", name: "Data Structures", progress: 85 },
                { code: "MA-101", name: "Calculus II", progress: 78 },
                { code: "EN-102", name: "English Literature", progress: 90 },
                { code: "PH-203", name: "Physics II", progress: 72 },
                { code: "EC-101", name: "Principles of Economics", progress: 88 },
              ].map((course) => (
                <div key={course.code} className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.code}</div>
                    </div>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "assignments":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Assignments</h1>
            <div className="space-y-3">
              {[
                { id: 1, title: "Data Structures Project", course: "CS-203", dueDate: "2025-12-20", priority: "high", status: "pending" },
                { id: 2, title: "Essay: Global Economics", course: "EC-101", dueDate: "2025-12-23", priority: "medium", status: "pending" },
                { id: 3, title: "Calculus Problem Set 5", course: "MA-101", dueDate: "2025-12-25", priority: "low", status: "submitted" },
              ].map((assignment) => (
                <div key={assignment.id} className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-sm text-muted-foreground">{assignment.course}</div>
                      <div className="text-xs text-muted-foreground mt-1">Due: {assignment.dueDate}</div>
                    </div>
                    <Badge variant={assignment.status === "submitted" ? "secondary" : "destructive"}>
                      {assignment.status === "submitted" ? "Submitted" : "Pending"}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "grades":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Grades</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border text-center">
                <div className="text-sm text-muted-foreground">Current CGPA</div>
                <div className="text-2xl font-bold text-primary">3.45</div>
              </div>
              <div className="bg-card rounded-lg p-4 border text-center">
                <div className="text-sm text-muted-foreground">Semester GPA</div>
                <div className="text-2xl font-bold text-primary">3.65</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { course: "CS-203", grade: "A-", percentage: 92 },
                { course: "MA-101", grade: "B+", percentage: 88 },
                { course: "EN-102", grade: "A", percentage: 95 },
                { course: "PH-203", grade: "B", percentage: 82 },
                { course: "EC-101", grade: "A-", percentage: 91 },
              ].map((course, index) => (
                <div key={index} className="bg-card rounded-lg p-4 border flex justify-between items-center">
                  <div>
                    <div className="font-medium">{course.course}</div>
                    <div className="text-sm text-muted-foreground">{course.percentage}%</div>
                  </div>
                  <div className="font-bold text-lg">
                    {course.grade.startsWith("A") && <span className="text-green-600">{course.grade}</span>}
                    {course.grade.startsWith("B") && <span className="text-blue-600">{course.grade}</span>}
                    {course.grade.startsWith("C") && <span className="text-yellow-600">{course.grade}</span>}
                    {course.grade.startsWith("D") || course.grade.startsWith("F") && <span className="text-red-600">{course.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "calendar":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Calendar</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="font-medium">Today, November 20, 2025</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>CS-203 Lecture - 10:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Library Study Session - 2:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="font-medium">Tomorrow, November 21, 2025</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>MA-101 Tutorial - 9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Club Meeting - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="space-y-3">
              {[
                { name: "Dr. Sarah Johnson", message: "Your assignment has been graded...", time: "2h ago", unread: true },
                { name: "Computer Science Club", message: "Reminder: Meeting today at 5 PM", time: "4h ago", unread: false },
                { name: "Academic Advisor", message: "Let's schedule a meeting next week", time: "1d ago", unread: false },
              ].map((chat, index) => (
                <div key={index} className="bg-card rounded-lg p-4 border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{chat.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{chat.message}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{chat.time}</div>
                  {chat.unread && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                </div>
              ))}
            </div>
          </div>
        );
      case "emergency":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Emergency</h1>
            <div className="space-y-4">
              <Button className="w-full h-16 bg-red-600 hover:bg-red-700 text-white">
                <Phone className="h-6 w-6 mr-2" />
                PANIC BUTTON
              </Button>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-2">Emergency Contacts</h2>
                <div className="space-y-3">
                  {[
                    { name: "Campus Security", phone: "911" },
                    { name: "Student Health Center", phone: "+1 (555) 123-4567" },
                    { name: "Counseling Services", phone: "+1 (555) 123-4568" },
                  ].map((contact, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.phone}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-3">
              {[
                { title: "Assignment Due Reminder", message: "Data Structures Project is due in 2 days", time: "30m ago", type: "warning" },
                { title: "New Announcement", message: "Final exam schedule published", time: "2h ago", type: "info" },
                { title: "Grade Updated", message: "Your Calculus assignment has been graded", time: "1d ago", type: "success" },
              ].map((notification, index) => (
                <div key={index} className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-xs">
        <div>9:41</div>
        <div className="flex items-center gap-1">
          {isOffline ? (
            <WifiOff className="h-3 w-3" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {isCharging ? (
            <BatteryCharging className="h-3 w-3" />
          ) : (
            <Battery className="h-3 w-3" />
          )}
          <span>{batteryLevel}%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="font-bold">Digital Campus</div>
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center border-t bg-background p-2">
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "dashboard" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("dashboard")}
        >
          <Home className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "courses" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("courses")}
        >
          <BookOpen className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "assignments" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("assignments")}
        >
          <ClipboardList className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "grades" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("grades")}
        >
          <PieChart className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "notifications" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("notifications")}
        >
          <Bell className="h-6 w-6" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs">3</Badge>
        </Button>
      </div>
    </div>
  );
}