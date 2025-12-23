"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, FileText, Award, Calendar, Search, Filter, Plus, CheckCircle } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface ResearchProject {
  id: number;
  title: string;
  description: string;
  status: "draft" | "proposal" | "ongoing" | "completed" | "published";
  startDate: string;
  endDate?: string;
  collaborators: number;
  publications: number;
  funding: number;
}

export default function FacultyResearchPage() {
  const router = useRouter();
  const { state } = useFaculty();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch research data from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faculty/research/projects/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch research projects');
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch research projects');
        console.error('Error fetching research projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const getStatusVariant = (status: ResearchProject["status"]) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "proposal":
        return "outline";
      case "ongoing":
        return "default";
      case "completed":
        return "secondary";
      case "published":
        return "default";
      default:
        return "default";
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Research</h1>
            <p className="text-muted-foreground">Manage your research projects and publications</p>
          </div>
          <Button 
            className="gap-2"
            onClick={() => router.push("/faculty/research/projects/create")}
          >
            <Plus size={18} />
            Create Project
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {projects.filter(p => p.status === "ongoing" || p.status === "proposal").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {projects.reduce((sum, p) => sum + p.publications, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ${projects.reduce((sum, p) => sum + p.funding, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 items-center"
                onClick={() => router.push("/faculty/research/projects/create")}
              >
                <BookOpen size={24} />
                <span>New Project</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 items-center"
                onClick={() => router.push("/faculty/research/publications")}
              >
                <FileText size={24} />
                <span>Publications</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 items-center"
                onClick={() => router.push("/faculty/research/milestones")}
              >
                <CheckCircle size={24} />
                <span>Milestones</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 items-center"
                onClick={() => router.push("/faculty/research/grants")}
              >
                <Award size={24} />
                <span>Grants</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Research Projects</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects..." 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and manage your research projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <CardTitle className="mt-4">
                    {searchTerm ? "No projects found" : "No research projects"}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {searchTerm 
                      ? "Try adjusting your search terms" 
                      : "Get started by creating your first research project"}
                  </CardDescription>
                  <Button className="mt-4 gap-2" onClick={() => router.push("/faculty/research/projects/create")}>
                    <Plus size={16} />
                    Create Research Project
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg hover:bg-accent/5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen size={20} className="text-primary" />
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1 line-clamp-2">
                            {project.description}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              {project.startDate}
                              {project.endDate && ` - ${project.endDate}`}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              {project.collaborators} collaborators
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText size={16} />
                              {project.publications} publications
                            </div>
                            <div className="flex items-center gap-1">
                              <Award size={16} />
                              ${project.funding.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusVariant(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => router.push(`/faculty/research/projects/${project.id}`)}
                            >
                              <FileText size={16} />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => router.push(`/faculty/research/projects/${project.id}/edit`)}
                            >
                              <BookOpen size={16} />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FacultyProtectedRoute>
  );
}