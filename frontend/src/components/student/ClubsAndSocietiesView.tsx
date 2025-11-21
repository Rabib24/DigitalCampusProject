"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Club {
  id: string;
  name: string;
  category: string;
  members: number;
  description: string;
  isMember: boolean;
  events: number;
  nextEvent?: {
    title: string;
    date: Date;
  };
}

export function ClubsAndSocietiesView() {
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: "1",
      name: "Computer Science Club",
      category: "Academic",
      members: 128,
      description: "For students passionate about programming, AI, and technology innovation",
      isMember: true,
      events: 5,
      nextEvent: {
        title: "Hackathon 2025",
        date: new Date("2025-12-10")
      }
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
    },
    {
      id: "5",
      name: "Environmental Action Group",
      category: "Community Service",
      members: 67,
      description: "Promoting sustainability and environmental awareness on campus",
      isMember: true,
      events: 3,
      nextEvent: {
        title: "Campus Cleanup Day",
        date: new Date("2025-11-25")
      }
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
          <h1 className="text-3xl font-bold text-foreground">Clubs & Societies</h1>
          <p className="text-muted-foreground mt-1">Join clubs that match your interests</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Club
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {club.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {club.description}
                  </CardDescription>
                </div>
                {club.isMember && (
                  <Badge variant="secondary">Member</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(club.category)}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{club.members} members</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{club.events} events</span>
                  </div>
                </div>
                
                {club.nextEvent && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">Next Event</div>
                        <div className="text-muted-foreground">{club.nextEvent.title}</div>
                        <div className="text-muted-foreground">
                          {club.nextEvent.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  {club.isMember ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Club
                      </Button>
                      <Button variant="outline" size="sm">
                        Leave
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="flex-1">
                      Join Club
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clubs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No clubs found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no clubs matching your search criteria. Try adjusting your filters or create a new club.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Club
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}