"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  Save, 
  Upload,
  Users,
  Building,
  Hash
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

export default function CreateCoursePage() {
  const [course, setCourse] = useState({
    code: "",
    name: "",
    description: "",
    credits: 3,
    department: "Computer Science",
    semester: "Fall",
    year: new Date().getFullYear(),
    syllabus: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCourse = () => {
    if (!course.code || !course.name) {
      alert("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Creating course:", course);
      setIsSubmitting(false);
      alert("Course created successfully!");
      // In a real app, you would redirect to the course list or details page
    }, 1000);
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">Set up a new course for the upcoming semester</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Enter the basic details for your new course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Hash size={16} />
                Course Code *
              </Label>
              <Input
                id="code"
                placeholder="e.g., CS-101"
                value={course.code}
                onChange={(e) => setCourse({...course, code: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <BookOpen size={16} />
                Course Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Introduction to Computer Science"
                value={course.name}
                onChange={(e) => setCourse({...course, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building size={16} />
                Department
              </Label>
              <select
                id="department"
                className="w-full p-2 border rounded"
                value={course.department}
                onChange={(e) => setCourse({...course, department: e.target.value})}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits" className="flex items-center gap-2">
                <CreditCard size={16} />
                Credits
              </Label>
              <select
                id="credits"
                className="w-full p-2 border rounded"
                value={course.credits}
                onChange={(e) => setCourse({...course, credits: parseInt(e.target.value)})}
              >
                {[1, 2, 3, 4, 5, 6].map(credit => (
                  <option key={credit} value={credit}>{credit} credit{credit > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester" className="flex items-center gap-2">
                <Calendar size={16} />
                Semester
              </Label>
              <select
                id="semester"
                className="w-full p-2 border rounded"
                value={course.semester}
                onChange={(e) => setCourse({...course, semester: e.target.value})}
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar size={16} />
                Year
              </Label>
              <Input
                id="year"
                type="number"
                min="2020"
                max="2030"
                value={course.year}
                onChange={(e) => setCourse({...course, year: parseInt(e.target.value) || new Date().getFullYear()})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText size={16} />
              Course Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the course"
              rows={4}
              value={course.description}
              onChange={(e) => setCourse({...course, description: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="syllabus" className="flex items-center gap-2">
              <Upload size={16} />
              Syllabus (Optional)
            </Label>
            <Input
              id="syllabus"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                // In a real app, you would handle file upload
                if (e.target.files && e.target.files[0]) {
                  setCourse({...course, syllabus: e.target.files[0].name});
                }
              }}
            />
            {course.syllabus && (
              <p className="text-sm text-muted-foreground">Selected file: {course.syllabus}</p>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateCourse} disabled={isSubmitting} className="gap-2">
              <Save size={16} />
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>Configure advanced course settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enrollment Management</h3>
              <p className="text-sm text-muted-foreground">Control who can enroll in this course</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Grading Scheme</h3>
              <p className="text-sm text-muted-foreground">Set up the grading criteria for this course</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Course Materials</h3>
              <p className="text-sm text-muted-foreground">Upload and organize course materials</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}