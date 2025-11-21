"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location: string;
  maxTeams: number;
  currentTeams: number;
  status: "upcoming" | "registration-open" | "in-progress" | "completed";
  prize: string;
  requirements: string[];
}

interface Team {
  id: string;
  name: string;
  hackathonId: string;
  members: TeamMember[];
  registrationDate: Date;
  status: "registered" | "confirmed" | "withdrawn";
}

export function HackathonRegistrationView() {
  const [hackathons] = useState<Hackathon[]>([
    {
      id: "hack_001",
      title: "AI Innovation Challenge",
      description: "48-hour hackathon focused on artificial intelligence and machine learning solutions",
      startDate: new Date("2025-12-15"),
      endDate: new Date("2025-12-17"),
      registrationDeadline: new Date("2025-12-10"),
      location: "Engineering Building, Rooms 101-105",
      maxTeams: 30,
      currentTeams: 24,
      status: "registration-open",
      prize: "$10,000",
      requirements: ["Team of 3-5 members", "Project proposal", "Valid student ID"]
    },
    {
      id: "hack_002",
      title: "Sustainability Hackathon",
      description: "Develop solutions for environmental challenges and sustainable development",
      startDate: new Date("2025-11-25"),
      endDate: new Date("2025-11-27"),
      registrationDeadline: new Date("2025-11-20"),
      location: "Science Complex, Main Hall",
      maxTeams: 25,
      currentTeams: 25,
      status: "in-progress",
      prize: "$7,500",
      requirements: ["Team of 2-4 members", "Sustainability focus", "Valid student ID"]
    },
    {
      id: "hack_003",
      title: "Mobile App Development Contest",
      description: "Create innovative mobile applications for campus life and student services",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-22"),
      registrationDeadline: new Date("2025-12-15"),
      location: "Library Innovation Lab",
      maxTeams: 20,
      currentTeams: 8,
      status: "upcoming",
      prize: "$5,000",
      requirements: ["Team of 2-3 members", "Mobile app focus", "Valid student ID"]
    }
  ]);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team_001",
      name: "CodeCrafters",
      hackathonId: "hack_001",
      members: [
        { id: "mem_001", name: "Alex Johnson", email: "alex.j@iub.edu.bd", role: "Team Lead" },
        { id: "mem_002", name: "Sarah Williams", email: "sarah.w@iub.edu.bd", role: "Developer" },
        { id: "mem_003", name: "Mike Chen", email: "mike.c@iub.edu.bd", role: "Designer" }
      ],
      registrationDate: new Date("2025-11-15"),
      status: "registered"
    }
  ]);

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState<string>("");
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: [{ name: "", email: "", role: "" }] as TeamMember[]
  });

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

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Registered</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "withdrawn":
        return <Badge className="bg-red-100 text-red-800">Withdrawn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddMember = () => {
    setNewTeam({
      ...newTeam,
      members: [...newTeam.members, { name: "", email: "", role: "" }]
    });
  };

  const handleRemoveMember = (index: number) => {
    if (newTeam.members.length > 1) {
      const updatedMembers = [...newTeam.members];
      updatedMembers.splice(index, 1);
      setNewTeam({ ...newTeam, members: updatedMembers });
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...newTeam.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setNewTeam({ ...newTeam, members: updatedMembers });
  };

  const handleRegisterTeam = () => {
    if (newTeam.name && selectedHackathon && newTeam.members.every(m => m.name && m.email)) {
      const team: Team = {
        id: `team_${Date.now()}`,
        name: newTeam.name,
        hackathonId: selectedHackathon,
        members: newTeam.members,
        registrationDate: new Date(),
        status: "registered"
      };
      
      setTeams([...teams, team]);
      setNewTeam({ name: "", members: [{ name: "", email: "", role: "" }] });
      setShowRegistrationForm(false);
      setSelectedHackathon("");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hackathon Registration</h1>
          <p className="text-muted-foreground mt-1">Register your team for upcoming hackathons</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hackathons..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowRegistrationForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Register Team
          </Button>
        </div>
      </div>

      {showRegistrationForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Register New Team</CardTitle>
            <CardDescription>
              Register your team for a hackathon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Hackathon</Label>
              <select 
                value={selectedHackathon}
                onChange={(e) => setSelectedHackathon(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Choose a hackathon</option>
                {hackathons
                  .filter(h => h.status === "registration-open")
                  .map(hackathon => (
                    <option key={hackathon.id} value={hackathon.id}>
                      {hackathon.title} (Deadline: {hackathon.registrationDeadline.toLocaleDateString()})
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={newTeam.name}
                onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                placeholder="Enter your team name"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Team Members</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              
              {newTeam.members.map((member, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`memberName${index}`}>Name</Label>
                    <Input
                      id={`memberName${index}`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      placeholder="Member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`memberEmail${index}`}>Email</Label>
                    <Input
                      id={`memberEmail${index}`}
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      placeholder="Member email"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`memberRole${index}`}>Role</Label>
                    <Input
                      id={`memberRole${index}`}
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                      placeholder="Role (e.g., Developer)"
                    />
                  </div>
                  {newTeam.members.length > 1 && (
                    <div className="md:col-span-4 flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRegistrationForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleRegisterTeam}>
                Register Team
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Available Hackathons</h2>
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {hackathon.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {hackathon.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(hackathon.status)}
                  <Badge className="bg-purple-100 text-purple-800">
                    {hackathon.currentTeams}/{hackathon.maxTeams} Teams
                  </Badge>
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
                        {hackathon.startDate.toLocaleDateString()} - {hackathon.endDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Registration Deadline</div>
                      <div className="text-sm text-muted-foreground">
                        {hackathon.registrationDeadline.toLocaleDateString()}
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
                        {hackathon.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Prize</div>
                      <div className="text-sm text-muted-foreground">
                        {hackathon.prize}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium mb-1">Requirements</div>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {hackathon.status === "registration-open" ? (
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedHackathon(hackathon.id);
                          setShowRegistrationForm(true);
                        }}
                      >
                        Register Team
                      </Button>
                    ) : hackathon.status === "in-progress" ? (
                      <Button className="flex-1" disabled>
                        In Progress
                      </Button>
                    ) : (
                      <Button className="flex-1" disabled>
                        Registration Closed
                      </Button>
                    )}
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">My Registered Teams</h2>
        {teams.length > 0 ? (
          teams.map((team) => {
            const hackathon = hackathons.find(h => h.id === team.hackathonId);
            return (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {team.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Registered for {hackathon?.title || "Unknown Hackathon"}
                      </CardDescription>
                    </div>
                    {getTeamStatusBadge(team.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Team Members</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {team.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <div className="flex-1">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        Registered on {team.registrationDate.toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No registered teams</h3>
              <p className="text-muted-foreground mb-4 text-center">
                You haven't registered any teams for hackathons yet. Register a team to get started.
              </p>
              <Button onClick={() => setShowRegistrationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}