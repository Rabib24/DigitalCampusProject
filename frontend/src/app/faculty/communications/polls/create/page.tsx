"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Plus, 
  Trash2, 
  Users,
  Building,
  Target,
  Calendar,
  Clock
} from "lucide-react";

interface PollOption {
  id: string;
  text: string;
}

export default function PollCreationPage() {
  const [poll, setPoll] = useState({
    title: "",
    description: "",
    targetAudience: "all" as "all" | "specific-course" | "department" | "year",
    courseId: "",
    department: "",
    year: 2023,
    allowMultipleVotes: false,
    anonymousVoting: false,
    endDate: "",
    endTime: "23:59"
  });

  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" }
  ]);

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

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now().toString(), text: "" }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      alert("You must have at least 2 options");
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSubmitPoll = () => {
    if (!poll.title || options.some(option => !option.text.trim())) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting poll:", { poll, options });
      setIsSubmitting(false);
      alert("Poll created successfully!");
      // In a real app, you would redirect to the polls list page
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create Poll</h1>
          <p className="text-muted-foreground">Create a poll to gather feedback from students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>Enter the content and settings for your poll</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="Enter poll title"
              value={poll.title}
              onChange={(e) => setPoll({...poll, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter poll description (optional)"
              rows={3}
              value={poll.description}
              onChange={(e) => setPoll({...poll, description: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Poll Options *</Label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemoveOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={handleAddOption} 
                className="gap-2"
              >
                <Plus size={16} />
                Add Option
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Voting Settings</CardTitle>
          <CardDescription>Configure how students can participate in this poll</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Multiple Votes</h3>
              <p className="text-sm text-muted-foreground">
                Allow students to select multiple options
              </p>
            </div>
            <Button 
              variant={poll.allowMultipleVotes ? "default" : "outline"}
              onClick={() => setPoll({...poll, allowMultipleVotes: !poll.allowMultipleVotes})}
            >
              {poll.allowMultipleVotes ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Anonymous Voting</h3>
              <p className="text-sm text-muted-foreground">
                Hide voter identities in results
              </p>
            </div>
            <Button 
              variant={poll.anonymousVoting ? "default" : "outline"}
              onClick={() => setPoll({...poll, anonymousVoting: !poll.anonymousVoting})}
            >
              {poll.anonymousVoting ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
          <CardDescription>Select who can participate in this poll</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={poll.targetAudience === "all" ? "default" : "outline"}
                onClick={() => setPoll({...poll, targetAudience: "all"})}
                className="gap-2"
              >
                <Users size={16} />
                All Students
              </Button>
              <Button
                variant={poll.targetAudience === "specific-course" ? "default" : "outline"}
                onClick={() => setPoll({...poll, targetAudience: "specific-course"})}
                className="gap-2"
              >
                <Target size={16} />
                Specific Course
              </Button>
              <Button
                variant={poll.targetAudience === "department" ? "default" : "outline"}
                onClick={() => setPoll({...poll, targetAudience: "department"})}
                className="gap-2"
              >
                <Building size={16} />
                Department
              </Button>
              <Button
                variant={poll.targetAudience === "year" ? "default" : "outline"}
                onClick={() => setPoll({...poll, targetAudience: "year"})}
                className="gap-2"
              >
                <Target size={16} />
                Year Group
              </Button>
            </div>
          </div>
          
          {poll.targetAudience === "specific-course" && (
            <div className="space-y-2">
              <Label htmlFor="course">Select Course</Label>
              <select
                id="course"
                className="w-full p-2 border rounded"
                value={poll.courseId}
                onChange={(e) => setPoll({...poll, courseId: e.target.value})}
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
          
          {poll.targetAudience === "department" && (
            <div className="space-y-2">
              <Label htmlFor="department">Select Department</Label>
              <select
                id="department"
                className="w-full p-2 border rounded"
                value={poll.department}
                onChange={(e) => setPoll({...poll, department: e.target.value})}
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
          
          {poll.targetAudience === "year" && (
            <div className="space-y-2">
              <Label htmlFor="year">Select Year</Label>
              <select
                id="year"
                className="w-full p-2 border rounded"
                value={poll.year}
                onChange={(e) => setPoll({...poll, year: parseInt(e.target.value)})}
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Poll Duration</CardTitle>
          <CardDescription>Set when the poll will close</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={poll.endDate}
              onChange={(e) => setPoll({...poll, endDate: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={poll.endTime}
              onChange={(e) => setPoll({...poll, endTime: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmitPoll} disabled={isSubmitting} className="gap-2">
          <BarChart size={16} />
          {isSubmitting ? "Creating..." : "Create Poll"}
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}