"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Pin,
  Lock,
  Eye,
  Users,
  Clock
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

interface ForumThread {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: "faculty" | "student";
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
}

export default function CourseForumPage() {
  const [course] = useState<FacultyCourse>(mockCourse);
  const [threads, setThreads] = useState<ForumThread[]>([
    {
      id: "1",
      title: "Clarification on Assignment 2 Requirements",
      content: "I'm a bit confused about the requirements for the machine learning model implementation. Could someone please clarify what exactly we need to implement?",
      author: "Alex Johnson",
      authorRole: "student",
      createdAt: "2023-10-05T14:30:00Z",
      updatedAt: "2023-10-05T14:30:00Z",
      replyCount: 12,
      viewCount: 45,
      isPinned: true,
      isLocked: false,
      tags: ["assignment", "clarification"]
    },
    {
      id: "2",
      title: "Office Hours This Week",
      content: "Just a reminder that my office hours this week are moved to Wednesday 3-5 PM due to a scheduling conflict.",
      author: "Dr. Jane Smith",
      authorRole: "faculty",
      createdAt: "2023-10-03T09:15:00Z",
      updatedAt: "2023-10-03T09:15:00Z",
      replyCount: 3,
      viewCount: 28,
      isPinned: true,
      isLocked: false,
      tags: ["announcement", "office-hours"]
    },
    {
      id: "3",
      title: "Recommended Resources for Data Visualization",
      content: "Does anyone have recommendations for good resources or tutorials on data visualization with Python?",
      author: "Sarah Williams",
      authorRole: "student",
      createdAt: "2023-10-01T16:45:00Z",
      updatedAt: "2023-10-02T10:20:00Z",
      replyCount: 8,
      viewCount: 32,
      isPinned: false,
      isLocked: false,
      tags: ["resources", "visualization"]
    },
    {
      id: "4",
      title: "Project Group Formation",
      content: "I'm looking for 1-2 more people to form a project group. Please message me if you're interested!",
      author: "Michael Chen",
      authorRole: "student",
      createdAt: "2023-09-28T11:30:00Z",
      updatedAt: "2023-09-28T11:30:00Z",
      replyCount: 5,
      viewCount: 18,
      isPinned: false,
      isLocked: false,
      tags: ["project", "group"]
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    tags: ""
  });

  // Get all unique tags
  const allTags = Array.from(new Set(threads.flatMap(thread => thread.tags)));

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.content) {
      alert("Please fill in required fields");
      return;
    }

    const thread: ForumThread = {
      id: (threads.length + 1).toString(),
      title: newThread.title,
      content: newThread.content,
      author: "Current Faculty", // In a real app, this would be the current user
      authorRole: "faculty",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replyCount: 0,
      viewCount: 1,
      isPinned: false,
      isLocked: false,
      tags: newThread.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setThreads([thread, ...threads]);
    setNewThread({ title: "", content: "", tags: "" });
    setIsCreating(false);
  };

  const handlePinThread = (id: string) => {
    setThreads(threads.map(thread => 
      thread.id === id ? { ...thread, isPinned: !thread.isPinned } : thread
    ));
  };

  const handleLockThread = (id: string) => {
    setThreads(threads.map(thread => 
      thread.id === id ? { ...thread, isLocked: !thread.isLocked } : thread
    ));
  };

  const handleDeleteThread = (id: string) => {
    if (confirm("Are you sure you want to delete this thread?")) {
      setThreads(threads.filter(thread => thread.id !== id));
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "all" || thread.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Course Forum</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          New Thread
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Thread</CardTitle>
            <CardDescription>Start a new discussion in the course forum</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="thread-title">Title *</label>
              <Input
                id="thread-title"
                placeholder="Enter thread title"
                value={newThread.title}
                onChange={(e) => setNewThread({...newThread, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="thread-content">Content *</label>
              <Textarea
                id="thread-content"
                placeholder="Enter your message"
                rows={6}
                value={newThread.content}
                onChange={(e) => setNewThread({...newThread, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="thread-tags">Tags (comma separated)</label>
              <Input
                id="thread-tags"
                placeholder="e.g., assignment, question, resources"
                value={newThread.tags}
                onChange={(e) => setNewThread({...newThread, tags: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateThread} className="gap-2">
                <MessageCircle size={16} />
                Post Thread
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
                placeholder="Search forum threads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
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
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <Card key={thread.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {thread.isPinned && (
                            <Pin size={16} className="text-primary" />
                          )}
                          {thread.isLocked && (
                            <Lock size={16} className="text-muted-foreground" />
                          )}
                          <CardTitle className="text-lg">
                            {thread.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          by {thread.author} • {new Date(thread.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {thread.authorRole === "faculty" && (
                          <Badge variant="default">Faculty</Badge>
                        )}
                        {thread.isPinned && (
                          <Badge variant="secondary">Pinned</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {thread.content.length > 200 
                        ? `${thread.content.substring(0, 200)}...` 
                        : thread.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {thread.tags.map(tag => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{thread.replyCount} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>{thread.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>Updated {new Date(thread.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Thread
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handlePinThread(thread.id)}
                        >
                          <Pin size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleLockThread(thread.id)}
                        >
                          <Lock size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteThread(thread.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No forum threads found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterTag !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start the first discussion in this course"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  New Thread
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Forum Statistics</CardTitle>
          <CardDescription>Overview of course forum activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-muted-foreground">Total Threads</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">156</div>
              <div className="text-muted-foreground">Total Replies</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">89</div>
              <div className="text-muted-foreground">Participants</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-muted-foreground">New This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}