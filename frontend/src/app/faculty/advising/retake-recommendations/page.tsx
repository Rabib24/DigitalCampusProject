"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { FacultyAdvisee } from "@/types/faculty";

interface CourseRecommendation {
  id: string;
  adviseeId: string;
  adviseeName: string;
  adviseeEmail: string;
  courseCode: string;
  courseName: string;
  previousGrade: string;
  recommendedGrade: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  recommendationDate: string;
  approvalDate?: string;
  completionDate?: string;
}

export default function RetakeRecommendationPage() {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([
    {
      id: "1",
      adviseeId: "S123456",
      adviseeName: "Alex Johnson",
      adviseeEmail: "alex.johnson@university.edu",
      courseCode: "CS-201",
      courseName: "Data Structures and Algorithms",
      previousGrade: "C",
      recommendedGrade: "B+",
      reason: "Student showed significant improvement in subsequent courses and would benefit from a stronger foundation",
      status: "approved",
      recommendationDate: "2023-09-15",
      approvalDate: "2023-09-20",
      completionDate: "2023-10-10"
    },
    {
      id: "2",
      adviseeId: "S123457",
      adviseeName: "Sarah Williams",
      adviseeEmail: "sarah.williams@university.edu",
      courseCode: "MATH-101",
      courseName: "Calculus I",
      previousGrade: "D+",
      recommendedGrade: "B",
      reason: "Essential prerequisite for advanced mathematics courses. Student has shown aptitude in higher-level courses.",
      status: "pending",
      recommendationDate: "2023-10-01"
    },
    {
      id: "3",
      adviseeId: "S123458",
      adviseeName: "Michael Chen",
      adviseeEmail: "michael.chen@university.edu",
      courseCode: "PHYS-201",
      courseName: "Modern Physics",
      previousGrade: "C-",
      recommendedGrade: "B+",
      reason: "Required for graduate school applications. Student has expressed interest in pursuing physics research.",
      status: "approved",
      recommendationDate: "2023-09-25",
      approvalDate: "2023-09-30"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newRecommendation, setNewRecommendation] = useState({
    adviseeId: "",
    courseCode: "",
    courseName: "",
    previousGrade: "",
    recommendedGrade: "",
    reason: ""
  });

  // Mock advisees data
  const advisees: FacultyAdvisee[] = [
    {
      id: "1",
      studentId: "S123456",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@university.edu",
      program: "Computer Science",
      year: 3,
      gpa: 3.75
    },
    {
      id: "2",
      studentId: "S123457",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@university.edu",
      program: "Mathematics",
      year: 2,
      gpa: 3.92
    },
    {
      id: "3",
      studentId: "S123458",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@university.edu",
      program: "Physics",
      year: 4,
      gpa: 3.68
    }
  ];

  const handleCreateRecommendation = () => {
    if (!newRecommendation.adviseeId || !newRecommendation.courseCode || !newRecommendation.courseName || 
        !newRecommendation.previousGrade || !newRecommendation.recommendedGrade || !newRecommendation.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedAdvisee = advisees.find(a => a.id === newRecommendation.adviseeId);
    if (!selectedAdvisee) {
      alert("Please select a valid advisee");
      return;
    }

    const recommendation: CourseRecommendation = {
      id: (recommendations.length + 1).toString(),
      adviseeId: newRecommendation.adviseeId,
      adviseeName: `${selectedAdvisee.firstName} ${selectedAdvisee.lastName}`,
      adviseeEmail: selectedAdvisee.email,
      courseCode: newRecommendation.courseCode,
      courseName: newRecommendation.courseName,
      previousGrade: newRecommendation.previousGrade,
      recommendedGrade: newRecommendation.recommendedGrade,
      reason: newRecommendation.reason,
      status: "pending",
      recommendationDate: new Date().toISOString().split('T')[0]
    };

    setRecommendations([recommendation, ...recommendations]);
    setNewRecommendation({
      adviseeId: "",
      courseCode: "",
      courseName: "",
      previousGrade: "",
      recommendedGrade: "",
      reason: ""
    });
    setIsCreating(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "approved": return "default";
      case "rejected": return "destructive";
      case "completed": return "outline";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle size={16} className="text-yellow-500" />;
      case "approved": return <CheckCircle size={16} className="text-green-500" />;
      case "rejected": return <AlertCircle size={16} className="text-red-500" />;
      case "completed": return <CheckCircle size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} />;
    }
  };

  const handleApproveRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id 
        ? { ...rec, status: "approved", approvalDate: new Date().toISOString().split('T')[0] } 
        : rec
    ));
    alert("Recommendation approved!");
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id 
        ? { ...rec, status: "rejected" } 
        : rec
    ));
    alert("Recommendation rejected!");
  };

  const handleMarkCompleted = (id: string) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id 
        ? { ...rec, status: "completed", completionDate: new Date().toISOString().split('T')[0] } 
        : rec
    ));
  };

  const handleDeleteRecommendation = (id: string) => {
    if (confirm("Are you sure you want to delete this recommendation?")) {
      setRecommendations(recommendations.filter(rec => rec.id !== id));
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.adviseeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         rec.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || rec.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const pendingRecommendations = recommendations.filter(r => r.status === "pending").length;
  const approvedRecommendations = recommendations.filter(r => r.status === "approved").length;
  const completedRecommendations = recommendations.filter(r => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Retake Recommendations</h1>
          <p className="text-muted-foreground">Recommend courses for students to retake for improved grades</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          New Recommendation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingRecommendations}</div>
            <div className="text-muted-foreground">Awaiting approval</div>
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
            <div className="text-3xl font-bold text-green-500">{approvedRecommendations}</div>
            <div className="text-muted-foreground">Ready for retake</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{completedRecommendations}</div>
            <div className="text-muted-foreground">Successfully retaken</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Recommendation</CardTitle>
            <CardDescription>Recommend a course for a student to retake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="advisee">Advisee *</Label>
                <select
                  id="advisee"
                  className="w-full p-2 border rounded"
                  value={newRecommendation.adviseeId}
                  onChange={(e) => setNewRecommendation({...newRecommendation, adviseeId: e.target.value})}
                >
                  <option value="">Select an advisee</option>
                  {advisees.map(advisee => (
                    <option key={advisee.id} value={advisee.id}>
                      {advisee.firstName} {advisee.lastName} ({advisee.studentId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS-201"
                  value={newRecommendation.courseCode}
                  onChange={(e) => setNewRecommendation({...newRecommendation, courseCode: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Data Structures and Algorithms"
                  value={newRecommendation.courseName}
                  onChange={(e) => setNewRecommendation({...newRecommendation, courseName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="previousGrade">Previous Grade *</Label>
                <Input
                  id="previousGrade"
                  placeholder="e.g., C"
                  value={newRecommendation.previousGrade}
                  onChange={(e) => setNewRecommendation({...newRecommendation, previousGrade: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recommendedGrade">Recommended Grade *</Label>
                <Input
                  id="recommendedGrade"
                  placeholder="e.g., B+"
                  value={newRecommendation.recommendedGrade}
                  onChange={(e) => setNewRecommendation({...newRecommendation, recommendedGrade: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason for Recommendation *</Label>
                <Input
                  id="reason"
                  placeholder="Explain why this retake is recommended"
                  value={newRecommendation.reason}
                  onChange={(e) => setNewRecommendation({...newRecommendation, reason: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateRecommendation} className="gap-2">
                <Plus size={16} />
                Create Recommendation
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
                placeholder="Search recommendations..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
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
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(rec.status)}
                          <CardTitle className="text-lg">
                            {rec.courseCode}: {rec.courseName}
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {rec.adviseeName} • Previous Grade: {rec.previousGrade} • Recommended: {rec.recommendedGrade}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(rec.status)}>
                        {rec.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-muted-foreground">{rec.reason}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Recommended:</span>
                        <span>{new Date(rec.recommendationDate).toLocaleDateString()}</span>
                      </div>
                      {rec.approvalDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Approved:</span>
                          <span>{new Date(rec.approvalDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {rec.completionDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Completed:</span>
                          <span>{new Date(rec.completionDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {rec.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleApproveRecommendation(rec.id)}
                            className="gap-2"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectRecommendation(rec.id)}
                            className="gap-2"
                          >
                            <AlertCircle size={16} />
                            Reject
                          </Button>
                        </>
                      )}
                      {rec.status === "approved" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMarkCompleted(rec.id)}
                          className="gap-2"
                        >
                          <TrendingUp size={16} />
                          Mark Completed
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteRecommendation(rec.id)}
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
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No recommendations found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first recommendation to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  New Recommendation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}