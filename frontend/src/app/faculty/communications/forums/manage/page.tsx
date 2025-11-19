"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Clock,
  Settings
} from "lucide-react";

interface Forum {
  id: string;
  name: string;
  description: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
  threadCount: number;
  postCount: number;
  isPublic: boolean;
  isLocked: boolean;
  moderators: string[];
}

interface ForumThread {
  id: string;
  forumId: string;
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

export default function DiscussionForumManagementPage() {
  const [forums, setForums] = useState<Forum[]>([
    {
      id: "1",
      name: "CS-301 General Discussion",
      description: "General discussion forum for Data Science and Machine Learning course",
      course: "CS-301",
      createdAt: "2023-09-01T10:00:00Z",
      updatedAt: "2023-10-15T14:30:00Z",
      threadCount: 24,
      postCount: 156,
      isPublic: true,
      isLocked: false,
      moderators: ["Dr. Jane Smith", "Dr. John Doe"]
    },
    {
      id: "2",
      name: "Research Collaboration",
      description: "Forum for discussing research opportunities and collaborations",
      createdAt: "2023-08-15T09:00:00Z",
      updatedAt: "2023-10-10T11:20:00Z",
      threadCount: 18,
      postCount: 89,
      isPublic: false,
      isLocked: false,
      moderators: ["Dr. Jane Smith"]
    }
  ]);

  const [threads, setThreads] = useState<ForumThread[]>([
    {
      id: "1",
      forumId: "1",
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
      forumId: "1",
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
    }
  ]);

  const [isCreatingForum, setIsCreatingForum] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForum, setFilterForum] = useState("all");

  const [newForum, setNewForum] = useState({
    name: "",
    description: "",
    course: "",
    isPublic: true
  });

  const handleCreateForum = () => {
    if (!newForum.name || !newForum.description) {
      alert("Please fill in required fields");
      return;
    }

    const forum: Forum = {
      id: (forums.length + 1).toString(),
      name: newForum.name,
      description: newForum.description,
      course: newForum.course || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      threadCount: 0,
      postCount: 0,
      isPublic: newForum.isPublic,
      isLocked: false,
      moderators: ["Current Faculty"] // In a real app, this would be the current user
    };

    setForums([forum, ...forums]);
    setNewForum({
      name: "",
      description: "",
      course: "",
      isPublic: true
    });
    setIsCreatingForum(false);
  };

  const handleDeleteForum = (id: string) => {
    if (confirm("Are you sure you want to delete this forum? All threads and posts will be permanently removed.")) {
      setForums(forums.filter(forum => forum.id !== id));
      // Also remove all threads associated with this forum
      setThreads(threads.filter(thread => thread.forumId !== id));
    }
  };

  const handleTogglePublic = (id: string) => {
    setForums(forums.map(forum => 
      forum.id === id ? { ...forum, isPublic: !forum.isPublic, updatedAt: new Date().toISOString() } : forum
    ));
  };

  const handleToggleLock = (id: string) => {
    setForums(forums.map(forum => 
      forum.id === id ? { ...forum, isLocked: !forum.isLocked, updatedAt: new Date().toISOString() } : forum
    ));
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
    if (confirm("Are you sure you want to delete this thread? All replies will be permanently removed.")) {
      setThreads(threads.filter(thread => thread.id !== id));
    }
  };

  const filteredForums = forums.filter(forum => {
    return forum.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           forum.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (forum.course && forum.course.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForum = filterForum === "all" || thread.forumId === filterForum;
    
    return matchesSearch && matchesForum;
  });

  const totalThreads = threads.length;
  const totalPosts = threads.reduce((sum, thread) => sum + thread.replyCount, 0);
  const activeForums = forums.filter(f => !f.isLocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Forum Management</h1>
          <p className="text-muted-foreground">Manage discussion forums and threads</p>
        </div>
        <Button onClick={() => setIsCreatingForum(true)} className="gap-2">
          <Plus size={18} />
          Create Forum
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Total Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{forums.length}</div>
            <div className="text-muted-foreground">{activeForums} active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Total Threads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalThreads}</div>
            <div className="text-muted-foreground">Across all forums</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Total Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPosts}</div>
            <div className="text-muted-foreground">Including replies</div>
          </CardContent>
        </Card>
      </div>

      {isCreatingForum && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Forum</CardTitle>
            <CardDescription>Set up a new discussion forum</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forumName">Forum Name *</Label>
              <Input
                id="forumName"
                placeholder="Enter forum name"
                value={newForum.name}
                onChange={(e) => setNewForum({...newForum, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="forumDescription">Description *</Label>
              <Textarea
                id="forumDescription"
                placeholder="Enter forum description"
                rows={3}
                value={newForum.description}
                onChange={(e) => setNewForum({...newForum, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="course">Associated Course (Optional)</Label>
              <Input
                id="course"
                placeholder="e.g., CS-301"
                value={newForum.course}
                onChange={(e) => setNewForum({...newForum, course: e.target.value})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Public Forum</h3>
                <p className="text-sm text-muted-foreground">
                  Allow all students to view and participate
                </p>
              </div>
              <Button 
                variant={newForum.isPublic ? "default" : "outline"}
                onClick={() => setNewForum({...newForum, isPublic: !newForum.isPublic})}
              >
                {newForum.isPublic ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateForum} className="gap-2">
                <Plus size={16} />
                Create Forum
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingForum(false)}>
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
                placeholder="Search forums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredForums.length > 0 ? (
              filteredForums.map((forum) => (
                <Card key={forum.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle size={20} className="text-primary" />
                          <CardTitle className="text-lg">{forum.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {forum.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!forum.isPublic && (
                          <Badge variant="secondary">Private</Badge>
                        )}
                        {forum.isLocked && (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{forum.threadCount} threads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-muted-foreground" />
                        <span>{forum.postCount} posts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>Updated {new Date(forum.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {forum.course && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium">Course:</span>
                        <Badge variant="outline">{forum.course}</Badge>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={16} />
                        View Forum
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTogglePublic(forum.id)}
                        className="gap-2"
                      >
                        {forum.isPublic ? "Make Private" : "Make Public"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleLock(forum.id)}
                        className="gap-2"
                      >
                        {forum.isLocked ? "Unlock" : "Lock"}
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Settings size={16} />
                        Settings
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteForum(forum.id)}
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
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No forums found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search criteria" : "Create your first forum to get started"}
                </p>
                <Button onClick={() => setIsCreatingForum(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Create Forum
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search threads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterForum}
                onChange={(e) => setFilterForum(e.target.value)}
              >
                <option value="all">All Forums</option>
                {forums.map(forum => (
                  <option key={forum.id} value={forum.id}>{forum.name}</option>
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
                <h3 className="mt-4 font-medium">No threads found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterForum !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No threads have been created yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}