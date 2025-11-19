"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";
import { 
  getFacultyGrantApplications, 
  deleteFacultyGrantApplication 
} from "@/lib/faculty/api";

interface Grant {
  id: string;
  title: string;
  description: string;
  funding_agency: string;
  amount: number;
  submission_date: string;
  deadline: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  documents: {
    id: string;
    name: string;
    uploaded_at: string;
  }[];
}

export default function GrantManagementPage() {
  const router = useRouter();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch grants on page load
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const response = await getFacultyGrantApplications();
        
        if (response.grants) {
          setGrants(response.grants);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch grant applications");
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  const handleDeleteGrant = async (id: string) => {
    if (confirm("Are you sure you want to delete this grant application?")) {
      try {
        const response = await deleteFacultyGrantApplication(id);
        
        if (response.success) {
          setGrants(grants.filter(grant => grant.id !== id));
        } else {
          setError(response.message || "Failed to delete grant application");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete grant application");
      }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Clock size={16} className="text-yellow-500" />;
      case "submitted": return <Clock size={16} className="text-blue-500" />;
      case "under-review": return <Clock size={16} className="text-purple-500" />;
      case "approved": return <CheckCircle size={16} className="text-green-500" />;
      case "rejected": return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} />;
    }
  };

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         grant.funding_agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || grant.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const draftCount = grants.filter(g => g.status === "draft").length;
  const submittedCount = grants.filter(g => g.status === "submitted").length;
  const approvedCount = grants.filter(g => g.status === "approved").length;

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
            <h1 className="text-3xl font-bold">Grant Management</h1>
            <p className="text-muted-foreground">Manage your research grant applications</p>
          </div>
          <Button 
            onClick={() => router.push("/faculty/research/grants/apply")} 
            className="gap-2"
          >
            <Plus size={18} />
            New Grant Application
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
                <Clock size={20} className="text-yellow-500" />
                Drafts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{draftCount}</div>
              <div className="text-muted-foreground">Applications in progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{submittedCount}</div>
              <div className="text-muted-foreground">Under review</div>
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
              <div className="text-muted-foreground">Funded grants</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search grants..."
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
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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
              {filteredGrants.length > 0 ? (
                filteredGrants.map((grant) => (
                  <Card key={grant.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(grant.status)}
                            <CardTitle className="text-lg">{grant.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">
                            {grant.funding_agency} • ${grant.amount.toLocaleString()} • Due: {new Date(grant.deadline).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(grant.status)}>
                          {grant.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-muted-foreground line-clamp-2">{grant.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock size={16} />
                        <span>Submitted: {new Date(grant.submission_date).toLocaleDateString()}</span>
                      </div>
                      
                      {grant.documents && grant.documents.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <FileText size={16} />
                            <span>Documents ({grant.documents.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {grant.documents.map((doc) => (
                              <Badge key={doc.id} variant="secondary" className="gap-1">
                                <FileText size={14} />
                                {doc.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/research/grants/apply?id=${grant.id}`)}
                        >
                          <Edit size={16} />
                          {grant.status === "draft" ? "Edit" : "View"}
                        </Button>
                        {grant.status === "draft" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2"
                            onClick={() => router.push(`/faculty/research/grants/apply?id=${grant.id}&step=documents`)}
                          >
                            <Upload size={16} />
                            Add Documents
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/research/grants/apply?id=${grant.id}&step=tracking`)}
                        >
                          <Clock size={16} />
                          Track Status
                        </Button>
                        {grant.status === "draft" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteGrant(grant.id)}
                            className="gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No grant applications found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Create your first grant application to get started"}
                  </p>
                  <Button 
                    onClick={() => router.push("/faculty/research/grants/apply")} 
                    className="mt-4 gap-2"
                  >
                    <Plus size={16} />
                    New Grant Application
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