"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Calendar, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Send, 
  Target,
  Users,
  BookOpen,
  Building
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  targetAudience: "all" | "specific-course" | "department" | "year";
  courseId?: string;
  department?: string;
  year?: number;
  status: "draft" | "scheduled" | "published";
  scheduledFor?: string;
  views: number;
  likes: number;
}

export default function FacultyAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements and courses from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch announcements
        const announcementsResponse = await fetch('/api/faculty/announcements/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (announcementsResponse.ok) {
          const data = await announcementsResponse.json();
          setAnnouncements(data.announcements || []);
        }
        
        // Fetch courses for the dropdown
        const coursesResponse = await fetch('/api/faculty/courses/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          setCourses(coursesData.courses || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    targetAudience: "all" as "all" | "specific-course" | "department" | "year",
    courseId: "",
    department: "",
    year: 2023
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message) return;

    try {
      const response = await fetch('/api/faculty/announcements/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          targetAudience: newAnnouncement.targetAudience,
          courseId: newAnnouncement.courseId,
          department: newAnnouncement.department,
          year: newAnnouncement.year,
          status: 'published'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      const data = await response.json();
      
      // Add the new announcement to the list
      const newAnnouncementData: Announcement = {
        id: data.announcement.id,
        title: newAnnouncement.title,
        message: newAnnouncement.message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Current Faculty",
        targetAudience: newAnnouncement.targetAudience,
        courseId: newAnnouncement.courseId,
        department: newAnnouncement.department,
        year: newAnnouncement.year,
        status: "published",
        views: 0,
        likes: 0
      };

      setAnnouncements([newAnnouncementData, ...announcements]);
      setNewAnnouncement({
        title: "",
        message: "",
        targetAudience: "all",
        courseId: "",
        department: "",
        year: 2023
      });
      setIsCreating(false);
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || announcement.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: Announcement["status"]) => {
    switch (status) {
      case "draft": return "secondary";
      case "scheduled": return "outline";
      case "published": return "default";
      default: return "default";
    }
  };

  const getAudienceIcon = (audience: Announcement["targetAudience"]) => {
    switch (audience) {
      case "all": return <Users size={16} />;
      case "specific-course": return <BookOpen size={16} />;
      case "department": return <Building size={16} />;
      case "year": return <Target size={16} />;
      default: return <Users size={16} />;
    }
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage announcements for your students</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Create Announcement
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Share important information with your students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea
                id="message"
                placeholder="Enter your announcement message"
                rows={4}
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant={newAnnouncement.targetAudience === "all" ? "default" : "outline"}
                  onClick={() => setNewAnnouncement({...newAnnouncement, targetAudience: "all"})}
                  className="gap-2"
                >
                  <Users size={16} />
                  All Students
                </Button>
                <Button
                  variant={newAnnouncement.targetAudience === "specific-course" ? "default" : "outline"}
                  onClick={() => setNewAnnouncement({...newAnnouncement, targetAudience: "specific-course"})}
                  className="gap-2"
                >
                  <BookOpen size={16} />
                  Specific Course
                </Button>
                <Button
                  variant={newAnnouncement.targetAudience === "department" ? "default" : "outline"}
                  onClick={() => setNewAnnouncement({...newAnnouncement, targetAudience: "department"})}
                  className="gap-2"
                >
                  <Building size={16} />
                  Department
                </Button>
                <Button
                  variant={newAnnouncement.targetAudience === "year" ? "default" : "outline"}
                  onClick={() => setNewAnnouncement({...newAnnouncement, targetAudience: "year"})}
                  className="gap-2"
                >
                  <Target size={16} />
                  Year Group
                </Button>
              </div>
            </div>
            
            {newAnnouncement.targetAudience === "specific-course" && (
              <div className="space-y-2">
                <label htmlFor="course" className="text-sm font-medium">Select Course</label>
                <select
                  id="course"
                  className="w-full p-2 border rounded"
                  value={newAnnouncement.courseId}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, courseId: e.target.value})}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleCreateAnnouncement} className="gap-2">
                <Send size={16} />
                Publish Announcement
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getAudienceIcon(announcement.targetAudience)}
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          by {announcement.createdBy} • {new Date(announcement.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(announcement.status)}>
                        {announcement.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{announcement.message}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{announcement.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bell size={16} />
                        <span>{announcement.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Updated {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {announcement.courseId && (
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          <span>
                            {courses.find(c => c.id === announcement.courseId)?.code || announcement.courseId}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline">
                        Duplicate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No announcements found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first announcement to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Create Announcement
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}