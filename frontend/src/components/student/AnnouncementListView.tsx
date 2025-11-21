"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  audience: string[];
  priority: "low" | "medium" | "high";
  status: "draft" | "published" | "archived";
}

export function AnnouncementListView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "ann_001",
      title: "Campus Closure for Winter Break",
      content: "The campus will be closed from December 20, 2025 to January 5, 2026. All administrative offices will be closed during this period.",
      author: "Dr. Sarah Johnson",
      createdAt: new Date("2025-11-15"),
      updatedAt: new Date("2025-11-15"),
      audience: ["all"],
      priority: "high",
      status: "published"
    },
    {
      id: "ann_002",
      title: "New Library Hours During Finals Week",
      content: "The library will extend its hours during finals week. Starting December 1st, we will be open 24/7 until December 15th.",
      author: "Library Administration",
      createdAt: new Date("2025-11-10"),
      updatedAt: new Date("2025-11-12"),
      audience: ["students"],
      priority: "medium",
      status: "published"
    },
    {
      id: "ann_003",
      title: "Career Fair 2025 Registration Now Open",
      content: "Register now for the annual Career Fair 2025. Over 100 companies will be attending. Registration closes November 30th.",
      author: "Career Services",
      createdAt: new Date("2025-11-05"),
      updatedAt: new Date("2025-11-05"),
      audience: ["students"],
      priority: "medium",
      status: "published"
    },
    {
      id: "ann_004",
      title: "System Maintenance Notice",
      content: "Scheduled maintenance for the student portal will occur on November 25th from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.",
      author: "IT Department",
      createdAt: new Date("2025-11-18"),
      updatedAt: new Date("2025-11-18"),
      audience: ["all"],
      priority: "low",
      status: "draft"
    }
  ]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "archived":
        return <Badge className="bg-blue-100 text-blue-800">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">View and manage campus announcements</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {announcement.content.substring(0, 150)}...
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(announcement.status)}
                  {getPriorityBadge(announcement.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Author</div>
                      <div className="text-sm text-muted-foreground">
                        {announcement.author}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {announcement.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Audience</div>
                    <div className="text-sm text-muted-foreground">
                      {announcement.audience.join(", ")}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Last Updated</div>
                      <div className="text-sm text-muted-foreground">
                        {announcement.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No announcements found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no announcements matching your search criteria. Create a new announcement to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}