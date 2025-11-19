"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Search, Filter, Play, Pause, Download, Share2, Trash2, Eye, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyRecordings } from "@/lib/faculty/api";

interface Recording {
  id: number;
  title: string;
  course: string;
  date: string;
  duration: string;
  status: "published" | "draft" | "processing";
  views: number;
  visibility: "public" | "students" | "private";
}

export function FacultyRecordingsView() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        const data = await getFacultyRecordings();
        setRecordings(data.recordings || []);
      } catch (err) {
        setError("Failed to load recordings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  const getStatusVariant = (status: Recording["status"]) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "processing":
        return "outline";
      default:
        return "default";
    }
  };

  const getVisibilityIcon = (visibility: Recording["visibility"]) => {
    switch (visibility) {
      case "public":
        return "🌍";
      case "students":
        return "👥";
      case "private":
        return "🔒";
      default:
        return "🔒";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Class Recordings</h2>
          <p className="text-muted-foreground mt-1">Manage and share your class recordings</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Video size={18} />
          Start Recording
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Recording Library</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search recordings..." className="pl-8" />
              </div>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage all your class recordings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">No recordings found</CardTitle>
              <CardDescription className="mt-2">
                You haven&apos;t recorded any classes yet. Start recording your first class.
              </CardDescription>
              <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
                <Video size={16} />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Video size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{recording.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {recording.course} • {recording.date} • {recording.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(recording.status)}>
                      {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye size={16} />
                      {recording.views}
                    </div>
                    <div className="text-sm" title={`Visibility: ${recording.visibility}`}>
                      {getVisibilityIcon(recording.visibility)}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Play size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}