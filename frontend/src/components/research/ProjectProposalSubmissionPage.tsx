"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Plus, 
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Shield
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function ProjectProposalSubmissionPage() {
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    budget: 0,
    collaborators: [] as { name: string; email: string; role: string }[],
    milestones: [] as { title: string; description: string; dueDate: Date }[],
    ethicsApproval: false,
    documents: [] as string[]
  });

  const [newCollaborator, setNewCollaborator] = useState({ name: "", email: "", role: "" });
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", dueDate: new Date() });

  const handleAddCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email && newCollaborator.role) {
      setProposal({
        ...proposal,
        collaborators: [...proposal.collaborators, newCollaborator]
      });
      setNewCollaborator({ name: "", email: "", role: "" });
    }
  };

  const handleRemoveCollaborator = (index: number) => {
    setProposal({
      ...proposal,
      collaborators: proposal.collaborators.filter((_, i) => i !== index)
    });
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.description) {
      setProposal({
        ...proposal,
        milestones: [...proposal.milestones, newMilestone]
      });
      setNewMilestone({ title: "", description: "", dueDate: new Date() });
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setProposal({
      ...proposal,
      milestones: proposal.milestones.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the backend
    console.log("Proposal data to submit:", proposal);
    alert("Project proposal submitted successfully!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submit Research Proposal</h1>
        <p className="text-muted-foreground mt-1">Create and submit a new research project proposal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Enter the core details of your research project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={proposal.title}
                    onChange={(e) => setProposal({...proposal, title: e.target.value})}
                    placeholder="Enter a concise and descriptive title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={proposal.description}
                    onChange={(e) => setProposal({...proposal, description: e.target.value})}
                    placeholder="Provide a detailed description of your research project, including objectives, methodology, and expected outcomes"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
                <CardDescription>
                  Set the project start and end dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={proposal.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setProposal({...proposal, startDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={proposal.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setProposal({...proposal, endDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborators
                </CardTitle>
                <CardDescription>
                  Add team members working on this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Name"
                    value={newCollaborator.name}
                    onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Role"
                      value={newCollaborator.role}
                      onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                    />
                    <Button type="button" onClick={handleAddCollaborator} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {proposal.collaborators.length > 0 && (
                  <div className="space-y-2">
                    {proposal.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{collaborator.name}</div>
                          <div className="text-sm text-muted-foreground">{collaborator.email} • {collaborator.role}</div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveCollaborator(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Milestones
                </CardTitle>
                <CardDescription>
                  Define key milestones for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Milestone Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Milestone title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newMilestone.dueDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewMilestone({...newMilestone, dueDate: new Date(e.target.value)})}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Description"
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                      />
                      <Button type="button" onClick={handleAddMilestone} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {proposal.milestones.length > 0 && (
                  <div className="space-y-2">
                    {proposal.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {milestone.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveMilestone(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Information
                </CardTitle>
                <CardDescription>
                  Specify the funding requirements for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Requested Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={proposal.budget}
                    onChange={(e) => setProposal({...proposal, budget: parseInt(e.target.value) || 0})}
                    placeholder="Enter total budget amount"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Budget Breakdown</Label>
                  <Textarea
                    placeholder="Provide a brief breakdown of how the budget will be used (e.g., equipment, personnel, travel, etc.)"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Ethics and Compliance
                </CardTitle>
                <CardDescription>
                  Review and acknowledge ethical requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ethics Approval Required</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ethicsApproval"
                      checked={proposal.ethicsApproval}
                      onChange={(e) => setProposal({...proposal, ethicsApproval: e.target.checked})}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="ethicsApproval" className="font-normal">
                      This project requires ethics approval
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Drag and drop files here or click to upload
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Review your proposal before submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{proposal.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {proposal.startDate.toLocaleDateString()} - {proposal.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">${proposal.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collaborators:</span>
                    <span className="font-medium">{proposal.collaborators.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milestones:</span>
                    <span className="font-medium">{proposal.milestones.length}</span>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  <Save className="h-4 w-4 mr-2" />
                  Submit Proposal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}