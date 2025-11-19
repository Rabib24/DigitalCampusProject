"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  projectId: string;
  projectName: string;
}

export default function ResearchMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Literature Review Completion",
      description: "Complete comprehensive literature review of machine learning applications in healthcare",
      dueDate: "2023-07-15",
      status: "completed",
      projectId: "1",
      projectName: "Machine Learning in Healthcare"
    },
    {
      id: "2",
      title: "Data Collection and Preprocessing",
      description: "Collect and preprocess medical imaging data for model training",
      dueDate: "2023-09-30",
      status: "completed",
      projectId: "1",
      projectName: "Machine Learning in Healthcare"
    },
    {
      id: "3",
      title: "Model Development and Training",
      description: "Develop and train machine learning models for patient risk assessment",
      dueDate: "2024-01-15",
      status: "pending",
      projectId: "1",
      projectName: "Machine Learning in Healthcare"
    },
    {
      id: "4",
      title: "Results Analysis and Validation",
      description: "Analyze model results and validate against clinical outcomes",
      dueDate: "2024-03-30",
      status: "pending",
      projectId: "1",
      projectName: "Machine Learning in Healthcare"
    },
    {
      id: "5",
      title: "Ethics Approval",
      description: "Obtain institutional review board approval for human subjects research",
      dueDate: "2024-03-01",
      status: "pending",
      projectId: "2",
      projectName: "Data Science in Education"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    projectId: "1"
  });

  const handleCreateMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      setError("Please fill in all required fields");
      return;
    }

    const project = milestones.find(m => m.projectId === newMilestone.projectId);
    const projectName = project ? project.projectName : "Unknown Project";

    const milestone: Milestone = {
      id: (milestones.length + 1).toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      status: "pending",
      projectId: newMilestone.projectId,
      projectName
    };

    setMilestones([milestone, ...milestones]);
    setNewMilestone({
      title: "",
      description: "",
      dueDate: "",
      projectId: "1"
    });
    setIsCreating(false);
    setError(null);
  };

  const handleToggleMilestoneStatus = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, status: milestone.status === "pending" ? "completed" : "pending" } 
        : milestone
    ));
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      setMilestones(milestones.filter(milestone => milestone.id !== id));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "completed": return "default";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-yellow-500" />;
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  // Get unique projects for filtering
  const projects = Array.from(
    new Map(milestones.map(m => [m.projectId, m.projectName])).values()
  ).map((name, index) => ({
    id: milestones.find(m => m.projectName === name)?.projectId || index.toString(),
    name
  }));

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || milestone.status === filterStatus;
    const matchesProject = filterProject === "all" || milestone.projectId === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const pendingCount = milestones.filter(m => m.status === "pending").length;
  const completedCount = milestones.filter(m => m.status === "completed").length;

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Research Milestones</h1>
            <p className="text-muted-foreground">Track progress on your research project milestones</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus size={18} />
            New Milestone
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} className="text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{pendingCount}</div>
              <div className="text-muted-foreground">Milestones in progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{completedCount}</div>
              <div className="text-muted-foreground">Milestones finished</div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Milestone</CardTitle>
              <CardDescription>Create a new research project milestone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter milestone title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter milestone description"
                  rows={3}
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project</Label>
                  <select
                    id="projectId"
                    className="w-full p-2 border rounded"
                    value={newMilestone.projectId}
                    onChange={(e) => setNewMilestone({...newMilestone, projectId: e.target.value})}
                  >
                    <option value="1">Machine Learning in Healthcare</option>
                    <option value="2">Data Science in Education</option>
                    <option value="3">Web Security Framework</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateMilestone} className="gap-2" disabled={loading}>
                  {loading ? "Creating..." : <><Plus size={16} /> Add Milestone</>}
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search milestones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="p-2 border rounded"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  className="p-2 border rounded"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMilestones.length > 0 ? (
                filteredMilestones.map((milestone) => (
                  <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(milestone.status)}
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">
                            {milestone.projectName}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {milestone.description && (
                        <div className="mb-4">
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock size={16} />
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleToggleMilestoneStatus(milestone.id)}
                          className="gap-2"
                        >
                          {milestone.status === "pending" ? (
                            <>
                              <CheckCircle size={16} />
                              Mark Complete
                            </>
                          ) : (
                            <>
                              <Clock size={16} />
                              Mark Pending
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit size={16} />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No milestones found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterStatus !== "all" || filterProject !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Add your first milestone to get started"}
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                    <Plus size={16} />
                    New Milestone
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FacultyProtectedRoute>
  );
}