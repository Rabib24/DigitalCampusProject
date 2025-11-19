"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FileText, 
  Edit,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus
} from "lucide-react";

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "proposal" | "in-progress" | "completed" | "published";
  collaborators: string[];
  fundingSource?: string;
  budget?: number;
  publications: {
    id: string;
    title: string;
    journal: string;
    date: string;
    status: "draft" | "submitted" | "accepted" | "published";
  }[];
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    status: "pending" | "completed";
  }[];
}

export default function ResearchProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<ResearchProject>({
    id: params.id as string,
    title: "Machine Learning Approaches for Predictive Analytics in Healthcare",
    description: "This research project explores the application of machine learning techniques to predict patient outcomes and improve healthcare delivery. The study focuses on developing models that can analyze electronic health records to identify at-risk patients and recommend interventions.",
    startDate: "2023-06-01",
    endDate: "2024-06-01",
    status: "in-progress",
    collaborators: [
      "Dr. Jane Smith (Principal Investigator)",
      "Dr. John Doe (Co-Investigator)",
      "Prof. Alice Johnson (Collaborator)"
    ],
    fundingSource: "National Science Foundation",
    budget: 150000,
    publications: [
      {
        id: "1",
        title: "Predictive Models for Patient Risk Assessment",
        journal: "Journal of Medical Informatics",
        date: "2023-09-15",
        status: "submitted"
      },
      {
        id: "2",
        title: "Machine Learning in Healthcare: A Comprehensive Review",
        journal: "AI in Medicine",
        date: "2023-11-20",
        status: "draft"
      }
    ],
    milestones: [
      {
        id: "1",
        title: "Literature Review Completion",
        dueDate: "2023-07-15",
        status: "completed"
      },
      {
        id: "2",
        title: "Data Collection and Preprocessing",
        dueDate: "2023-09-30",
        status: "completed"
      },
      {
        id: "3",
        title: "Model Development and Training",
        dueDate: "2024-01-15",
        status: "pending"
      },
      {
        id: "4",
        title: "Results Analysis and Validation",
        dueDate: "2024-03-30",
        status: "pending"
      }
    ]
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "proposal": return "secondary";
      case "in-progress": return "default";
      case "completed": return "outline";
      case "published": return "default";
      default: return "default";
    }
  };

  const getPublicationStatusVariant = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "submitted": return "default";
      case "accepted": return "outline";
      case "published": return "default";
      default: return "default";
    }
  };

  const getMilestoneStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "completed": return "default";
      default: return "default";
    }
  };

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-yellow-500" />;
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  const completedMilestones = project.milestones.filter(m => m.status === "completed").length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Research Project Details</h1>
          <p className="text-muted-foreground">{project.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="gap-2" onClick={() => router.push(`/faculty/research/projects/${params.id}/edit`)}>
            <Edit size={16} />
            Edit Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(project.status)}>
              {project.status.replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {new Date(project.startDate).toLocaleDateString()} - 
              {project.endDate ? ` ${new Date(project.endDate).toLocaleDateString()}` : " Ongoing"}
            </div>
            <div className="text-muted-foreground">
              {Math.floor((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days elapsed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project.collaborators.length}</div>
            <div className="text-muted-foreground">Team members</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
            </div>
            <div className="text-muted-foreground">
              {completedMilestones} of {totalMilestones} milestones
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Project Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{project.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding & Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Funding Source</span>
                <span className="font-medium">{project.fundingSource || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-medium">
                  {project.budget ? `$${project.budget.toLocaleString()}` : "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium">$75,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  {project.budget ? `$${(project.budget - 75000).toLocaleString()}` : "N/A"}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Budget Utilization</span>
                <span>50%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="text-primary" size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{collaborator}</div>
                    <div className="text-sm text-muted-foreground">Research Team</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Project Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="border-l-2 border-muted pl-4 py-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getMilestoneStatusIcon(milestone.status)}
                        <span className="font-medium">{milestone.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={getMilestoneStatusVariant(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => router.push("/faculty/research/milestones")}
              >
                <Plus size={16} />
                Manage All Milestones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Publications
          </CardTitle>
          <CardDescription>Research papers and publications related to this project</CardDescription>
        </CardHeader>
        <CardContent>
          {project.publications.length > 0 ? (
            <div className="space-y-4">
              {project.publications.map((pub) => (
                <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{pub.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {pub.journal} • {new Date(pub.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={getPublicationStatusVariant(pub.status)}>
                      {pub.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Eye size={16} />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No publications yet</h3>
              <p className="text-sm text-muted-foreground">
                Publications related to this research project will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}