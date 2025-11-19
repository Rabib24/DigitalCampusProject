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
  Clock,
  Hash,
  BookOpen
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

// Mock data for courses
const mockCourses: FacultyCourse[] = [
  { id: "1", code: "CS-101", name: "Introduction to Computer Science", semester: "Fall", year: 2023, credits: 3, department: "Computer Science", studentCount: 45, syllabusStatus: "published" },
  { id: "2", code: "CS-205", name: "Web Development", semester: "Fall", year: 2023, credits: 3, department: "Computer Science", studentCount: 32, syllabusStatus: "published" },
  { id: "3", code: "CS-301", name: "Data Science and Machine Learning", semester: "Fall", year: 2023, credits: 4, department: "Computer Science", studentCount: 28, syllabusStatus: "published" },
  { id: "4", code: "CS-401", name: "Capstone Project", semester: "Fall", year: 2023, credits: 4, department: "Computer Science", studentCount: 15, syllabusStatus: "published" }
];

interface AssignmentFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export default function CreateAssignmentPage() {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    dueTime: "23:59",
    maxPoints: 100,
    allowLateSubmissions: true,
    latePenalty: 10,
    allowMultipleSubmissions: false
  });

  const [files, setFiles] = useState<AssignmentFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAssignment = () => {
    if (!assignment.title || !assignment.description || !assignment.courseId || !assignment.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Creating assignment:", assignment);
      console.log("Attached files:", files);
      setIsSubmitting(false);
      alert("Assignment created successfully!");
      // In a real app, you would redirect to the assignment list or details page
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile: AssignmentFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type
      };
      setFiles([...files, newFile]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Assignment</h1>
          <p className="text-muted-foreground">Create an assignment for your course</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>Enter the basic information for your assignment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText size={16} />
              Assignment Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Data Visualization Project"
              value={assignment.title}
              onChange={(e) => setAssignment({...assignment, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText size={16} />
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Enter detailed instructions for the assignment"
              rows={6}
              value={assignment.description}
              onChange={(e) => setAssignment({...assignment, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="course" className="flex items-center gap-2">
                <BookOpen size={16} />
                Course *
              </Label>
              <select
                id="course"
                className="w-full p-2 border rounded"
                value={assignment.courseId}
                onChange={(e) => setAssignment({...assignment, courseId: e.target.value})}
              >
                <option value="">Select a course</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPoints" className="flex items-center gap-2">
                <Hash size={16} />
                Maximum Points *
              </Label>
              <Input
                id="maxPoints"
                type="number"
                min="1"
                value={assignment.maxPoints}
                onChange={(e) => setAssignment({...assignment, maxPoints: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar size={16} />
                Due Date *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={assignment.dueDate}
                onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueTime" className="flex items-center gap-2">
                <Clock size={16} />
                Due Time
              </Label>
              <Input
                id="dueTime"
                type="time"
                value={assignment.dueTime}
                onChange={(e) => setAssignment({...assignment, dueTime: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Submission Settings</CardTitle>
          <CardDescription>Configure how students can submit this assignment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Allow Late Submissions</h3>
              <p className="text-sm text-muted-foreground">Allow students to submit after the due date</p>
            </div>
            <Button 
              variant={assignment.allowLateSubmissions ? "default" : "outline"}
              onClick={() => setAssignment({...assignment, allowLateSubmissions: !assignment.allowLateSubmissions})}
            >
              {assignment.allowLateSubmissions ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          {assignment.allowLateSubmissions && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="latePenalty">Late Penalty (%)</Label>
              <Input
                id="latePenalty"
                type="number"
                min="0"
                max="100"
                value={assignment.latePenalty}
                onChange={(e) => setAssignment({...assignment, latePenalty: parseInt(e.target.value) || 0})}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Multiple Submissions</h3>
              <p className="text-sm text-muted-foreground">Allow students to submit multiple times</p>
            </div>
            <Button 
              variant={assignment.allowMultipleSubmissions ? "default" : "outline"}
              onClick={() => setAssignment({...assignment, allowMultipleSubmissions: !assignment.allowMultipleSubmissions})}
            >
              {assignment.allowMultipleSubmissions ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment Files</CardTitle>
          <CardDescription>Upload files or resources for this assignment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="files" className="flex items-center gap-2">
              <Upload size={16} />
              Attach Files
            </Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Attached Files</h3>
              <div className="space-y-2">
                {files.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">{file.size}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(file.id)}
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
        <Button onClick={handleCreateAssignment} disabled={isSubmitting} className="gap-2">
          <Save size={16} />
          {isSubmitting ? "Creating..." : "Create Assignment"}
        </Button>
        <Button variant="outline">Save as Draft</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
    </FacultyProtectedRoute>
  );
}