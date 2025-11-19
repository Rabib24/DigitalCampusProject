"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  Bell, 
  BarChart3,
  MessageSquare,
  Clock,
  TrendingUp
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

export default function MobileDashboardPage() {
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  // Mock data
  const quickStats = [
    { title: "Active Courses", value: "5", icon: BookOpen, change: "+1" },
    { title: "Total Students", value: "185", icon: Users, change: "+12" },
    { title: "Pending Assignments", value: "8", icon: FileText, change: "-3" },
    { title: "Upcoming Meetings", value: "2", icon: Calendar, change: "0" }
  ];
  
  const recentCourses = [
    { id: "1", code: "CS-101", name: "Intro to Computer Science", students: 45, progress: 75 },
    { id: "2", code: "CS-205", name: "Web Development", students: 32, progress: 60 },
    { id: "3", code: "CS-301", name: "Data Science", students: 28, progress: 40 }
  ];
  
  const recentActivity = [
    { id: "1", title: "New Assignment Submission", time: "2 min ago", type: "assignment" },
    { id: "2", title: "Discussion Reply", time: "1 hour ago", type: "discussion" },
    { id: "3", title: "Grade Published", time: "3 hours ago", type: "grade" }
  ];

  return (
    <FacultyProtectedRoute>
      <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-green-500 mt-1">{stat.change} from last week</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentCourses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
              <div>
                <h3 className="font-medium text-sm">{course.code}</h3>
                <p className="text-xs text-muted-foreground">{course.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs">{course.students} students</p>
                <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Courses
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
              <div className="bg-primary/10 p-1.5 rounded-full">
                {activity.type === "assignment" && <FileText className="h-4 w-4 text-primary" />}
                {activity.type === "discussion" && <MessageSquare className="h-4 w-4 text-primary" />}
                {activity.type === "grade" && <TrendingUp className="h-4 w-4 text-primary" />}
              </div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <FileText className="h-6 w-6" />
          <span>Assignments</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <BarChart3 className="h-6 w-6" />
          <span>Analytics</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <Users className="h-6 w-6" />
          <span>Advising</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <Calendar className="h-6 w-6" />
          <span>Schedule</span>
        </Button>
      </div>
    </div>
    </FacultyProtectedRoute>
  );
}