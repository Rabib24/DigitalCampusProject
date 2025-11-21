"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenTool, 
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Calendar,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
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
  status: "draft" | "published" | "archived";
  featuredImage?: string;
}

export function BlogPlatformView() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: "post_001",
      title: "Getting Started with React Hooks",
      excerpt: "A comprehensive guide to understanding and using React Hooks in your applications",
      content: "Full content would be here...",
      author: {
        name: "Alex Johnson",
      },
      createdAt: new Date("2025-11-10"),
      updatedAt: new Date("2025-11-12"),
      tags: ["react", "javascript", "frontend"],
      likes: 42,
      comments: 8,
      views: 256,
      status: "published"
    },
    {
      id: "post_002",
      title: "Campus Life: My First Semester Experience",
      excerpt: "Reflections on navigating university life as a freshman",
      content: "Full content would be here...",
      author: {
        name: "Sarah Williams",
      },
      createdAt: new Date("2025-11-05"),
      updatedAt: new Date("2025-11-05"),
      tags: ["campus-life", "student-experience"],
      likes: 78,
      comments: 12,
      views: 423,
      status: "published"
    },
    {
      id: "post_003",
      title: "The Future of AI in Education",
      excerpt: "Exploring how artificial intelligence is transforming the educational landscape",
      content: "Full content would be here...",
      author: {
        name: "Michael Chen",
      },
      createdAt: new Date("2025-10-28"),
      updatedAt: new Date("2025-10-30"),
      tags: ["ai", "education", "technology"],
      likes: 126,
      comments: 24,
      views: 892,
      status: "published"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: ""
  });

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

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post: BlogPost = {
        id: `post_${Date.now()}`,
        title: newPost.title,
        excerpt: newPost.excerpt || newPost.content.substring(0, 100) + "...",
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
        status: "draft"
      };
      
      setPosts([post, ...posts]);
      setNewPost({ title: "", excerpt: "", content: "", tags: "" });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Blog Platform</h1>
          <p className="text-muted-foreground mt-1">Share your thoughts, experiences, and knowledge with the campus community</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Write Post
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>
              Share your thoughts and experiences with the campus community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter a compelling title for your post"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                placeholder="A brief summary of your post (optional)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                placeholder="Enter tags separated by commas (e.g., react, javascript, campus)"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Save as Draft
              </Button>
              <Button variant="outline">
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {post.excerpt}
                  </CardDescription>
                </div>
                {getStatusBadge(post.status)}
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
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
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
                    <PenTool className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
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
            <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no blog posts matching your search criteria. Be the first to share your thoughts!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write Your First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}