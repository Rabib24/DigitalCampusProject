"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  FileText,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  collaborators: number;
  status: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  ethicsApproval: boolean;
  milestonesCompleted: number;
  totalMilestones: number;
}

export function ResearchProjectListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ResearchProject[]>([
    {
      id: "proj_001",
      title: "Machine Learning Applications in Healthcare",
      description: "Exploring the use of deep learning models for early disease detection",
      ownerId: "researcher_123",
      ownerName: "Dr. Sarah Johnson",
      collaborators: 5,
      status: "in_progress",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-08-31"),
      budget: 50000,
      ethicsApproval: true,
      milestonesCompleted: 3,
      totalMilestones: 8
    },
    {
      id: "proj_002",
      title: "Sustainable Energy Solutions for Urban Areas",
      description: "Developing innovative solar panel technologies for city infrastructure",
      ownerId: "researcher_456",
      ownerName: "Prof. Michael Chen",
      collaborators: 3,
      status: "approved",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2027-10-31"),
      budget: 75000,
      ethicsApproval: true,
      milestonesCompleted: 0,
      totalMilestones: 10
    },
    {
      id: "proj_003",
      title: "Quantum Computing Algorithms for Optimization",
      description: "Designing new quantum algorithms for complex optimization problems",
      ownerId: "researcher_789",
      ownerName: "Dr. Emily Rodriguez",
      collaborators: 4,
      status: "submitted",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      budget: 100000,
      ethicsApproval: false,
      milestonesCompleted: 0,
      totalMilestones: 12
    },
    {
      id: "proj_004",
      title: "Social Media Impact on Mental Health",
      description: "Analyzing the correlation between social media usage and mental health outcomes",
      ownerId: "researcher_101",
      ownerName: "Dr. James Wilson",
      collaborators: 2,
      status: "completed",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      budget: 25000,
      ethicsApproval: true,
      milestonesCompleted: 10,
      totalMilestones: 10
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800">Submitted</Badge>;
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Research Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track research projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Project List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage all research projects in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">PI: {project.ownerName}</div>
                            <div className="text-xs text-muted-foreground">{project.collaborators} collaborators</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              {project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Duration</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">${project.budget.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Budget</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">{project.milestonesCompleted}</span> of{" "}
                            <span className="font-medium">{project.totalMilestones}</span> milestones completed
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(project.milestonesCompleted / project.totalMilestones) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-muted-foreground">Pending Approval</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}