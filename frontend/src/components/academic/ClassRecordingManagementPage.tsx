"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  Play,
  Pause,
  Square,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Recording {
  id: string;
  title: string;
  date: Date;
  duration: string;
  size: string;
  status: "processing" | "available" | "failed";
  visibility: "public" | "private" | "students-only";
  views: number;
  downloads: number;
}

export function ClassRecordingManagementPage({ courseId }: { courseId: string }) {
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: "rec_001",
      title: "Lecture 1: Introduction to Data Structures",
      date: new Date("2025-11-01"),
      duration: "1h 25m",
      size: "450 MB",
      status: "available",
      visibility: "students-only",
      views: 42,
      downloads: 12
    },
    {
      id: "rec_002",
      title: "Lecture 2: Arrays and Linked Lists",
      date: new Date("2025-11-03"),
      duration: "1h 30m",
      size: "520 MB",
      status: "available",
      visibility: "students-only",
      views: 38,
      downloads: 8
    },
    {
      id: "rec_003",
      title: "Lecture 3: Stacks and Queues",
      date: new Date("2025-11-08"),
      duration: "1h 15m",
      size: "380 MB",
      status: "processing",
      visibility: "students-only",
      views: 0,
      downloads: 0
    },
    {
      id: "rec_004",
      title: "Lecture 4: Trees and Graphs",
      date: new Date("2025-11-10"),
      duration: "1h 40m",
      size: "620 MB",
      status: "available",
      visibility: "students-only",
      views: 25,
      downloads: 5
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, this would connect to a recording service
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop the recording and save it
    const newRecording: Recording = {
      id: `rec_${Date.now()}`,
      title: `Lecture ${recordings.length + 1}: ${new Date().toLocaleDateString()}`,
      date: new Date(),
      duration: "0m",
      size: "0 MB",
      status: "processing",
      visibility: "students-only",
      views: 0,
      downloads: 0
    };
    setRecordings([newRecording, ...recordings]);
  };

  const handleToggleVisibility = (id: string) => {
    setRecordings(recordings.map(recording => {
      if (recording.id === id) {
        return {
          ...recording,
          visibility: recording.visibility === "public" ? "private" : 
                     recording.visibility === "private" ? "students-only" : "public"
        };
      }
      return recording;
    }));
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(recordings.filter(recording => recording.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Class Recordings</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <div className="flex gap-2">
          {isRecording ? (
            <Button onClick={handleStopRecording} variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          ) : (
            <Button onClick={handleStartRecording}>
              <Video className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          )}
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Recording
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recordings.map((recording) => (
          <Card key={recording.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    {recording.title}
                  </CardTitle>
                  <CardDescription>
                    {recording.date.toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteRecording(recording.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{recording.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Size</span>
                  <span className="font-medium">{recording.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge 
                    variant={
                      recording.status === "available" ? "default" : 
                      recording.status === "processing" ? "secondary" : "destructive"
                    }
                  >
                    {recording.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visibility</span>
                  <div className="flex items-center gap-2">
                    {recording.visibility === "public" ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span className="text-sm capitalize">{recording.visibility.replace("-", " ")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Views</span>
                  <span className="font-medium">{recording.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Downloads</span>
                  <span className="font-medium">{recording.downloads}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor={`visibility-${recording.id}`} className="text-sm">
                    Public Access
                  </Label>
                  <Switch
                    id={`visibility-${recording.id}`}
                    checked={recording.visibility === "public"}
                    onCheckedChange={() => handleToggleVisibility(recording.id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recordings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No recordings yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Start recording a lecture or upload an existing recording to get started.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleStartRecording}>
                <Video className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Recording
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}