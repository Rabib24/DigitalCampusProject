"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, Video, Plus } from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface ClassSession {
  id: number;
  course: string;
  courseCode: string;
  time: string;
  duration: string;
  location: string;
  type: "lecture" | "lab" | "seminar";
  recordingStatus: "not-started" | "recording" | "completed";
}

export default function FacultySchedulePage() {
  const [sessions, setSessions] = useState<ClassSession[]>([
    {
      id: 1,
      course: "Data Science and Machine Learning",
      courseCode: "CS-301",
      time: "09:00 AM - 10:30 AM",
      duration: "1.5 hours",
      location: "Room 205, Building A",
      type: "lecture",
      recordingStatus: "not-started"
    },
    {
      id: 2,
      course: "Web Development",
      courseCode: "CS-205",
      time: "11:00 AM - 12:30 PM",
      duration: "1.5 hours",
      location: "Room 301, Building B",
      type: "lab",
      recordingStatus: "not-started"
    },
    {
      id: 3,
      course: "Capstone Project",
      courseCode: "CS-401",
      time: "02:00 PM - 04:00 PM",
      duration: "2 hours",
      location: "Room 102, Building C",
      type: "seminar",
      recordingStatus: "not-started"
    }
  ]);

  const getTypeVariant = (type: ClassSession["type"]) => {
    switch (type) {
      case "lecture":
        return "default";
      case "lab":
        return "secondary";
      case "seminar":
        return "outline";
      default:
        return "default";
    }
  };

  const getRecordingStatusVariant = (status: ClassSession["recordingStatus"]) => {
    switch (status) {
      case "not-started":
        return "secondary";
      case "recording":
        return "destructive";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRecordingStatusText = (status: ClassSession["recordingStatus"]) => {
    switch (status) {
      case "not-started":
        return "Not Started";
      case "recording":
        return "Recording";
      case "completed":
        return "Completed";
      default:
        return "Not Started";
    }
  };

  const getRecordingIcon = (status: ClassSession["recordingStatus"]) => {
    switch (status) {
      case "not-started":
        return "⏺️";
      case "recording":
        return "🔴";
      case "completed":
        return "✅";
      default:
        return "⏺️";
    }
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">View and manage your class schedule</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Schedule Class
        </Button>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    <CardTitle className="text-lg">{session.course}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    {session.courseCode} • {session.time} • {session.duration}
                  </CardDescription>
                </div>
                <Badge variant={getTypeVariant(session.type)}>
                  {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{session.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRecordingIcon(session.recordingStatus)}</span>
                    <span>Recording Status</span>
                  </div>
                  <Badge variant={getRecordingStatusVariant(session.recordingStatus)}>
                    {getRecordingStatusText(session.recordingStatus)}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Video size={16} />
                    Start Recording
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Calendar size={16} />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your classes for the upcoming week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="text-center p-2 border rounded">
                <div className="font-medium">{day}</div>
                <div className="text-sm text-muted-foreground">
                  {index < 5 ? `${2 + index} classes` : "No classes"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}