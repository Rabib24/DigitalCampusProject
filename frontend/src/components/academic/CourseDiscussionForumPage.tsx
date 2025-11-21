"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MessageCircle, 
  Send,
  ThumbsUp,
  Reply,
  Filter,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiscussionPost {
  id: string;
  author: string;
  authorRole: "student" | "faculty";
  content: string;
  createdAt: Date;
  likes: number;
  replies: DiscussionReply[];
  tags: string[];
}

interface DiscussionReply {
  id: string;
  author: string;
  authorRole: "student" | "faculty";
  content: string;
  createdAt: Date;
  likes: number;
}

export function CourseDiscussionForumPage({ courseId }: { courseId: string }) {
  const [posts, setPosts] = useState<DiscussionPost[]>([
    {
      id: "post_001",
      author: "Alex Johnson",
      authorRole: "student",
      content: "I'm having trouble understanding the time complexity of merge sort. Can someone explain it more clearly?",
      createdAt: new Date("2025-11-15"),
      likes: 5,
      replies: [
        {
          id: "reply_001",
          author: "Dr. Sarah Miller",
          authorRole: "faculty",
          content: "Merge sort has a time complexity of O(n log n) because it divides the array into two halves recursively (log n levels) and at each level, it merges the halves which takes O(n) time.",
          createdAt: new Date("2025-11-15"),
          likes: 3
        },
        {
          id: "reply_002",
          author: "Taylor Smith",
          authorRole: "student",
          content: "Think of it like a tournament bracket. Each round halves the number of competitors until you have a winner, and you need log n rounds. Each round requires comparing all n elements.",
          createdAt: new Date("2025-11-16"),
          likes: 8
        }
      ],
      tags: ["sorting", "merge-sort", "time-complexity"]
    },
    {
      id: "post_002",
      author: "Dr. Sarah Miller",
      authorRole: "faculty",
      content: "Reminder: Assignment 3 is due next Friday. Please make sure to submit your solutions on time. If you have any questions, feel free to post them here.",
      createdAt: new Date("2025-11-10"),
      likes: 12,
      replies: [
        {
          id: "reply_003",
          author: "Jordan Lee",
          authorRole: "student",
          content: "What format should we use for submitting the assignment? PDF or code files?",
          createdAt: new Date("2025-11-11"),
          likes: 1
        }
      ],
      tags: ["assignment", "reminder"]
    }
  ]);

  const [newPost, setNewPost] = useState({
    content: "",
    tags: ""
  });

  const [newReply, setNewReply] = useState<{[key: string]: string}>({});

  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      const post: DiscussionPost = {
        id: `post_${Date.now()}`,
        author: "Current User",
        authorRole: "student",
        content: newPost.content,
        createdAt: new Date(),
        likes: 0,
        replies: [],
        tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };
      setPosts([post, ...posts]);
      setNewPost({ content: "", tags: "" });
    }
  };

  const handleCreateReply = (postId: string) => {
    if (newReply[postId]?.trim()) {
      const reply: DiscussionReply = {
        id: `reply_${Date.now()}`,
        author: "Current User",
        authorRole: "student",
        content: newReply[postId],
        createdAt: new Date(),
        likes: 0
      };
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, reply]
          };
        }
        return post;
      }));
      
      setNewReply({
        ...newReply,
        [postId]: ""
      });
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleLikeReply = (postId: string, replyId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Discussion Forum</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Start a Discussion
          </CardTitle>
          <CardDescription>
            Share your questions, insights, or start a conversation with classmates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-content">What would you like to discuss?</Label>
            <Textarea
              id="post-content"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Type your question or discussion topic here..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-tags">Tags (comma separated)</Label>
            <Input
              id="post-tags"
              value={newPost.tags}
              onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
              placeholder="e.g., sorting, algorithms, data-structures"
            />
          </div>
          <Button onClick={handleCreatePost}>
            <Send className="h-4 w-4 mr-2" />
            Post Discussion
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {post.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{post.author}</div>
                    {post.authorRole === "faculty" && (
                      <Badge variant="default">Instructor</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.createdAt.toLocaleDateString()} at {post.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-foreground">{post.content}</p>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-bold">
                          {reply.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{reply.author}</div>
                            {reply.authorRole === "faculty" && (
                              <Badge variant="default" className="text-xs">Instructor</Badge>
                            )}
                          </div>
                          <p className="text-sm mt-1">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="text-xs text-muted-foreground">
                              {reply.createdAt.toLocaleDateString()} at {reply.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleLikeReply(post.id, reply.id)}
                              className="flex items-center gap-1 text-xs h-6 px-2"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{reply.likes}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      Y
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={newReply[post.id] || ""}
                        onChange={(e) => setNewReply({...newReply, [post.id]: e.target.value})}
                        placeholder="Write a reply..."
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleCreateReply(post.id)}
                        disabled={!newReply[post.id]?.trim()}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}