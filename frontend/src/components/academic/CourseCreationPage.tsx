"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  FileText, 
  Plus, 
  Trash2,
  Save
} from "lucide-react";
import { Course } from "@/models/Course";

export function CourseCreationPage() {
  const [course, setCourse] = useState<Omit<Course, 'id' | 'createdAt' | 'students' | 'assignments' | 'materials' | 'announcements' | 'waitlist' | 'gradingScale'>>({
    code: "",
    name: "",
    description: "",
    credits: 3,
    instructorId: "",
    schedule: "",
    department: "",
    prerequisites: [],
    syllabus: "",
    textbooks: [],
    enrollmentLimit: 30,
    startDate: new Date(),
    endDate: new Date(),
    categories: [],
  });

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newTextbook, setNewTextbook] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !course.prerequisites.includes(newPrerequisite)) {
      setCourse({
        ...course,
        prerequisites: [...course.prerequisites, newPrerequisite.trim()]
      });
      setNewPrerequisite("");
    }
  };

  const handleRemovePrerequisite = (prereq: string) => {
    setCourse({
      ...course,
      prerequisites: course.prerequisites.filter(p => p !== prereq)
    });
  };

  const handleAddTextbook = () => {
    if (newTextbook.trim() && !course.textbooks.includes(newTextbook)) {
      setCourse({
        ...course,
        textbooks: [...course.textbooks, newTextbook.trim()]
      });
      setNewTextbook("");
    }
  };

  const handleRemoveTextbook = (textbook: string) => {
    setCourse({
      ...course,
      textbooks: course.textbooks.filter(t => t !== textbook)
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !course.categories.includes(newCategory)) {
      setCourse({
        ...course,
        categories: [...course.categories, newCategory.trim()]
      });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCourse({
      ...course,
      categories: course.categories.filter(c => c !== category)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the backend
    console.log("Course data to submit:", {
      ...course,
      id: "new",
      createdAt: new Date(),
      students: [],
      assignments: [],
      materials: [],
      announcements: [],
      waitlist: [],
      gradingScale: {}
    });
    alert("Course created successfully!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
        <p className="text-muted-foreground mt-1">Fill in the details to create a new course</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the core details of the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      value={course.code}
                      onChange={(e) => setCourse({...course, code: e.target.value})}
                      placeholder="e.g., CS-101"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Credits</Label>
                    <Select 
                      value={course.credits.toString()} 
                      onValueChange={(value) => setCourse({...course, credits: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credits" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} credit{num > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={course.name}
                    onChange={(e) => setCourse({...course, name: e.target.value})}
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={course.description}
                    onChange={(e) => setCourse({...course, description: e.target.value})}
                    placeholder="Enter a detailed description of the course"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={course.department}
                      onChange={(e) => setCourse({...course, department: e.target.value})}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructorId">Instructor ID</Label>
                    <Input
                      id="instructorId"
                      value={course.instructorId}
                      onChange={(e) => setCourse({...course, instructorId: e.target.value})}
                      placeholder="e.g., inst_12345"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule & Duration
                </CardTitle>
                <CardDescription>
                  Set the course schedule and duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={course.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setCourse({...course, startDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={course.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setCourse({...course, endDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={course.schedule}
                    onChange={(e) => setCourse({...course, schedule: e.target.value})}
                    placeholder="e.g., Mon/Wed/Fri 10:00-11:00 AM"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentLimit">Enrollment Limit</Label>
                    <Input
                      id="enrollmentLimit"
                      type="number"
                      min="1"
                      value={course.enrollmentLimit}
                      onChange={(e) => setCourse({...course, enrollmentLimit: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Course Content
                </CardTitle>
                <CardDescription>
                  Define the syllabus and required materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="syllabus">Syllabus</Label>
                  <Textarea
                    id="syllabus"
                    value={course.syllabus}
                    onChange={(e) => setCourse({...course, syllabus: e.target.value})}
                    placeholder="Enter the course syllabus"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Textbooks</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTextbook}
                      onChange={(e) => setNewTextbook(e.target.value)}
                      placeholder="Add a textbook"
                    />
                    <Button type="button" onClick={handleAddTextbook} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {course.textbooks.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {course.textbooks.map((textbook, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>{textbook}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRemoveTextbook(textbook)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
                <CardDescription>
                  Add course prerequisites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add a prerequisite"
                  />
                  <Button type="button" onClick={handleAddPrerequisite} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {course.prerequisites.length > 0 && (
                  <div className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{prereq}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemovePrerequisite(prereq)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Categories
                </CardTitle>
                <CardDescription>
                  Add course categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category"
                  />
                  <Button type="button" onClick={handleAddCategory} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {course.categories.length > 0 && (
                  <div className="space-y-2">
                    {course.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{category}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveCategory(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>
                  Review your course details before submitting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Code:</span>
                    <span className="font-medium">{course.code || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Name:</span>
                    <span className="font-medium">{course.name || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{course.department || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{course.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{course.endDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  <Save className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}