"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Save, 
  Upload, 
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  role: string;
  institution: string;
  email: string;
}

export default function ProjectProposalSubmissionPage() {
  const [proposal, setProposal] = useState({
    title: "",
    abstract: "",
    startDate: "",
    endDate: "",
    fundingSource: "",
    budget: "",
    duration: ""
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "Dr. Jane Smith",
      role: "Principal Investigator",
      institution: "University of Example",
      email: "jane.smith@university.edu"
    }
  ]);

  const [newCollaborator, setNewCollaborator] = useState({
    name: "",
    role: "",
    institution: "",
    email: ""
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.role || !newCollaborator.institution || !newCollaborator.email) {
      alert("Please fill in all collaborator fields");
      return;
    }

    const collaborator: Collaborator = {
      id: (collaborators.length + 1).toString(),
      name: newCollaborator.name,
      role: newCollaborator.role,
      institution: newCollaborator.institution,
      email: newCollaborator.email
    };

    setCollaborators([...collaborators, collaborator]);
    setNewCollaborator({
      name: "",
      role: "",
      institution: "",
      email: ""
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collab => collab.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmitProposal = () => {
    if (!proposal.title || !proposal.abstract || !proposal.startDate || !proposal.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting proposal:", { proposal, collaborators, files });
      setIsSubmitting(false);
      alert("Proposal submitted successfully!");
      // In a real app, you would redirect to the proposals list or details page
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Submit Research Proposal</h1>
          <p className="text-muted-foreground">Create and submit a new research project proposal</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Enter the basic details for your research proposal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter the full title of your research project"
              value={proposal.title}
              onChange={(e) => setProposal({...proposal, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              placeholder="Provide a brief summary of your research project (200-300 words)"
              rows={8}
              value={proposal.abstract}
              onChange={(e) => setProposal({...proposal, abstract: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={proposal.startDate}
                onChange={(e) => setProposal({...proposal, startDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={proposal.endDate}
                onChange={(e) => setProposal({...proposal, endDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 12 months"
                value={proposal.duration}
                onChange={(e) => setProposal({...proposal, duration: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundingSource">Funding Source</Label>
              <Input
                id="fundingSource"
                placeholder="e.g., National Science Foundation"
                value={proposal.fundingSource}
                onChange={(e) => setProposal({...proposal, fundingSource: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={proposal.budget}
                  onChange={(e) => setProposal({...proposal, budget: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Collaborators
          </CardTitle>
          <CardDescription>Add team members and collaborators for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collabName">Name *</Label>
              <Input
                id="collabName"
                placeholder="Full name"
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collabRole">Role *</Label>
              <Input
                id="collabRole"
                placeholder="e.g., Principal Investigator, Co-Investigator"
                value={newCollaborator.role}
                onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collabInstitution">Institution *</Label>
              <Input
                id="collabInstitution"
                placeholder="University or organization"
                value={newCollaborator.institution}
                onChange={(e) => setNewCollaborator({...newCollaborator, institution: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collabEmail">Email *</Label>
              <Input
                id="collabEmail"
                type="email"
                placeholder="Email address"
                value={newCollaborator.email}
                onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
              />
            </div>
          </div>
          
          <Button onClick={handleAddCollaborator} className="gap-2">
            <Plus size={16} />
            Add Collaborator
          </Button>
          
          {collaborators.length > 0 && (
            <div className="space-y-3 mt-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {collaborator.role} at {collaborator.institution}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {collaborator.email}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveCollaborator(collaborator.id)}
                  >
                    <Trash2 size={16} />
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
            <FileText size={20} />
            Supporting Documents
          </CardTitle>
          <CardDescription>Upload any additional documents to support your proposal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="files">Attach Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, XLSX (Max 10MB each)
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Attached Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmitProposal} disabled={isSubmitting} className="gap-2">
          <Save size={16} />
          {isSubmitting ? "Submitting..." : "Submit Proposal"}
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}