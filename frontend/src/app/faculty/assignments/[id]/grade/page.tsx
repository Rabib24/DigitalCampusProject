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
  Eye, 
  Download, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock
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

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionDate: string;
  files: { name: string; size: string }[];
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

export default function FacultyGradingPage() {
  const [assignment] = useState<FacultyAssignment>(mockAssignment);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: "1",
      studentId: "S123456",
      studentName: "Alex Johnson",
      studentEmail: "alex.johnson@university.edu",
      submissionDate: "2023-10-14T14:30:00Z",
      files: [{ name: "project.zip", size: "2.4 MB" }],
      grade: 92,
      feedback: "Excellent work! The visualizations are clear and insightful. Minor improvements could be made to the color scheme.",
      status: "graded"
    },
    {
      id: "2",
      studentId: "S123457",
      studentName: "Sarah Williams",
      studentName: "Sarah Williams",
      studentEmail: "sarah.williams@university.edu",
      submissionDate: "2023-10-15T09:15:00Z",
      files: [{ name: "visualization_project.pdf", size: "1.8 MB" }],
      status: "submitted"
    },
    {
      id: "3",
      studentId: "S123458",
      studentName: "Michael Chen",
      studentEmail: "michael.chen@university.edu",
      submissionDate: "2023-10-16T11:45:00Z",
      files: [{ name: "data_viz.zip", size: "3.1 MB" }],
      status: "late"
    }
  ]);

  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [grade, setGrade] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");

  const currentSubmission = submissions[currentSubmissionIndex];

  const handleSaveGrade = () => {
    if (grade === "" || grade < 0 || grade > assignment.maxPoints) {
      alert(`Please enter a valid grade between 0 and ${assignment.maxPoints}`);
      return;
    }

    const updatedSubmissions = [...submissions];
    updatedSubmissions[currentSubmissionIndex] = {
      ...currentSubmission,
      grade: Number(grade),
      feedback
    };

    setSubmissions(updatedSubmissions);
    alert("Grade saved successfully!");
  };

  const handleNextSubmission = () => {
    if (currentSubmissionIndex < submissions.length - 1) {
      setCurrentSubmissionIndex(currentSubmissionIndex + 1);
      // Reset form for next submission
      const nextSubmission = submissions[currentSubmissionIndex + 1];
      setGrade(nextSubmission.grade || "");
      setFeedback(nextSubmission.feedback || "");
    }
  };

  const handlePreviousSubmission = () => {
    if (currentSubmissionIndex > 0) {
      setCurrentSubmissionIndex(currentSubmissionIndex - 1);
      // Reset form for previous submission
      const prevSubmission = submissions[currentSubmissionIndex - 1];
      setGrade(prevSubmission.grade || "");
      setFeedback(prevSubmission.feedback || "");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded": return <CheckCircle size={16} className="text-green-500" />;
      case "late": return <Clock size={16} className="text-yellow-500" />;
      case "submitted": return <CheckCircle size={16} className="text-blue-500" />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getGradedCount = () => submissions.filter(s => s.grade !== undefined).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grade Submissions</h1>
          <p className="text-muted-foreground">{assignment.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Download All
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload size={16} />
            Upload Grades
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Submission List</CardTitle>
            <CardDescription>Select a submission to grade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {submissions.map((submission, index) => (
              <div 
                key={submission.id}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-muted ${
                  index === currentSubmissionIndex ? "bg-muted border-primary" : "border-border"
                }`}
                onClick={() => {
                  setCurrentSubmissionIndex(index);
                  setGrade(submission.grade || "");
                  setFeedback(submission.feedback || "");
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{submission.studentName}</div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(submission.status)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {submission.studentId} • {new Date(submission.submissionDate).toLocaleDateString()}
                </div>
                {submission.grade !== undefined && (
                  <div className="text-xs font-medium mt-1">
                    Grade: {submission.grade}/{assignment.maxPoints}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentSubmission.studentName}</CardTitle>
                  <CardDescription>
                    {currentSubmission.studentId} • {currentSubmission.studentEmail}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousSubmission}
                    disabled={currentSubmissionIndex === 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentSubmissionIndex + 1} of {submissions.length}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextSubmission}
                    disabled={currentSubmissionIndex === submissions.length - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Submission Date</div>
                  <div className="font-medium">
                    {new Date(currentSubmission.submissionDate).toLocaleString()}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium capitalize flex items-center gap-2">
                    {getStatusIcon(currentSubmission.status)}
                    {currentSubmission.status}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Files Submitted</div>
                  <div className="font-medium">
                    {currentSubmission.files.length} file{currentSubmission.files.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Submitted Files</h3>
                <div className="space-y-2">
                  {currentSubmission.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">{file.size}</div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download size={16} />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Submission Preview</h3>
                <div className="border rounded-lg p-4 h-64 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      Preview not available for this file type
                    </p>
                    <Button variant="outline" className="mt-2 gap-2">
                      <Eye size={16} />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade & Feedback</CardTitle>
              <CardDescription>
                Provide a grade and feedback for this submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (0-{assignment.maxPoints})</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max={assignment.maxPoints}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={`Enter grade (max ${assignment.maxPoints})`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grading Progress</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(getGradedCount() / submissions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm">
                      {getGradedCount()}/{submissions.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback for the student..."
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveGrade} className="gap-2">
                  <Save size={16} />
                  Save Grade
                </Button>
                <Button variant="outline">Save Draft</Button>
                <Button variant="outline">Skip</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}