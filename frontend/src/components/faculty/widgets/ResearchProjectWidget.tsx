"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Users, FileText } from "lucide-react";

interface ResearchProject {
  id: number;
  title: string;
  status: "draft" | "proposal" | "ongoing" | "completed" | "published";
  collaborators: number;
  publications: number;
}

export function ResearchProjectWidget() {
  // This would normally come from an API call
  const projects: ResearchProject[] = [
    { id: 1, title: "Machine Learning Applications", status: "ongoing", collaborators: 3, publications: 1 },
    { id: 2, title: "Data Science in Healthcare", status: "proposal", collaborators: 2, publications: 0 },
    { id: 3, title: "Web Security Framework", status: "completed", collaborators: 4, publications: 2 },
  ];

  const getStatusText = (status: ResearchProject["status"]) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "proposal":
        return "Proposal";
      case "ongoing":
        return "Ongoing";
      case "completed":
        return "Completed";
      case "published":
        return "Published";
      default:
        return "Unknown";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Research Projects
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus size={16} />
            New
          </Button>
        </div>
        <CardDescription>Current research activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5">
              <div>
                <div className="font-medium line-clamp-1">{project.title}</div>
                <div className="text-sm text-muted-foreground">{getStatusText(project.status)}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <Users size={16} />
                  {project.collaborators}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <FileText size={16} />
                  {project.publications}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}