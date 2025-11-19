"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle
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
  files: { name: string; size: string; type: string }[];
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
  latePenalty?: number;
}

interface Comment {
  id: string;
  author: string;
  authorRole: "faculty" | "student";
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
}

export default function SubmissionReviewPage() {
  const [assignment] = useState<FacultyAssignment>(mockAssignment);
  const [submission, setSubmission] = useState<StudentSubmission>({
    id: "1",
    studentId: "S123456",
    studentName: "Alex Johnson",
    studentEmail: "alex.johnson@university.edu",
    submissionDate: "2023-10-14T14:30:00Z",
    files: [
      { name: "project.zip", size: "2.4 MB", type: "application/zip" },
      { name: "report.pdf", size: "1.2 MB", type: "application/pdf" }
    ],
    grade: 92,
    feedback: "Excellent work! The visualizations are clear and insightful. Minor improvements could be made to the color scheme.",
    status: "graded",
    latePenalty: 0
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Dr. Jane Smith",
      authorRole: "faculty",
      content: "Great job on this project! The visualizations are very clear and the analysis is thorough.",
      timestamp: "2023-10-16T09:30:00Z",
      likes: 2,
      dislikes: 0
    },
    {
      id: "2",
      author: "Alex Johnson",
      authorRole: "student",
      content: "Thank you for the feedback! I'll work on improving the color scheme in my next project.",
      timestamp: "2023-10-16T14:15:00Z",
      likes: 1,
      dislikes: 0
    }
  ]);

  const [newComment, setNewComment] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded": return <CheckCircle size={16} className="text-green-500" />;
      case "late": return <Clock size={16} className="text-yellow-500" />;
      case "submitted": return <CheckCircle size={16} className="text-blue-500" />;
      default: return <CheckCircle size={16} />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: (comments.length + 1).toString(),
      author: "Current Faculty", // In a real app, this would be the current user
      authorRole: "faculty",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleLikeComment = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    ));
  };

  const handleDislikeComment = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, dislikes: comment.dislikes + 1 } : comment
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Submission Review</h1>
          <p className="text-muted-foreground">{assignment.title} - {submission.studentName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Download All
          </Button>
          <Button className="gap-2">
            <MessageSquare size={16} />
            Message Student
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Student</div>
                <div className="font-medium">{submission.studentName}</div>
                <div className="text-sm text-muted-foreground">{submission.studentId}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Submission Date</div>
                <div className="font-medium">
                  {new Date(submission.submissionDate).toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getStatusIcon(submission.status)}
                  <span className="capitalize">{submission.status}</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Grade</div>
                <div className="font-medium text-2xl">
                  {submission.grade !== undefined ? `${submission.grade}/${assignment.maxPoints}` : "Not graded"}
                </div>
                {submission.latePenalty && submission.latePenalty > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Late penalty: -{submission.latePenalty} points
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Submitted Files</h3>
              <div className="space-y-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="text-muted-foreground" size={20} />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">{file.size}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye size={16} />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Submission Preview</h3>
              <div className="border rounded-lg p-4 h-96 flex items-center justify-center bg-muted">
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grading</CardTitle>
              <CardDescription>Review and update the grade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Current Grade</div>
                <div className="text-3xl font-bold">
                  {submission.grade !== undefined ? submission.grade : "-"}
                  <span className="text-lg text-muted-foreground">/{assignment.maxPoints}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
                <textarea
                  id="feedback"
                  className="w-full p-3 border rounded-lg"
                  rows={6}
                  value={submission.feedback || ""}
                  onChange={(e) => setSubmission({...submission, feedback: e.target.value})}
                  placeholder="Enter feedback for the student..."
                />
              </div>
              
              <Button className="w-full gap-2">
                <CheckCircle size={16} />
                Update Grade
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plagiarism Check</CardTitle>
              <CardDescription>Review similarity report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Similarity Score</span>
                <Badge variant="secondary">12%</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Match</span>
                  <span>Low Risk</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: "12%" }}
                  ></div>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Eye size={16} />
                View Full Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Comments & Discussion
          </CardTitle>
          <CardDescription>Discuss this submission with the student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 rounded-lg border ${
                      comment.authorRole === "faculty" 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{comment.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={comment.authorRole === "faculty" ? "default" : "secondary"}>
                        {comment.authorRole}
                      </Badge>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLikeComment(comment.id)}
                        className="gap-1"
                      >
                        <ThumbsUp size={16} />
                        {comment.likes > 0 && comment.likes}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDislikeComment(comment.id)}
                        className="gap-1"
                      >
                        <ThumbsDown size={16} />
                        {comment.dislikes > 0 && comment.dislikes}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet. Be the first to add a comment.
              </div>
            )}
            
            <div className="space-y-2 pt-4">
              <label htmlFor="new-comment" className="text-sm font-medium">Add a comment</label>
              <textarea
                id="new-comment"
                className="w-full p-3 border rounded-lg"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment or feedback..."
              />
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()}
                className="gap-2"
              >
                <MessageSquare size={16} />
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}