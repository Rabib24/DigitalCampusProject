"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Save, 
  Upload, 
  Download, 
  Eye,
  History,
  AlertCircle
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";

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

export default function CourseSyllabusPage() {
  const [course] = useState<FacultyCourse>(mockCourse);
  const [syllabus, setSyllabus] = useState(`# ${course.code}: ${course.name}

## Course Description
This course provides a comprehensive introduction to data science and machine learning concepts. Students will learn to analyze large datasets, apply statistical methods, and implement machine learning algorithms to solve real-world problems.

## Prerequisites
- CS-201: Data Structures and Algorithms
- MATH-201: Linear Algebra
- STAT-201: Probability and Statistics

## Learning Objectives
By the end of this course, students will be able to:
1. Understand fundamental concepts in data science and machine learning
2. Apply statistical methods to analyze datasets
3. Implement and evaluate machine learning algorithms
4. Use Python libraries such as pandas, scikit-learn, and TensorFlow
5. Interpret and communicate results effectively

## Course Schedule
| Week | Topic | Readings | Assignments |
|------|-------|----------|-------------|
| 1 | Introduction to Data Science | Chapter 1 | - |
| 2 | Data Cleaning and Preprocessing | Chapter 2 | HW1 |
| 3 | Exploratory Data Analysis | Chapter 3 | - |
| 4 | Statistical Inference | Chapter 4 | Quiz 1 |
| 5 | Linear Regression | Chapter 5 | HW2 |
| 6 | Classification | Chapter 6 | - |
| 7 | Model Evaluation | Chapter 7 | Midterm |
| 8 | Decision Trees and Random Forests | Chapter 8 | HW3 |
| 9 | Support Vector Machines | Chapter 9 | - |
| 10 | Neural Networks | Chapter 10 | Quiz 2 |
| 11 | Deep Learning | Chapter 11 | Project Proposal |
| 12 | Natural Language Processing | Chapter 12 | - |
| 13 | Clustering | Chapter 13 | HW4 |
| 14 | Dimensionality Reduction | Chapter 14 | - |
| 15 | Review and Presentations | - | Final Project |

## Grading Policy
- Homework Assignments: 30%
- Quizzes: 20%
- Midterm Exam: 20%
- Final Project: 30%

## Required Textbooks
1. "Python for Data Analysis" by Wes McKinney
2. "Hands-On Machine Learning" by Aurélien Géron

## Recommended Resources
- Online tutorials and documentation
- Research papers and articles
- Kaggle competitions

## Office Hours
Tuesday and Thursday: 2:00 PM - 4:00 PM
By appointment: Contact via email

## Academic Integrity
All work submitted must be your own. Collaboration is encouraged for learning, but all assignments must be completed individually unless otherwise specified.

## Accommodation Policy
Students with disabilities should contact the Office of Disability Services to arrange accommodations.
`);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSyllabus = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert("Syllabus saved successfully!");
    }, 1000);
  };

  const handlePublishSyllabus = () => {
    // In a real app, you would update the syllabus status
    alert("Syllabus published to students!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Course Syllabus</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSyllabus} disabled={isSaving} className="gap-2">
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-2">
                <History size={16} />
                Revision History
              </Button>
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Export PDF
              </Button>
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <FileText size={16} />
                Edit Syllabus
              </Button>
              <Button onClick={handlePublishSyllabus} className="gap-2">
                <Eye size={16} />
                Publish to Students
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Syllabus Content</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Edit your course syllabus below" 
                  : "Review your course syllabus"}
              </CardDescription>
            </div>
            {!isEditing && (
              <Badge variant="default">
                Published
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="syllabus-content">Syllabus Content</Label>
                <Textarea
                  id="syllabus-content"
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle size={16} />
                <span>You can use Markdown formatting for rich text</span>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans">{syllabus}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>Upload or link additional course materials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Syllabus PDF</h3>
              <p className="text-sm text-muted-foreground">Upload a PDF version of your syllabus</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Upload size={16} />
              Upload
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Course Website</h3>
              <p className="text-sm text-muted-foreground">Link to external course website</p>
            </div>
            <Button variant="outline">Add Link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}