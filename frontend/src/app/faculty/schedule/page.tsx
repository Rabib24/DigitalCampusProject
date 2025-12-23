"use client";

import { useState, useEffect } from "react";
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
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [weeklyOverview, setWeeklyOverview] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedule data from the API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faculty/schedule/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedule');
        }
        
        const data = await response.json();
        setSessions(data.sessions || []);
        
        // Fetch weekly overview
        const overviewResponse = await fetch('/api/faculty/schedule/weekly-overview/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (overviewResponse.ok) {
          const overviewData = await overviewResponse.json();
          setWeeklyOverview(overviewData.weekly_overview || {});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, []);

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
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading schedule...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      ) : (
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
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <div key={day} className="text-center p-2 border rounded">
                <div className="font-medium">{day.substring(0, 3)}</div>
                <div className="text-sm text-muted-foreground">
                  {weeklyOverview[day] ? `${weeklyOverview[day]} classes` : "No classes"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
      )}
    </FacultyProtectedRoute>
  );
}