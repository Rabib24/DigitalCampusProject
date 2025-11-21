"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Calendar,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "registration-open" | "in-progress" | "completed";
  prize: string;
  isRegistered: boolean;
}

export function SkillCompetitionsView() {
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: "comp_001",
      title: "Annual Coding Hackathon",
      description: "48-hour hackathon focused on solving real-world problems using modern technologies",
      category: "Programming",
      startDate: new Date("2025-12-10"),
      endDate: new Date("2025-12-12"),
      registrationDeadline: new Date("2025-12-05"),
      participants: 85,
      maxParticipants: 100,
      status: "registration-open",
      prize: "$5,000",
      isRegistered: true
    },
    {
      id: "comp_002",
      title: "Data Science Challenge",
      description: "Compete in solving complex data analysis problems with real datasets",
      category: "Data Science",
      startDate: new Date("2025-11-25"),
      endDate: new Date("2025-11-26"),
      registrationDeadline: new Date("2025-11-20"),
      participants: 42,
      maxParticipants: 50,
      status: "in-progress",
      prize: "$3,000",
      isRegistered: true
    },
    {
      id: "comp_003",
      title: "Mobile App Design Contest",
      description: "Create innovative mobile applications that address campus needs",
      category: "Design",
      startDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-16"),
      registrationDeadline: new Date("2025-12-10"),
      participants: 28,
      maxParticipants: 30,
      status: "upcoming",
      prize: "$2,500",
      isRegistered: false
    },
    {
      id: "comp_004",
      title: "Cybersecurity Capture the Flag",
      description: "Test your cybersecurity skills in this competitive hacking challenge",
      category: "Security",
      startDate: new Date("2025-11-05"),
      endDate: new Date("2025-11-06"),
      registrationDeadline: new Date("2025-10-30"),
      participants: 35,
      maxParticipants: 40,
      status: "completed",
      prize: "$4,000",
      isRegistered: false
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "registration-open":
        return <Badge className="bg-green-100 text-green-800">Registration Open</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRegister = (id: string) => {
    setCompetitions(competitions.map(comp => 
      comp.id === id ? {...comp, isRegistered: true} : comp
    ));
  };

  const handleUnregister = (id: string) => {
    setCompetitions(competitions.map(comp => 
      comp.id === id ? {...comp, isRegistered: false} : comp
    ));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skill Competitions</h1>
          <p className="text-muted-foreground mt-1">Participate in competitions to showcase your skills</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search competitions..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Competition
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {competitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {competition.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {competition.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(competition.status)}
                  {competition.isRegistered && (
                    <Badge variant="secondary">Registered</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Dates</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.startDate.toLocaleDateString()} - {competition.endDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Registration Deadline</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.registrationDeadline.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Participants</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.participants}/{competition.maxParticipants}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Prize</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.prize}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-sm text-muted-foreground">
                        {competition.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {competition.status === "registration-open" && !competition.isRegistered ? (
                      <Button onClick={() => handleRegister(competition.id)} className="flex-1">
                        Register
                      </Button>
                    ) : competition.status === "registration-open" && competition.isRegistered ? (
                      <Button variant="outline" onClick={() => handleUnregister(competition.id)} className="flex-1">
                        Unregister
                      </Button>
                    ) : competition.status === "in-progress" && competition.isRegistered ? (
                      <Button className="flex-1">
                        Join Competition
                      </Button>
                    ) : competition.status === "completed" ? (
                      <Button variant="outline" className="flex-1">
                        View Results
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="flex-1">
                        Registration Closed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {competitions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No competitions found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no competitions matching your search criteria. Try adjusting your filters or create a new competition.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Competition
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}