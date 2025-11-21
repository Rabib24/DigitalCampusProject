"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Camera, 
  MapPin, 
  Clock,
  Star,
  Heart,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Club = {
  id: string;
  name: string;
  category: string;
  members: number;
  description: string;
  isMember: boolean;
  events: number;
};

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "competition" | "meeting" | "social" | "workshop";
  registered: boolean;
};

type Achievement = {
  id: string;
  title: string;
  date: string;
  type: "award" | "competition" | "leadership";
  description: string;
};

type Post = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
};

export function CampusLifeView() {
  const [clubs] = useState<Club[]>([
    {
      id: "1",
      name: "Computer Science Club",
      category: "Academic",
      members: 128,
      description: "For students passionate about programming, AI, and technology innovation",
      isMember: true,
      events: 5
    },
    {
      id: "2",
      name: "Photography Society",
      category: "Arts",
      members: 85,
      description: "Capture campus life and develop your photography skills",
      isMember: false,
      events: 3
    },
    {
      id: "3",
      name: "Debate Team",
      category: "Academic",
      members: 42,
      description: "Sharpen your critical thinking and public speaking skills",
      isMember: true,
      events: 2
    },
    {
      id: "4",
      name: "Basketball Club",
      category: "Sports",
      members: 35,
      description: "Competitive and recreational basketball for all skill levels",
      isMember: false,
      events: 4
    }
  ]);

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Hackathon 2025",
      date: "2025-12-10",
      time: "09:00",
      location: "Engineering Building",
      type: "competition",
      registered: true
    },
    {
      id: "2",
      title: "AI Workshop",
      date: "2025-12-05",
      time: "14:00",
      location: "Library Room 201",
      type: "workshop",
      registered: false
    },
    {
      id: "3",
      title: "Club Meeting: Computer Science",
      date: "2025-11-28",
      time: "17:30",
      location: "Student Center",
      type: "meeting",
      registered: true
    },
    {
      id: "4",
      title: "Photography Exhibition",
      date: "2025-12-15",
      time: "12:00",
      location: "Art Gallery",
      type: "social",
      registered: false
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "1st Place in Coding Competition",
      date: "2025-10-15",
      type: "competition",
      description: "Won the annual university-wide programming contest"
    },
    {
      id: "2",
      title: "Outstanding Club Member",
      date: "2025-09-20",
      type: "award",
      description: "Recognized for exceptional contribution to Computer Science Club"
    },
    {
      id: "3",
      title: "Team Captain",
      date: "2025-08-30",
      type: "leadership",
      description: "Elected as captain of the Computer Science Club"
    }
  ]);

  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: "Alex Johnson",
      content: "Just finished an amazing workshop on machine learning! The future is here!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5
    },
    {
      id: "2",
      author: "Sam Wilson",
      content: "Our team won the regional hackathon! So proud of everyone's hard work.",
      timestamp: "1 day ago",
      likes: 87,
      comments: 12
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "competition":
        return <Trophy className="h-4 w-4" />;
      case "workshop":
        return <Star className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "social":
        return <Camera className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "competition":
        return <Badge className="bg-purple-100 text-purple-800">Competition</Badge>;
      case "workshop":
        return <Badge className="bg-blue-100 text-blue-800">Workshop</Badge>;
      case "meeting":
        return <Badge className="bg-green-100 text-green-800">Meeting</Badge>;
      case "social":
        return <Badge className="bg-yellow-100 text-yellow-800">Social</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Campus Life</h2>
        <p className="text-muted-foreground mt-1">Connect, participate, and engage with campus activities</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clubs & Societies
              </CardTitle>
              <CardDescription>
                Join clubs that match your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubs.map((club) => (
                  <div key={club.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{club.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{club.description}</div>
                      </div>
                      {club.isMember && (
                        <Badge variant="secondary">Member</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {club.members}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {club.events} events
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {club.isMember ? (
                        <Button variant="outline" size="sm">
                          View Club
                        </Button>
                      ) : (
                        <Button size="sm">
                          Join Club
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Never miss what&#39;s happening on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {event.date} at {event.time} • {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(event.type)}
                      {event.registered ? (
                        <Button variant="outline" size="sm">
                          Registered
                        </Button>
                      ) : (
                        <Button size="sm">
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Campus Feed
              </CardTitle>
              <CardDescription>
                What&#39;s happening around campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{post.author}</div>
                        <div className="text-xs text-muted-foreground">{post.timestamp}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-foreground">
                      {post.content}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                My Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-3 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {achievement.type === "competition" ? (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      ) : achievement.type === "award" ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{achievement.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{achievement.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Campus Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="mt-2 text-sm text-muted-foreground">Interactive Campus Map</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Clubs Joined</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Events Attended</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Hours</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between">
                  <span>Achievements</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}