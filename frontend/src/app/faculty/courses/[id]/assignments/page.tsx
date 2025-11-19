"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Eye,
  Copy,
  BarChart,
  Calendar,
  Clock
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";
import { FacultyAssignment } from "@/types/faculty";

// Mock data for the course
const mockCourse: FacultyCourse = {
  id: "1",
  code: "CS-301",
  name: "Data Science and Machine Learning",
  semester: "Fall",
  year: 2023,
  credits: 4,
  department: "Computer Science",
  studentCount: 28,
  syllabusStatus: "published"
};

export default function CourseAssignmentsPage() {
  const router = useRouter();
  const [course] = useState<FacultyCourse>(mockCourse);
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([
    {
      id: "1",
      courseId: "1",
      title: "Data Visualization Project",
      description: "Create interactive visualizations for a real-world dataset using Python libraries.",
      dueDate: "2023-10-15T23:59:59Z",
      maxPoints: 100,
      submissionCount: 25,
      gradedCount: 18,
      status: "published"
    },
    {
      id: "2",
      courseId: "1",
      title: "Machine Learning Model Implementation",
      description: "Implement and evaluate three different machine learning models on the provided dataset.",
      dueDate: "2023-11-05T23:59:59Z",
      maxPoints: 150,
      submissionCount: 22,
      gradedCount: 15,
      status: "published"
    },
    {
      id: "3",
      courseId: "1",
      title: "Research Paper Analysis",
      description: "Analyze a recent research paper in data science and present your findings.",
      dueDate: "2023-11-25T23:59:59Z",
      maxPoints: 75,
      submissionCount: 18,
      gradedCount: 12,
      status: "draft"
    },
    {
      id: "4",
      courseId: "1",
      title: "Final Project Proposal",
      description: "Submit a proposal for your final course project including objectives and methodology.",
      dueDate: "2023-12-10T23:59:59Z",
      maxPoints: 50,
      submissionCount: 28,
      gradedCount: 28,
      status: "published"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusVariant = (status: FacultyAssignment["status"]) => {
    switch (status) {
      case "draft": return "secondary";
      case "published": return "default";
      case "closed": return "outline";
      default: return "default";
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Overdue", variant: "destructive" as const };
    if (diffDays === 0) return { text: "Due Today", variant: "destructive" as const };
    if (diffDays <= 3) return { text: "Due Soon", variant: "default" as const };
    if (diffDays <= 7) return { text: "This Week", variant: "secondary" as const };
    return { text: `${diffDays} days`, variant: "outline" as const };
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Course Assignments</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Create Assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                <option value="published">Published</option>
                <option value="closed">Closed</option>
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
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const dueDateStatus = getDueDateStatus(assignment.dueDate);
                
                return (
                  <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen size={20} className="text-primary" />
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-1">
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <Badge variant={dueDateStatus.variant}>
                            {dueDateStatus.text}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BarChart size={16} className="text-muted-foreground" />
                          <span>
                            {assignment.submissionCount}/{course.studentCount} submitted
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BarChart size={16} className="text-muted-foreground" />
                          <span>
                            {assignment.gradedCount}/{assignment.submissionCount} graded
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/courses/${course.id}/assignments/${assignment.id}/submissions`)}
                        >
                          <Eye size={16} />
                          View Submissions
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/courses/${course.id}/assignments/${assignment.id}/edit`)}
                        >
                          <Edit size={16} />
                          Edit Assignment
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/courses/${course.id}/assignments/${assignment.id}/duplicate`)}
                        >
                          <Copy size={16} />
                          Duplicate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => router.push(`/faculty/gradebook?courseId=${course.id}&assignmentId=${assignment.id}`)}
                        >
                          <BarChart size={16} />
                          Gradebook
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No assignments found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first assignment to get started"}
                </p>
                <Button className="mt-4 gap-2">
                  <Plus size={16} />
                  Create Assignment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Statistics</CardTitle>
          <CardDescription>Overview of assignment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-muted-foreground">Total Assignments</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">93</div>
              <div className="text-muted-foreground">Total Submissions</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">63</div>
              <div className="text-muted-foreground">Graded Submissions</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">68%</div>
              <div className="text-muted-foreground">Grading Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}