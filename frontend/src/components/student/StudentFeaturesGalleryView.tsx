"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Camera, 
  Music,
  PenTool,
  Plus,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface StudentFeature {
  id: string;
  title: string;
  description: string;
  type: "blog" | "podcast" | "gallery" | "video" | "project";
  author: string;
  authorId: string;
  createdAt: Date;
  likes: number;
  comments: number;
  tags: string[];
  thumbnail?: string;
}

export function StudentFeaturesGalleryView() {
  const [features, setFeatures] = useState<StudentFeature[]>([
    {
      id: "feat_001",
      title: "My Journey Learning React",
      description: "A comprehensive guide to learning React hooks and state management",
      type: "blog",
      author: "Alex Johnson",
      authorId: "stud_001",
      createdAt: new Date("2025-11-10"),
      likes: 42,
      comments: 8,
      tags: ["react", "javascript", "frontend"]
    },
    {
      id: "feat_002",
      title: "Campus Life Podcast",
      description: "Weekly podcast discussing student life, challenges, and successes",
      type: "podcast",
      author: "Sam Wilson",
      authorId: "stud_002",
      createdAt: new Date("2025-11-05"),
      likes: 78,
      comments: 12,
      tags: ["podcast", "campus", "student-life"]
    },
    {
      id: "feat_003",
      title: "Photography Exhibition",
      description: "Collection of photos capturing the beauty of our campus throughout the seasons",
      type: "gallery",
      author: "Taylor Smith",
      authorId: "stud_003",
      createdAt: new Date("2025-10-28"),
      likes: 126,
      comments: 24,
      tags: ["photography", "campus", "art"]
    },
    {
      id: "feat_004",
      title: "AI Ethics Research Project",
      description: "Exploring the ethical implications of AI in education and society",
      type: "project",
      author: "Jordan Lee",
      authorId: "stud_004",
      createdAt: new Date("2025-11-12"),
      likes: 35,
      comments: 5,
      tags: ["ai", "ethics", "research"]
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <PenTool className="h-4 w-4" />;
      case "podcast":
        return <Music className="h-4 w-4" />;
      case "gallery":
        return <Camera className="h-4 w-4" />;
      case "project":
        return <PenTool className="h-4 w-4" />;
      default:
        return <PenTool className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "blog":
        return <Badge className="bg-blue-100 text-blue-800">Blog</Badge>;
      case "podcast":
        return <Badge className="bg-purple-100 text-purple-800">Podcast</Badge>;
      case "gallery":
        return <Badge className="bg-pink-100 text-pink-800">Gallery</Badge>;
      case "project":
        return <Badge className="bg-green-100 text-green-800">Project</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Features Gallery</h1>
          <p className="text-muted-foreground mt-1">Explore creative works by fellow students</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Share Your Work
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(feature.type)}
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </div>
                {getTypeBadge(feature.type)}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{feature.author}</div>
                    <div className="text-muted-foreground">
                      {feature.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {feature.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {feature.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {feature.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{feature.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{feature.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{feature.comments}</span>
                    </button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {features.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No features found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no student features matching your search criteria. Be the first to share your work!
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Share Your Work
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}