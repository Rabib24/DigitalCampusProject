"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Save, 
  Upload, 
  Users,
  Building,
  Target,
  Calendar,
  Clock
} from "lucide-react";

export default function AnnouncementCreationPage() {
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    targetAudience: "all" as "all" | "specific-course" | "department" | "year",
    courseId: "",
    department: "",
    year: 2023,
    scheduleDate: "",
    scheduleTime: "09:00",
    priority: "medium" as "low" | "medium" | "high"
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for courses, departments, and years
  const courses = [
    { id: "1", code: "CS-101", name: "Introduction to Computer Science" },
    { id: "2", code: "CS-205", name: "Web Development" },
    { id: "3", code: "CS-301", name: "Data Science and Machine Learning" },
    { id: "4", code: "CS-401", name: "Capstone Project" }
  ];

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Engineering"
  ];

  const years = [1, 2, 3, 4];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmitAnnouncement = () => {
    if (!announcement.title || !announcement.message) {
      alert("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting announcement:", { announcement, files });
      setIsSubmitting(false);
      alert("Announcement created successfully!");
      // In a real app, you would redirect to the announcements list page
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create Announcement</h1>
          <p className="text-muted-foreground">Share important information with your students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement Details</CardTitle>
          <CardDescription>Enter the content and settings for your announcement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter announcement title"
              value={announcement.title}
              onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Enter your announcement message"
              rows={6}
              value={announcement.message}
              onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={announcement.targetAudience === "all" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, targetAudience: "all"})}
                className="gap-2"
              >
                <Users size={16} />
                All Students
              </Button>
              <Button
                variant={announcement.targetAudience === "specific-course" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, targetAudience: "specific-course"})}
                className="gap-2"
              >
                <Target size={16} />
                Specific Course
              </Button>
              <Button
                variant={announcement.targetAudience === "department" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, targetAudience: "department"})}
                className="gap-2"
              >
                <Building size={16} />
                Department
              </Button>
              <Button
                variant={announcement.targetAudience === "year" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, targetAudience: "year"})}
                className="gap-2"
              >
                <Target size={16} />
                Year Group
              </Button>
            </div>
          </div>
          
          {announcement.targetAudience === "specific-course" && (
            <div className="space-y-2">
              <Label htmlFor="course">Select Course</Label>
              <select
                id="course"
                className="w-full p-2 border rounded"
                value={announcement.courseId}
                onChange={(e) => setAnnouncement({...announcement, courseId: e.target.value})}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {announcement.targetAudience === "department" && (
            <div className="space-y-2">
              <Label htmlFor="department">Select Department</Label>
              <select
                id="department"
                className="w-full p-2 border rounded"
                value={announcement.department}
                onChange={(e) => setAnnouncement({...announcement, department: e.target.value})}
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {announcement.targetAudience === "year" && (
            <div className="space-y-2">
              <Label htmlFor="year">Select Year</Label>
              <select
                id="year"
                className="w-full p-2 border rounded"
                value={announcement.year}
                onChange={(e) => setAnnouncement({...announcement, year: parseInt(e.target.value)})}
              >
                <option value="">Select a year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Schedule Date</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={announcement.scheduleDate}
                onChange={(e) => setAnnouncement({...announcement, scheduleDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Schedule Time</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={announcement.scheduleTime}
                onChange={(e) => setAnnouncement({...announcement, scheduleTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <div className="flex gap-2">
              <Button
                variant={announcement.priority === "low" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, priority: "low"})}
              >
                Low
              </Button>
              <Button
                variant={announcement.priority === "medium" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, priority: "medium"})}
              >
                Medium
              </Button>
              <Button
                variant={announcement.priority === "high" ? "default" : "outline"}
                onClick={() => setAnnouncement({...announcement, priority: "high"})}
              >
                High
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Attachments
          </CardTitle>
          <CardDescription>Upload files to include with your announcement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="files">Attach Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileUpload}
            />
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, XLSX, PPTX (Max 10MB each)
            </p>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Attached Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmitAnnouncement} disabled={isSubmitting} className="gap-2">
          <Bell size={16} />
          {isSubmitting ? "Creating..." : "Create Announcement"}
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}