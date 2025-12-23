"use client";

import { useState, useEffect } from "react";
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
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";
import { addPublicationToResearchProject } from "@/lib/faculty/api";

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  doi?: string;
  status: "draft" | "submitted" | "under-review" | "accepted" | "published" | "rejected";
  project?: string;
  abstract?: string;
  keywords: string[];
}

export default function PublicationManagementPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPublication, setNewPublication] = useState({
    title: "",
    authors: "",
    journal: "",
    date: "",
    doi: "",
    project: "",
    abstract: "",
    keywords: ""
  });

  // Fetch publications from API
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faculty/publications/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        
        const data = await response.json();
        // Map backend data to frontend format
        const mappedPublications = (data.publications || []).map((pub: any) => ({
          id: pub.id,
          title: pub.title,
          authors: pub.authors || [],
          journal: pub.journal || '',
          date: pub.publication_date,
          doi: pub.doi,
          status: pub.status || 'published',
          project: pub.research_project_id,
          abstract: pub.abstract,
          keywords: pub.keywords || []
        }));
        setPublications(mappedPublications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publications');
        console.error('Error fetching publications:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublications();
  }, []);

  const handleCreatePublication = async () => {
    if (!newPublication.title || !newPublication.authors || !newPublication.journal || !newPublication.date) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faculty/publications/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newPublication.title,
          authors: newPublication.authors.split(",").map(author => author.trim()),
          journal: newPublication.journal,
          publication_date: newPublication.date,
          doi: newPublication.doi,
          research_project_id: newPublication.project,
          abstract: newPublication.abstract,
          keywords: newPublication.keywords.split(",").map(keyword => keyword.trim())
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create publication');
      }

      const data = await response.json();
      
      // Map the created publication to frontend format
      const createdPub: Publication = {
        id: data.publication.id,
        title: data.publication.title,
        authors: data.publication.authors || [],
        journal: data.publication.journal || '',
        date: data.publication.publication_date,
        doi: data.publication.doi,
        status: 'draft',
        project: data.publication.research_project_id,
        abstract: data.publication.abstract,
        keywords: data.publication.keywords || []
      };

      setPublications([createdPub, ...publications]);
      setNewPublication({
        title: "",
        authors: "",
        journal: "",
        date: "",
        doi: "",
        project: "",
        abstract: "",
        keywords: ""
      });
      setIsCreating(false);
      alert('Publication created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create publication");
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "submitted": return "default";
      case "under-review": return "outline";
      case "accepted": return "default";
      case "published": return "default";
      case "rejected": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <Clock size={16} className="text-yellow-500" />;
      case "submitted": return <Clock size={16} className="text-blue-500" />;
      case "under-review": return <Clock size={16} className="text-purple-500" />;
      case "accepted": return <CheckCircle size={16} className="text-green-500" />;
      case "published": return <CheckCircle size={16} className="text-green-500" />;
      case "rejected": return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} />;
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        const response = await fetch(`/api/faculty/publications/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete publication');
        }

        setPublications(publications.filter(pub => pub.id !== id));
        alert('Publication deleted successfully!');
      } catch (err) {
        alert('Failed to delete publication. Please try again.');
      }
    }
  };

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || pub.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const draftCount = publications.filter(p => p.status === "draft").length;
  const submittedCount = publications.filter(p => p.status === "submitted").length;
  const publishedCount = publications.filter(p => p.status === "published").length;

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Publication Management</h1>
            <p className="text-muted-foreground">Manage your research publications and manuscripts</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus size={18} />
            New Publication
          </Button>
        </div>

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
              <div className="text-muted-foreground">Manuscripts in progress</div>
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
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{publishedCount}</div>
              <div className="text-muted-foreground">Published papers</div>
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
              <CardTitle>Add New Publication</CardTitle>
              <CardDescription>Create a new publication entry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter publication title"
                  value={newPublication.title}
                  onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authors">Authors *</Label>
                  <Input
                    id="authors"
                    placeholder="Author names separated by commas"
                    value={newPublication.authors}
                    onChange={(e) => setNewPublication({...newPublication, authors: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal *</Label>
                  <Input
                    id="journal"
                    placeholder="Journal name"
                    value={newPublication.journal}
                    onChange={(e) => setNewPublication({...newPublication, journal: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Publication Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPublication.date}
                    onChange={(e) => setNewPublication({...newPublication, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    placeholder="Digital Object Identifier"
                    value={newPublication.doi}
                    onChange={(e) => setNewPublication({...newPublication, doi: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project">Associated Project</Label>
                <Input
                  id="project"
                  placeholder="Project name (if applicable)"
                  value={newPublication.project}
                  onChange={(e) => setNewPublication({...newPublication, project: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  placeholder="Publication abstract"
                  rows={4}
                  value={newPublication.abstract}
                  onChange={(e) => setNewPublication({...newPublication, abstract: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    placeholder="Keywords separated by commas"
                    value={newPublication.keywords}
                    onChange={(e) => setNewPublication({...newPublication, keywords: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreatePublication} className="gap-2" disabled={loading}>
                    {loading ? "Creating..." : <><Plus size={16} /> Add Publication</>}
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
                  placeholder="Search publications..."
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
                  <option value="accepted">Accepted</option>
                  <option value="published">Published</option>
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
              {filteredPublications.length > 0 ? (
                filteredPublications.map((pub) => (
                  <Card key={pub.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(pub.status)}
                            <CardTitle className="text-lg">{pub.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">
                            {pub.authors.join(", ")} • {pub.journal} • {new Date(pub.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(pub.status)}>
                          {pub.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {pub.abstract && (
                        <div className="mb-4">
                          <p className="text-muted-foreground line-clamp-2">{pub.abstract}</p>
                        </div>
                      )}
                      
                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pub.keywords.map((keyword, index) => (
                            <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye size={16} />
                          View
                        </Button>
                        {pub.doi && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download size={16} />
                            DOI: {pub.doi}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit size={16} />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeletePublication(pub.id)}
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
                  <h3 className="mt-4 font-medium">No publications found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Add your first publication to get started"}
                  </p>
                  <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                    <Plus size={16} />
                    New Publication
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