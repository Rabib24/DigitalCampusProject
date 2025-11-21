"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  status: "draft" | "published" | "cancelled" | "completed";
}

export function EventManagementView() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "evt_001",
      title: "Tech Innovation Workshop",
      description: "Learn about the latest trends in technology and innovation",
      date: new Date("2025-12-10"),
      time: "14:00",
      location: "Main Auditorium",
      organizer: "Computer Science Club",
      attendees: 45,
      maxAttendees: 100,
      category: "Workshop",
      status: "published"
    },
    {
      id: "evt_002",
      title: "Annual Sports Day",
      description: "Compete in various sports and games with fellow students",
      date: new Date("2025-12-15"),
      time: "09:00",
      location: "Sports Complex",
      organizer: "Sports Committee",
      attendees: 120,
      maxAttendees: 200,
      category: "Sports",
      status: "published"
    },
    {
      id: "evt_003",
      title: "Career Fair 2025",
      description: "Meet potential employers and explore career opportunities",
      date: new Date("2025-12-20"),
      time: "10:00",
      location: "Exhibition Hall",
      organizer: "Career Services",
      attendees: 0,
      maxAttendees: 500,
      category: "Career",
      status: "draft"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Workshop":
        return <Badge className="bg-purple-100 text-purple-800">{category}</Badge>;
      case "Sports":
        return <Badge className="bg-green-100 text-green-800">{category}</Badge>;
      case "Career":
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage campus events</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {event.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(event.status)}
                  {getCategoryBadge(event.category)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Organizer</div>
                      <div className="text-sm text-muted-foreground">
                        {event.organizer}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Attendees</div>
                      <div className="text-sm text-muted-foreground">
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no events matching your search criteria. Create a new event to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  status: "draft" | "published" | "cancelled" | "completed";
}

export function EventManagementView() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "evt_001",
      title: "Tech Innovation Workshop",
      description: "Learn about the latest trends in technology and innovation",
      date: new Date("2025-12-10"),
      time: "14:00",
      location: "Main Auditorium",
      organizer: "Computer Science Club",
      attendees: 45,
      maxAttendees: 100,
      category: "Workshop",
      status: "published"
    },
    {
      id: "evt_002",
      title: "Annual Sports Day",
      description: "Compete in various sports and games with fellow students",
      date: new Date("2025-12-15"),
      time: "09:00",
      location: "Sports Complex",
      organizer: "Sports Committee",
      attendees: 120,
      maxAttendees: 200,
      category: "Sports",
      status: "published"
    },
    {
      id: "evt_003",
      title: "Career Fair 2025",
      description: "Meet potential employers and explore career opportunities",
      date: new Date("2025-12-20"),
      time: "10:00",
      location: "Exhibition Hall",
      organizer: "Career Services",
      attendees: 0,
      maxAttendees: 500,
      category: "Career",
      status: "draft"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Workshop":
        return <Badge className="bg-purple-100 text-purple-800">{category}</Badge>;
      case "Sports":
        return <Badge className="bg-green-100 text-green-800">{category}</Badge>;
      case "Career":
        return <Badge className="bg-blue-100 text-blue-800">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage campus events</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {event.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(event.status)}
                  {getCategoryBadge(event.category)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Organizer</div>
                      <div className="text-sm text-muted-foreground">
                        {event.organizer}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Attendees</div>
                      <div className="text-sm text-muted-foreground">
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no events matching your search criteria. Create a new event to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}