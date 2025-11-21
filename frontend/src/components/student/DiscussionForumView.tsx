"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Search,
  Filter,
  Plus,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  category: string;
  isPinned: boolean;
  status: "active" | "locked" | "archived";
}

export function DiscussionForumView() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "post_001",
      title: "Best study spots on campus for finals?",
      content: "I'm looking for quiet places to study for finals week. Any recommendations besides the library?",
      author: {
        name: "Alex Johnson",
      },
      createdAt: new Date("2025-11-18"),
      updatedAt: new Date("2025-11-18"),
      tags: ["study", "campus-life"],
      likes: 12,
      comments: 8,
      views: 45,
      category: "Campus Life",
      isPinned: true,
      status: "active"
    },
    {
      id: "post_002",
      title: "Python study group for beginners",
      content: "Looking for people interested in forming a Python study group. We meet every Thursday at 6 PM in the CS lab.",
      author: {
        name: "Sarah Williams",
      },
      createdAt: new Date("2025-11-15"),
      updatedAt: new Date("2025-11-17"),
      tags: ["python", "programming", "study-group"],
      likes: 24,
      comments: 15,
      views: 87,
      category: "Academics",
      isPinned: false,
      status: "active"
    },
    {
      id: "post_003",
      title: "Campus Wi-Fi issues in dorms",
      content: "The Wi-Fi in the dorms has been really slow this week. Is anyone else experiencing this?",
      author: {
        name: "Michael Chen",
      },
      createdAt: new Date("2025-11-12"),
      updatedAt: new Date("2025-11-12"),
      tags: ["wifi", "dorms", "it"],
      likes: 8,
      comments: 12,
      views: 63,
      category: "Technical Support",
      isPinned: false,
      status: "locked"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General",
    tags: ""
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Campus Life":
        return <Badge className="bg-green-100 text-green-800">{category}</Badge>;
      case "Academics":
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      case "Technical Support":
        return <Badge className="bg-red-100 text-red-800">{category}</Badge>;
      case "Events":
        return <Badge className="bg-purple-100 text-purple-800">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "locked":
        return <Badge className="bg-yellow-100 text-yellow-800">Locked</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: ForumPost = {
        id: `post_${Date.now()}`,
        title: newPost.title,
        content: newPost.content,
        author: {
          name: "Current User" // This would be the actual user in a real app
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        comments: 0,
        views: 0,
        category: newPost.category,
        isPinned: false,
        status: "active"
      };
      
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "", category: "General", tags: "" });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discussion Forum</h1>
          <p className="text-muted-foreground mt-1">Connect with fellow students and discuss campus topics</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Discussion</CardTitle>
            <CardDescription>
              Start a new conversation with the campus community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter a clear and descriptive title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select 
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="General">General</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Clubs & Organizations">Clubs & Organizations</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags</label>
              <Input
                id="tags"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                placeholder="Enter tags separated by commas (e.g., study, campus, events)"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Create Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className={post.isPinned ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {post.title}
                    {post.isPinned && (
                      <Badge className="bg-primary text-primary-foreground">Pinned</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {post.content.substring(0, 150)}...
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(post.category)}
                  {getStatusBadge(post.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium text-muted-foreground">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{post.author.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{post.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <User className="h-4 w-4" />
                      <span>{post.views}</span>
                    </button>
                  </div>
                </div>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Discussion
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No discussions found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no discussions matching your search criteria. Be the first to start a conversation!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Discussion
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}