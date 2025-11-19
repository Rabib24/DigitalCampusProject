"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, Filter, Calendar, Users, FileText, Award, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyResearchProjects } from "@/lib/faculty/api";

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

export function FacultyResearchView() {
  const router = useRouter();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeProjects: 0,
    publications: 0,
    totalFunding: 0
  });

  useEffect(() => {
    const fetchResearchProjects = async () => {
      try {
        setLoading(true);
        const data = await getFacultyResearchProjects();
        setProjects(data.projects || []);
        
        // Calculate stats
        const activeCount = data.projects?.filter((p: ResearchProject) => 
          p.status === "ongoing" || p.status === "proposal"
        ).length || 0;
        
        const publicationCount = data.projects?.reduce((sum: number, p: ResearchProject) => 
          sum + p.publications, 0
        ) || 0;
        
        const fundingTotal = data.projects?.reduce((sum: number, p: ResearchProject) => 
          sum + p.funding, 0
        ) || 0;
        
        setStats({
          activeProjects: activeCount,
          publications: publicationCount,
          totalFunding: fundingTotal
        });
      } catch (err) {
        setError("Failed to load research projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchProjects();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Research</h2>
          <p className="text-muted-foreground mt-1">Manage your research projects and publications</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.publications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${stats.totalFunding.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Research Projects</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-8" />
              </div>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
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
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">No research projects</CardTitle>
              <CardDescription className="mt-2">
                You haven&apos;t created any research projects yet. Start by creating your first project.
              </CardDescription>
              <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
                <Plus size={16} />
                Create Research Project
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
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
                          onClick={() => router.push(`/faculty/research/${project.id}`)}
                        >
                          <FileText size={16} />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => router.push(`/faculty/research/${project.id}/edit`)}
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
  );
}