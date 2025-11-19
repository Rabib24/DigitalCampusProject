"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Refresh, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from "lucide-react";
import { FacultyAssignment } from "@/types/faculty";

// Mock data for the assignment
const mockAssignment: FacultyAssignment = {
  id: "1",
  courseId: "3",
  title: "Data Visualization Project",
  description: "Create interactive visualizations for a real-world dataset using Python libraries.",
  dueDate: "2023-10-15T23:59:59Z",
  maxPoints: 100,
  submissionCount: 25,
  gradedCount: 18,
  status: "published"
};

interface PlagiarismReport {
  id: string;
  studentId: string;
  studentName: string;
  similarityScore: number;
  matchedSources: {
    source: string;
    similarity: number;
    excerpt: string;
  }[];
  status: "flagged" | "reviewed" | "cleared";
  reviewedBy?: string;
  reviewedAt?: string;
}

export default function PlagiarismReportPage() {
  const [assignment] = useState<FacultyAssignment>(mockAssignment);
  const [reports, setReports] = useState<PlagiarismReport[]>([
    {
      id: "1",
      studentId: "S123456",
      studentName: "Alex Johnson",
      similarityScore: 87,
      matchedSources: [
        {
          source: "Data Visualization Techniques - Journal of Data Science, 2022",
          similarity: 45,
          excerpt: "The use of interactive visualizations has become increasingly important in data science..."
        },
        {
          source: "Python Data Visualization Cookbook - GitHub Repository",
          similarity: 32,
          excerpt: "Creating effective visualizations requires understanding of the underlying data structure..."
        }
      ],
      status: "flagged"
    },
    {
      id: "2",
      studentId: "S123457",
      studentName: "Sarah Williams",
      similarityScore: 12,
      matchedSources: [
        {
          source: "Introduction to Data Visualization - University Lecture Notes",
          similarity: 12,
          excerpt: "Data visualization is the graphical representation of information and data..."
        }
      ],
      status: "cleared"
    },
    {
      id: "3",
      studentId: "S123458",
      studentName: "Michael Chen",
      similarityScore: 94,
      matchedSources: [
        {
          source: "Advanced Data Visualization Project - Student Submission, 2022",
          similarity: 78,
          excerpt: "In this project, we will create interactive visualizations using Python libraries such as matplotlib and plotly..."
        },
        {
          source: "Data Visualization with Python - Online Tutorial",
          similarity: 45,
          excerpt: "Python provides powerful libraries for creating data visualizations..."
        }
      ],
      status: "flagged"
    },
    {
      id: "4",
      studentId: "S123459",
      studentName: "Emma Davis",
      similarityScore: 5,
      matchedSources: [],
      status: "cleared"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isScanning, setIsScanning] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "flagged": return "destructive";
      case "reviewed": return "default";
      case "cleared": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "flagged": return <AlertTriangle size={16} className="text-red-500" />;
      case "reviewed": return <CheckCircle size={16} className="text-green-500" />;
      case "cleared": return <CheckCircle size={16} className="text-blue-500" />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const handleScanPlagiarism = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      alert("Plagiarism scan completed! Results have been updated.");
    }, 3000);
  };

  const handleMarkAsReviewed = (id: string) => {
    setReports(reports.map(report => 
      report.id === id 
        ? { 
            ...report, 
            status: "reviewed",
            reviewedBy: "Current Faculty",
            reviewedAt: new Date().toISOString()
          } 
        : report
    ));
  };

  const handleMarkAsCleared = (id: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: "cleared" } : report
    ));
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || report.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getHighRiskCount = () => reports.filter(r => r.similarityScore > 80).length;
  const getMediumRiskCount = () => reports.filter(r => r.similarityScore > 50 && r.similarityScore <= 80).length;
  const getLowRiskCount = () => reports.filter(r => r.similarityScore <= 50).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Plagiarism Report</h1>
          <p className="text-muted-foreground">{assignment.title}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleScanPlagiarism} 
            disabled={isScanning}
            className="gap-2"
          >
            <Refresh size={16} />
            {isScanning ? "Scanning..." : "Rescan All"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{getHighRiskCount()}</div>
            <div className="text-muted-foreground">Submissions &gt;80% similarity</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-500" />
              Medium Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{getMediumRiskCount()}</div>
            <div className="text-muted-foreground">Submissions 50-80% similarity</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-500" />
              Low Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{getLowRiskCount()}</div>
            <div className="text-muted-foreground">Submissions &lt;50% similarity</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Scanned</span>
                <span className="font-medium">{reports.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Flagged</span>
                <span className="font-medium">{reports.filter(r => r.status === "flagged").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviewed</span>
                <span className="font-medium">{reports.filter(r => r.status === "reviewed").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by student name or ID..."
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
                <option value="flagged">Flagged</option>
                <option value="reviewed">Reviewed</option>
                <option value="cleared">Cleared</option>
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
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <CardTitle className="text-lg">{report.studentName}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {report.studentId} • Similarity Score: {report.similarityScore}%
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {report.matchedSources.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="font-medium">Matched Sources</h3>
                        <div className="space-y-3">
                          {report.matchedSources.map((source, index) => (
                            <div key={index} className="border-l-2 border-muted pl-4 py-1">
                              <div className="font-medium">{source.source}</div>
                              <div className="text-sm text-muted-foreground">
                                Similarity: {source.similarity}%
                              </div>
                              <div className="text-sm mt-1 italic">
                                "{source.excerpt}"
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No significant matches found
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkAsReviewed(report.id)}
                        disabled={report.status === "reviewed"}
                      >
                        Mark as Reviewed
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleMarkAsCleared(report.id)}
                        disabled={report.status === "cleared"}
                      >
                        Mark as Cleared
                      </Button>
                      <Button size="sm" variant="outline">
                        View Submission
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No plagiarism reports found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "All submissions have been filtered out"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}