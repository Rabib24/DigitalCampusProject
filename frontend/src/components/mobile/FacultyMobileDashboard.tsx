"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart3, 
  FileText, 
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
  | "students"
  | "calendar"
  | "messages"
  | "analytics"
  | "reports";

export function FacultyMobileDashboard() {
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
              <h1 className="text-2xl font-bold">Welcome back, Dr. Johnson!</h1>
              <p className="text-muted-foreground text-sm">Here's your teaching overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">Courses</div>
                <div className="text-2xl font-bold text-primary">3</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">Students</div>
                <div className="text-2xl font-bold text-primary">85</div>
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
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("students")}>
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Students</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("calendar")}>
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Calendar</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("messages")}>
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">Messages</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("analytics")}>
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">New assignment submission</div>
                  <div className="text-xs text-muted-foreground">CS-203 - Data Structures Project</div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">Review Pending</Badge>
                </div>
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">Student query</div>
                  <div className="text-xs text-muted-foreground">From Alex Johnson - CS-203</div>
                  <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Responded</Badge>
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
                { code: "CS-203", name: "Data Structures", students: 35, progress: 75 },
                { code: "CS-301", name: "Operating Systems", students: 28, progress: 45 },
                { code: "CS-401", name: "Senior Project", students: 12, progress: 20 },
              ].map((course) => (
                <div key={course.code} className="bg-card rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.code} • {course.students} students</div>
                    </div>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Course
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Gradebook
                    </Button>
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
                { id: 1, title: "Data Structures Project", course: "CS-203", dueDate: "2025-12-20", submissions: 28, pending: 7 },
                { id: 2, title: "OS Midterm Exam", course: "CS-301", dueDate: "2025-12-15", submissions: 25, pending: 3 },
                { id: 3, title: "Project Proposal", course: "CS-401", dueDate: "2025-12-10", submissions: 10, pending: 2 },
              ].map((assignment) => (
                <div key={assignment.id} className="bg-card rounded-lg p-4 border">
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-sm text-muted-foreground">{assignment.course}</div>
                  <div className="text-xs text-muted-foreground mt-1">Due: {assignment.dueDate}</div>
                  <div className="flex justify-between mt-2">
                    <div className="text-sm">
                      <span className="font-medium">{assignment.submissions}</span> submissions
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{assignment.pending}</span> pending review
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Submissions
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Grade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "students":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Students</h1>
            <div className="space-y-3">
              {[
                { id: 1, name: "Alex Johnson", course: "CS-203", progress: 85, grade: "A-" },
                { id: 2, name: "Sam Wilson", course: "CS-203", progress: 78, grade: "B+" },
                { id: 3, name: "Taylor Smith", course: "CS-301", progress: 92, grade: "A" },
                { id: 4, name: "Jordan Lee", course: "CS-301", progress: 65, grade: "C+" },
                { id: 5, name: "Casey Brown", course: "CS-401", progress: 40, grade: "B-" },
              ].map((student) => (
                <div key={student.id} className="bg-card rounded-lg p-4 border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.course}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{student.grade}</div>
                    <div className="text-xs text-muted-foreground">{student.progress}%</div>
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
                    <span>Office Hours - 2:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Department Meeting - 4:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="font-medium">Tomorrow, November 21, 2025</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>CS-301 Tutorial - 9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Research Group Meeting - 3:00 PM</span>
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
                { name: "Alex Johnson", message: "I have a question about the assignment...", time: "15m ago", unread: true },
                { name: "Department Head", message: "Meeting rescheduled to next week", time: "1h ago", unread: false },
                { name: "Research Team", message: "Paper review completed", time: "3h ago", unread: false },
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
      case "analytics":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-2">Course Performance</h2>
                <div className="space-y-3">
                  {[
                    { course: "CS-203", avgGrade: "B+", completion: 95 },
                    { course: "CS-301", avgGrade: "B", completion: 88 },
                    { course: "CS-401", avgGrade: "B-", completion: 75 },
                  ].map((course, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{course.course}</div>
                        <div className="text-sm text-muted-foreground">Avg. Grade: {course.avgGrade}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{course.completion}%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-2">Student Engagement</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignment Submissions</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <span>Forum Participation</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reports</h1>
            <div className="space-y-3">
              {[
                { title: "Student Performance Report", date: "Nov 15, 2025", status: "Generated" },
                { title: "Course Utilization Report", date: "Nov 10, 2025", status: "Generated" },
                { title: "Attendance Report", date: "Nov 5, 2025", status: "Pending" },
                { title: "Grade Distribution Report", date: "Oct 30, 2025", status: "Generated" },
              ].map((report, index) => (
                <div key={index} className="bg-card rounded-lg p-4 border">
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-muted-foreground">{report.date}</div>
                  <div className="mt-2">
                    <Badge variant={report.status === "Generated" ? "secondary" : "outline"}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="text-xs">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Download
                    </Button>
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
        <div className="font-bold">Faculty Dashboard</div>
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
          className={activeView === "students" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("students")}
        >
          <Users className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "analytics" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("analytics")}
        >
          <BarChart3 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}