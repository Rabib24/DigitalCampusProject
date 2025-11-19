"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";

// Mock data for the course
const mockCourse: FacultyCourse = {
  id: "1",
  code: "CS-301",
  name: "Data Science and Machine Learning",
  semester: "Fall",
  year: 2023,
  credits: 4,
  department: "Computer Science",
  studentCount: 28,
  syllabusStatus: "published"
};

interface ClassRecording {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
  status: "processing" | "available" | "failed" | "scheduled";
  viewCount: number;
  downloadCount: number;
  isPublic: boolean;
}

export default function ClassRecordingManagementPage() {
  const [course] = useState<FacultyCourse>(mockCourse);
  const [recordings, setRecordings] = useState<ClassRecording[]>([
    {
      id: "1",
      title: "Lecture 1: Introduction to Data Science",
      date: "2023-09-15T10:00:00Z",
      duration: "1h 25m",
      size: "1.2 GB",
      status: "available",
      viewCount: 124,
      downloadCount: 32,
      isPublic: true
    },
    {
      id: "2",
      title: "Lecture 2: Data Preprocessing",
      date: "2023-09-18T10:00:00Z",
      duration: "1h 32m",
      size: "1.4 GB",
      status: "available",
      viewCount: 98,
      downloadCount: 28,
      isPublic: true
    },
    {
      id: "3",
      title: "Lecture 3: Exploratory Data Analysis",
      date: "2023-09-20T10:00:00Z",
      duration: "1h 18m",
      size: "1.1 GB",
      status: "processing",
      viewCount: 0,
      downloadCount: 0,
      isPublic: true
    },
    {
      id: "4",
      title: "Lecture 4: Statistical Inference",
      date: "2023-09-22T10:00:00Z",
      duration: "1h 40m",
      size: "1.6 GB",
      status: "available",
      viewCount: 76,
      downloadCount: 19,
      isPublic: true
    },
    {
      id: "5",
      title: "Lecture 5: Linear Regression",
      date: "2023-09-25T10:00:00Z",
      duration: "1h 28m",
      size: "1.3 GB",
      status: "failed",
      viewCount: 0,
      downloadCount: 0,
      isPublic: false
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusVariant = (status: ClassRecording["status"]) => {
    switch (status) {
      case "processing": return "secondary";
      case "available": return "default";
      case "failed": return "destructive";
      case "scheduled": return "outline";
      default: return "default";
    }
  };

  const getStatusText = (status: ClassRecording["status"]) => {
    switch (status) {
      case "processing": return "Processing";
      case "available": return "Available";
      case "failed": return "Failed";
      case "scheduled": return "Scheduled";
      default: return "Unknown";
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, this would connect to recording software
    alert("Recording started! In a real application, this would connect to your recording software.");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop the recording
    alert("Recording stopped! In a real application, this would save your recording.");
  };

  const handleDeleteRecording = (id: string) => {
    if (confirm("Are you sure you want to delete this recording?")) {
      setRecordings(recordings.filter(recording => recording.id !== id));
    }
  };

  const togglePublicStatus = (id: string) => {
    setRecordings(recordings.map(recording => 
      recording.id === id ? { ...recording, isPublic: !recording.isPublic } : recording
    ));
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || recording.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Class Recordings</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <div className="flex gap-2">
          {isRecording ? (
            <Button onClick={handleStopRecording} variant="destructive" className="gap-2">
              <Square size={18} />
              Stop Recording
            </Button>
          ) : (
            <Button onClick={handleStartRecording} className="gap-2">
              <Video size={18} />
              Start Recording
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video size={20} />
              Recording Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Currently Recording</span>
                <Badge variant={isRecording ? "default" : "secondary"}>
                  {isRecording ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recording Device</span>
                <span>Default Microphone & Camera</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recording Quality</span>
                <span>1080p HD</span>
              </div>
              <Button variant="outline" className="w-full">
                Recording Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Play className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">Recording started</p>
                  <p className="text-sm text-muted-foreground">Lecture 6: Classification</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Download className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">Student downloaded recording</p>
                  <p className="text-sm text-muted-foreground">Lecture 3: EDA</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Eye className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">Recording viewed</p>
                  <p className="text-sm text-muted-foreground">Lecture 4: Statistical Inference</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} />
              Recording Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Recordings</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total View Time</span>
                <span className="font-medium">42h 18m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Downloads</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. View Duration</span>
                <span className="font-medium">32m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecordings.length > 0 ? (
              filteredRecordings.map((recording) => (
                <Card key={recording.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Video size={20} className="text-primary" />
                          <CardTitle className="text-lg">{recording.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {new Date(recording.date).toLocaleDateString()} • {recording.duration}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(recording.status)}>
                        {getStatusText(recording.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-muted-foreground" />
                        <span>{recording.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download size={16} className="text-muted-foreground" />
                        <span>{recording.downloadCount} downloads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{recording.size}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Play size={16} />
                        Play
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download size={16} />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => togglePublicStatus(recording.id)}
                        className="gap-2"
                      >
                        {recording.isPublic ? "Make Private" : "Make Public"}
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteRecording(recording.id)}
                        className="gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No recordings found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start recording your first class session"}
                </p>
                <Button onClick={handleStartRecording} className="mt-4 gap-2">
                  <Video size={16} />
                  Start Recording
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}