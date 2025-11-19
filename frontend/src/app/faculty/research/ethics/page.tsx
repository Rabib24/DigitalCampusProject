"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download
} from "lucide-react";

interface EthicsApplication {
  id: string;
  title: string;
  principalInvestigator: string;
  department: string;
  submissionDate: string;
  reviewDate?: string;
  status: "submitted" | "under-review" | "approved" | "rejected" | "revision-required";
  protocolNumber?: string;
  riskLevel: "minimal" | "moderate" | "high";
  projectDescription: string;
  consentProcess: string;
  dataManagement: string;
  documents: {
    id: string;
    name: string;
    type: string;
    size: string;
  }[];
}

export default function EthicsApprovalPage() {
  const [applications, setApplications] = useState<EthicsApplication[]>([
    {
      id: "1",
      title: "Machine Learning in Healthcare: Patient Data Analysis",
      principalInvestigator: "Dr. Jane Smith",
      department: "Computer Science",
      submissionDate: "2023-09-15",
      reviewDate: "2023-10-01",
      status: "approved",
      protocolNumber: "ETH-2023-001",
      riskLevel: "minimal",
      projectDescription: "This study involves analyzing anonymized patient data to develop predictive models for healthcare outcomes.",
      consentProcess: "All data will be anonymized and participants will provide informed consent through our secure portal.",
      dataManagement: "Data will be stored on encrypted servers with restricted access. All identifiers will be removed before analysis.",
      documents: [
        {
          id: "1",
          name: "Research Protocol.pdf",
          type: "application/pdf",
          size: "2.4 MB"
        },
        {
          id: "2",
          name: "Consent Form.docx",
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: "0.8 MB"
        }
      ]
    },
    {
      id: "2",
      title: "Human-Computer Interaction Study",
      principalInvestigator: "Dr. John Doe",
      department: "Computer Science",
      submissionDate: "2023-10-20",
      status: "under-review",
      riskLevel: "minimal",
      projectDescription: "Investigating user behavior and preferences in educational technology interfaces.",
      consentProcess: "Participants will be informed about the study purpose and provide digital consent before participation.",
      dataManagement: "All data will be anonymized and stored securely. No personally identifiable information will be collected.",
      documents: [
        {
          id: "3",
          name: "HCI_Study_Protocol.pdf",
          type: "application/pdf",
          size: "1.7 MB"
        }
      ]
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newApplication, setNewApplication] = useState({
    title: "",
    principalInvestigator: "",
    department: "",
    riskLevel: "minimal" as "minimal" | "moderate" | "high",
    projectDescription: "",
    consentProcess: "",
    dataManagement: ""
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleCreateApplication = () => {
    if (!newApplication.title || !newApplication.principalInvestigator || !newApplication.department || 
        !newApplication.projectDescription || !newApplication.consentProcess || !newApplication.dataManagement) {
      alert("Please fill in all required fields");
      return;
    }

    const application: EthicsApplication = {
      id: (applications.length + 1).toString(),
      title: newApplication.title,
      principalInvestigator: newApplication.principalInvestigator,
      department: newApplication.department,
      submissionDate: new Date().toISOString().split('T')[0],
      status: "submitted",
      riskLevel: newApplication.riskLevel,
      projectDescription: newApplication.projectDescription,
      consentProcess: newApplication.consentProcess,
      dataManagement: newApplication.dataManagement,
      documents: files.map((file, index) => ({
        id: (index + 1).toString(),
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }))
    };

    setApplications([application, ...applications]);
    setNewApplication({
      title: "",
      principalInvestigator: "",
      department: "",
      riskLevel: "minimal",
      projectDescription: "",
      consentProcess: "",
      dataManagement: ""
    });
    setFiles([]);
    setIsCreating(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted": return "secondary";
      case "under-review": return "default";
      case "approved": return "default";
      case "rejected": return "destructive";
      case "revision-required": return "outline";
      default: return "default";
    }
  };

  const getRiskLevelVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "minimal": return "default";
      case "moderate": return "secondary";
      case "high": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return <Clock size={16} className="text-blue-500" />;
      case "under-review": return <Clock size={16} className="text-purple-500" />;
      case "approved": return <CheckCircle size={16} className="text-green-500" />;
      case "rejected": return <AlertCircle size={16} className="text-red-500" />;
      case "revision-required": return <AlertCircle size={16} className="text-yellow-500" />;
      default: return <Clock size={16} />;
    }
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

  const handleDeleteApplication = (id: string) => {
    if (confirm("Are you sure you want to delete this ethics application?")) {
      setApplications(applications.filter(app => app.id !== id));
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const submittedCount = applications.filter(a => a.status === "submitted").length;
  const underReviewCount = applications.filter(a => a.status === "under-review").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ethics Approval</h1>
          <p className="text-muted-foreground">Manage research ethics applications and approvals</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          New Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{submittedCount}</div>
            <div className="text-muted-foreground">Applications submitted</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} className="text-purple-500" />
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{underReviewCount}</div>
            <div className="text-muted-foreground">Currently reviewing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedCount}</div>
            <div className="text-muted-foreground">Applications approved</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Ethics Application</CardTitle>
            <CardDescription>Create a new research ethics application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Research Title *</Label>
              <Input
                id="title"
                placeholder="Enter the full title of your research project"
                value={newApplication.title}
                onChange={(e) => setNewApplication({...newApplication, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pi">Principal Investigator *</Label>
                <Input
                  id="pi"
                  placeholder="Full name"
                  value={newApplication.principalInvestigator}
                  onChange={(e) => setNewApplication({...newApplication, principalInvestigator: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="Academic department"
                  value={newApplication.department}
                  onChange={(e) => setNewApplication({...newApplication, department: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <select
                  id="riskLevel"
                  className="w-full p-2 border rounded"
                  value={newApplication.riskLevel}
                  onChange={(e) => setNewApplication({...newApplication, riskLevel: e.target.value as any})}
                >
                  <option value="minimal">Minimal Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe your research project, including objectives, methods, and potential risks"
                rows={4}
                value={newApplication.projectDescription}
                onChange={(e) => setNewApplication({...newApplication, projectDescription: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="consentProcess">Consent Process *</Label>
              <Textarea
                id="consentProcess"
                placeholder="Explain how you will obtain informed consent from participants"
                rows={3}
                value={newApplication.consentProcess}
                onChange={(e) => setNewApplication({...newApplication, consentProcess: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataManagement">Data Management *</Label>
              <Textarea
                id="dataManagement"
                placeholder="Describe how you will collect, store, and protect participant data"
                rows={3}
                value={newApplication.dataManagement}
                onChange={(e) => setNewApplication({...newApplication, dataManagement: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="files">Supporting Documents</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileUpload}
              />
              <p className="text-sm text-muted-foreground">
                Upload your research protocol, consent forms, and other required documents
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
            
            <div className="flex gap-2">
              <Button onClick={handleCreateApplication} className="gap-2">
                <Plus size={16} />
                Submit Application
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
                placeholder="Search ethics applications..."
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
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="revision-required">Revision Required</option>
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
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <CardTitle className="text-lg">{app.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {app.principalInvestigator} • {app.department} • Submitted: {new Date(app.submissionDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusVariant(app.status)}>
                          {app.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant={getRiskLevelVariant(app.riskLevel)}>
                          {app.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-muted-foreground line-clamp-2">{app.projectDescription}</p>
                    </div>
                    
                    {app.protocolNumber && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Protocol Number:</span>
                        <span className="text-sm">{app.protocolNumber}</span>
                      </div>
                    )}
                    
                    {app.reviewDate && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Review Date:</span>
                        <span className="text-sm">{new Date(app.reviewDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {app.documents && app.documents.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h3 className="font-medium text-sm">Supporting Documents</h3>
                        <div className="flex flex-wrap gap-2">
                          {app.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                              <FileText size={14} />
                              <span>{doc.name}</span>
                              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                <Download size={14} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={16} />
                        View Details
                      </Button>
                      {app.status === "approved" && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download size={16} />
                          Download Approval
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteApplication(app.id)}
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
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No ethics applications found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Submit your first ethics application to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  New Application
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}