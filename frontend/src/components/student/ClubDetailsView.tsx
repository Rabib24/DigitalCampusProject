"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
}

interface ClubMember {
  id: string;
  name: string;
  role: string;
  joinDate: Date;
}

export function ClubDetailsView() {
  const [club] = useState({
    id: "club_001",
    name: "Computer Science Club",
    category: "Academic",
    description: "For students passionate about programming, AI, and technology innovation. We host coding workshops, hackathons, and guest lectures from industry professionals.",
    members: 128,
    events: 5,
    isMember: true,
    nextEvent: {
      title: "Hackathon 2025",
      date: new Date("2025-12-10")
    }
  });

  const [events] = useState<ClubEvent[]>([
    {
      id: "event_001",
      title: "Web Development Workshop",
      description: "Learn modern web development techniques with React and Node.js",
      date: new Date("2025-11-25"),
      time: "14:00",
      location: "Engineering Building, Room 205",
      attendees: 45,
      maxAttendees: 60
    },
    {
      id: "event_002",
      title: "AI Guest Lecture",
      description: "Special lecture by Dr. Smith on the future of artificial intelligence",
      date: new Date("2025-12-02"),
      time: "16:00",
      location: "Main Auditorium",
      attendees: 85,
      maxAttendees: 150
    },
    {
      id: "event_003",
      title: "Hackathon 2025",
      description: "48-hour hackathon focused on solving real-world problems",
      date: new Date("2025-12-10"),
      time: "09:00",
      location: "Innovation Lab Complex",
      attendees: 0,
      maxAttendees: 100
    }
  ]);

  const [members] = useState<ClubMember[]>([
    {
      id: "member_001",
      name: "Alex Johnson",
      role: "President",
      joinDate: new Date("2024-09-01")
    },
    {
      id: "member_002",
      name: "Sarah Williams",
      role: "Vice President",
      joinDate: new Date("2024-09-01")
    },
    {
      id: "member_003",
      name: "Michael Chen",
      role: "Treasurer",
      joinDate: new Date("2024-09-01")
    },
    {
      id: "member_004",
      name: "Emma Davis",
      role: "Secretary",
      joinDate: new Date("2024-09-01")
    }
  ]);

  const [announcements] = useState([
    {
      id: "ann_001",
      title: "New Members Welcome!",
      content: "We're excited to welcome 15 new members to our club this semester. Join us for our weekly meetings every Thursday at 5 PM.",
      author: "Alex Johnson",
      date: new Date("2025-11-15")
    },
    {
      id: "ann_002",
      title: "Hackathon Registration Open",
      content: "Registration for our annual hackathon is now open. Sign up by December 5th to secure your spot!",
      author: "Sarah Williams",
      date: new Date("2025-11-10")
    }
  ]);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Academic":
        return <Badge className="bg-blue-100 text-blue-800">Academic</Badge>;
      case "Arts":
        return <Badge className="bg-purple-100 text-purple-800">Arts</Badge>;
      case "Sports":
        return <Badge className="bg-green-100 text-green-800">Sports</Badge>;
      case "Community Service":
        return <Badge className="bg-yellow-100 text-yellow-800">Community Service</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{club.name}</h1>
          <p className="text-muted-foreground mt-1">Club details and activities</p>
        </div>
        <div className="flex gap-2">
          {club.isMember ? (
            <>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Club
              </Button>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Members
              </Button>
            </>
          ) : (
            <Button>Join Club</Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              About {club.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getCategoryBadge(club.category)}
                <Badge variant="secondary">{club.members} members</Badge>
                <Badge variant="secondary">{club.events} events</Badge>
              </div>
              
              <p className="text-muted-foreground">
                {club.description}
              </p>
              
              {club.nextEvent && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-2">Next Event</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{club.nextEvent.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {club.nextEvent.date.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Club Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-muted-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Events organized by {club.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge variant="secondary">
                      {event.attendees}/{event.maxAttendees}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm">Register</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>
              Latest updates from club leadership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg border">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      by {announcement.author} on {announcement.date.toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}