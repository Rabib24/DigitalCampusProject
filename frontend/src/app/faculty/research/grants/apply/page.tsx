"use client";

import { useState, useEffect } from "react";
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
  Users,
  Target,
  BookOpen
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";
import { 
  getFacultyGrantApplications, 
  createFacultyGrantApplication, 
  updateFacultyGrantApplication,
  uploadGrantDocument
} from "@/lib/faculty/api";

interface GrantApplication {
  id: string;
  grantName: string;
  organization: string;
  deadline: string;
  awardAmount: number;
  duration: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export default function GrantApplicationPage() {
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "1",
      category: "Personnel",
      description: "Faculty salary and benefits",
      amount: 120000
    },
    {
      id: "2",
      category: "Equipment",
      description: "Laboratory equipment and software",
      amount: 50000
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    grantName: "",
    organization: "",
    deadline: "",
    awardAmount: "",
    duration: ""
  });

  const [newBudgetItem, setNewBudgetItem] = useState({
    category: "",
    description: "",
    amount: ""
  });

  const [isCreating, setIsCreating] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch grants on page load
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const response = await getFacultyGrantApplications();
        
        if (response.grants) {
          // Convert backend format to frontend format
          const convertedApplications = response.grants.map((grant: any) => ({
            id: grant.id.toString(),
            grantName: grant.title,
            organization: grant.funding_agency,
            deadline: grant.deadline,
            awardAmount: grant.amount,
            duration: "24 months", // This would come from the backend in a real implementation
            status: grant.status
          }));
          setApplications(convertedApplications);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch grant applications");
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  const handleCreateApplication = async () => {
    if (!newApplication.grantName || !newApplication.organization || !newApplication.deadline) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const grantData = {
        title: newApplication.grantName,
        funding_agency: newApplication.organization,
        deadline: newApplication.deadline,
        amount: parseFloat(newApplication.awardAmount) || 0,
        duration: newApplication.duration,
        status: "draft",
        description: "" // This would be added in a real implementation
      };

      const response = await createFacultyGrantApplication(grantData);
      
      if (response.success) {
        const newApp: GrantApplication = {
          id: response.grant.id.toString(),
          grantName: response.grant.title,
          organization: response.grant.funding_agency,
          deadline: response.grant.deadline,
          awardAmount: response.grant.amount,
          duration: newApplication.duration,
          status: response.grant.status
        };

        setApplications([newApp, ...applications]);
        setNewApplication({
          grantName: "",
          organization: "",
          deadline: "",
          awardAmount: "",
          duration: ""
        });
        setIsCreating(false);
        setError(null);
      } else {
        setError(response.message || "Failed to create grant application");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create grant application");
    }
  };

  const handleAddBudgetItem = () => {
    if (!newBudgetItem.category || !newBudgetItem.description || !newBudgetItem.amount) {
      setError("Please fill in all budget item fields");
      return;
    }

    const budgetItem: BudgetItem = {
      id: (budgetItems.length + 1).toString(),
      category: newBudgetItem.category,
      description: newBudgetItem.description,
      amount: parseFloat(newBudgetItem.amount) || 0
    };

    setBudgetItems([...budgetItems, budgetItem]);
    setNewBudgetItem({
      category: "",
      description: "",
      amount: ""
    });
    setError(null);
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
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

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, we would submit the grant application
      // For now, we'll just show a success message
      console.log("Submitting grant application:", { applications, budgetItems, files });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Grant application submitted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit grant application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "submitted": return "default";
      case "under-review": return "outline";
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "default";
    }
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Grant Applications</h1>
            <p className="text-muted-foreground">Manage and submit grant applications for your research</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus size={18} />
            New Application
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Active Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {applications.filter(app => app.status !== "approved" && app.status !== "rejected").length}
              </div>
              <div className="text-muted-foreground">Currently in progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={20} />
                Total Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${applications
                  .filter(app => app.status === "approved")
                  .reduce((sum, app) => sum + app.awardAmount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-muted-foreground">Approved grants</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {applications.length > 0 
                  ? Math.round(
                      (applications.filter(app => app.status === "approved").length / 
                      applications.filter(app => app.status === "rejected" || app.status === "approved").length) * 100
                    ) || 0
                  : 0}%
              </div>
              <div className="text-muted-foreground">Approved applications</div>
            </CardContent>
          </Card>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Grant Application</CardTitle>
              <CardDescription>Start a new grant application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grantName">Grant Name *</Label>
                  <Input
                    id="grantName"
                    placeholder="e.g., NSF Research Grant"
                    value={newApplication.grantName}
                    onChange={(e) => setNewApplication({...newApplication, grantName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    placeholder="e.g., National Science Foundation"
                    value={newApplication.organization}
                    onChange={(e) => setNewApplication({...newApplication, organization: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newApplication.deadline}
                    onChange={(e) => setNewApplication({...newApplication, deadline: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="awardAmount">Award Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="awardAmount"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={newApplication.awardAmount}
                      onChange={(e) => setNewApplication({...newApplication, awardAmount: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="duration">Project Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 24 months"
                    value={newApplication.duration}
                    onChange={(e) => setNewApplication({...newApplication, duration: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateApplication} className="gap-2">
                  <Plus size={16} />
                  Create Application
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
            <CardTitle>Current Applications</CardTitle>
            <CardDescription>View and manage your grant applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{application.grantName}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {application.organization} • Due: {new Date(application.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-muted-foreground" />
                            <span>${application.awardAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-muted-foreground" />
                            <span>{application.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(application.status)}>
                          {application.status.replace('-', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No grant applications</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first grant application to get started
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  New Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Budget Planning
            </CardTitle>
            <CardDescription>Plan and manage your project budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Personnel, Equipment, Travel"
                  value={newBudgetItem.category}
                  onChange={(e) => setNewBudgetItem({...newBudgetItem, category: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Item description"
                  value={newBudgetItem.description}
                  onChange={(e) => setNewBudgetItem({...newBudgetItem, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={newBudgetItem.amount}
                    onChange={(e) => setNewBudgetItem({...newBudgetItem, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-end md:col-span-3">
                <Button onClick={handleAddBudgetItem} className="gap-2">
                  <Plus size={16} />
                  Add Item
                </Button>
              </div>
            </div>
            
            {budgetItems.length > 0 && (
              <div className="border rounded-lg p-4 mt-4">
                <h3 className="font-medium mb-3">Budget Items</h3>
                <div className="space-y-3">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-medium">${item.amount.toLocaleString()}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveBudgetItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t font-medium">
                    <div>Total Budget</div>
                    <div>${totalBudget.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Document Upload
            </CardTitle>
            <CardDescription>Upload required documents for your grant application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload Documents</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          multiple 
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Uploaded Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
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
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button onClick={handleSubmitApplication} disabled={isSubmitting} className="gap-2">
            <Save size={16} />
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
          <Button variant="outline">Save Draft</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </FacultyProtectedRoute>
  );
}