"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mic, 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Share2,
  Download,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  host: {
    name: string;
    avatar?: string;
  };
  duration: string; // in format "MM:SS"
  publishDate: Date;
  plays: number;
  likes: number;
  tags: string[];
  audioUrl: string;
  status: "draft" | "published" | "archived";
}

export function PodcastPlatformView() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([
    {
      id: "ep_001",
      title: "Campus Life Chronicles: Navigating University",
      description: "In this episode, we discuss the challenges and triumphs of university life with three senior students",
      host: {
        name: "Alex Johnson",
      },
      duration: "42:15",
      publishDate: new Date("2025-11-10"),
      plays: 342,
      likes: 87,
      tags: ["campus-life", "student-experience", "advice"],
      audioUrl: "/audio/episode1.mp3",
      status: "published"
    },
    {
      id: "ep_002",
      title: "Tech Talk: The Future of AI in Education",
      description: "Exploring how artificial intelligence is transforming the educational landscape with Dr. Smith",
      host: {
        name: "Sarah Williams",
      },
      duration: "38:42",
      publishDate: new Date("2025-11-03"),
      plays: 521,
      likes: 124,
      tags: ["technology", "ai", "education"],
      audioUrl: "/audio/episode2.mp3",
      status: "published"
    },
    {
      id: "ep_003",
      title: "Student Spotlight: Entrepreneurship Journey",
      description: "Interview with a student entrepreneur who started a successful campus business",
      host: {
        name: "Michael Chen",
      },
      duration: "51:30",
      publishDate: new Date("2025-10-27"),
      plays: 418,
      likes: 96,
      tags: ["entrepreneurship", "student-business", "inspiration"],
      audioUrl: "/audio/episode3.mp3",
      status: "published"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    description: "",
    tags: "",
    duration: ""
  });

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handlePlayPause = (episodeId: string) => {
    if (currentlyPlaying === episodeId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(episodeId);
      setIsPlaying(true);
    }
  };

  const handleCreateEpisode = () => {
    if (newEpisode.title && newEpisode.description) {
      const episode: PodcastEpisode = {
        id: `ep_${Date.now()}`,
        title: newEpisode.title,
        description: newEpisode.description,
        host: {
          name: "Current User" // This would be the actual user in a real app
        },
        duration: newEpisode.duration || "00:00",
        publishDate: new Date(),
        plays: 0,
        likes: 0,
        tags: newEpisode.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        audioUrl: "/audio/new.mp3", // Placeholder
        status: "draft"
      };
      
      setEpisodes([episode, ...episodes]);
      setNewEpisode({ title: "", description: "", tags: "", duration: "" });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Podcast Platform</h1>
          <p className="text-muted-foreground mt-1">Discover and share student-created podcasts</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search podcasts..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Episode
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Podcast Episode</CardTitle>
            <CardDescription>
              Share your voice and ideas with the campus community through podcasting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="episodeTitle">Episode Title</Label>
              <Input
                id="episodeTitle"
                value={newEpisode.title}
                onChange={(e) => setNewEpisode({...newEpisode, title: e.target.value})}
                placeholder="Enter a compelling title for your episode"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="episodeDescription">Description</Label>
              <Textarea
                id="episodeDescription"
                value={newEpisode.description}
                onChange={(e) => setNewEpisode({...newEpisode, description: e.target.value})}
                placeholder="Describe what listeners can expect from this episode"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (MM:SS)</Label>
                <Input
                  id="duration"
                  value={newEpisode.duration}
                  onChange={(e) => setNewEpisode({...newEpisode, duration: e.target.value})}
                  placeholder="e.g., 35:42"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newEpisode.tags}
                  onChange={(e) => setNewEpisode({...newEpisode, tags: e.target.value})}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Audio Upload</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Mic className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Drag and drop your audio file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV up to 100MB</p>
                <Button variant="outline" className="mt-2">
                  <Mic className="h-4 w-4 mr-2" />
                  Select Audio File
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEpisode}>
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
        {episodes.map((episode) => (
          <Card key={episode.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    {episode.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {episode.description}
                  </CardDescription>
                </div>
                {getStatusBadge(episode.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium text-muted-foreground">
                        {episode.host.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">Hosted by {episode.host.name}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{episode.publishDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{episode.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <Play className="h-4 w-4" />
                      <span>{episode.plays}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm hover:text-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{episode.likes}</span>
                    </button>
                  </div>
                </div>
                
                {episode.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {episode.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handlePlayPause(episode.id)}
                    >
                      {currentlyPlaying === episode.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 ml-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div className="w-16 h-2 bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {episodes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mic className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No podcast episodes found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no podcast episodes matching your search criteria. Be the first to share your voice!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Episode
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}