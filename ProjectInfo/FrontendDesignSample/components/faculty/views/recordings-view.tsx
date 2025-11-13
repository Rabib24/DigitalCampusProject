"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Play, Lock, Share2, Trash2 } from "lucide-react"

export function RecordingsView() {
  const recordings = [
    {
      id: 1,
      title: "Lecture 10: Machine Learning Basics",
      course: "CS-301",
      date: "2024-12-10",
      duration: "1h 15m",
      size: "850 MB",
      status: "Published",
    },
    {
      id: 2,
      title: "Lecture 9: Data Preprocessing",
      course: "CS-301",
      date: "2024-12-08",
      duration: "1h 30m",
      size: "920 MB",
      status: "Saved",
    },
    {
      id: 3,
      title: "Final Project Review",
      course: "CS-401",
      date: "2024-12-05",
      duration: "45m",
      size: "620 MB",
      status: "Saved",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Class Recordings</h2>
          <p className="text-muted-foreground mt-1">Manage and share your lecture recordings</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Video size={18} />
          Start Recording
        </Button>
      </div>

      <div className="grid gap-4">
        {recordings.map((recording) => (
          <Card key={recording.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Video size={20} className="text-primary" />
                    <CardTitle className="text-lg">{recording.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    {recording.course} • {recording.date} • {recording.duration}
                  </CardDescription>
                </div>
                <Badge>{recording.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">File size: {recording.size}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Play size={16} />
                    Play
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Lock size={16} />
                    Permissions
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent text-destructive">
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
