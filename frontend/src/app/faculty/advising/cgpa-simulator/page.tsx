"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Target,
  AlertCircle
} from "lucide-react";
import { FacultyAdvisee } from "@/types/faculty";

interface CourseGrade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  currentGrade?: string;
  projectedGrade?: string;
}

interface SimulationResult {
  currentGPA: number;
  projectedGPA: number;
  gpaChange: number;
  graduationEligible: boolean;
  creditsNeeded: number;
}

export default function CGPASimulatorPage() {
  const [advisee] = useState<FacultyAdvisee>({
    id: "1",
    studentId: "S123456",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@university.edu",
    program: "Computer Science",
    year: 3,
    gpa: 3.75
  });

  const [courses, setCourses] = useState<CourseGrade[]>([
    {
      id: "1",
      courseCode: "CS-301",
      courseName: "Data Science and Machine Learning",
      credits: 4,
      currentGrade: "A-",
      projectedGrade: "A"
    },
    {
      id: "2",
      courseCode: "CS-305",
      courseName: "Software Engineering",
      credits: 3,
      currentGrade: "B+",
      projectedGrade: "A-"
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    credits: 3
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const gradePoints: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  };

  const handleAddCourse = () => {
    if (!newCourse.courseCode || !newCourse.courseName) {
      alert("Please fill in all required fields");
      return;
    }

    const course: CourseGrade = {
      id: (courses.length + 1).toString(),
      courseCode: newCourse.courseCode,
      courseName: newCourse.courseName,
      credits: newCourse.credits,
      projectedGrade: "A"
    };

    setCourses([...courses, course]);
    setNewCourse({
      courseCode: "",
      courseName: "",
      credits: 3
    });
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const handleGradeChange = (id: string, grade: string, type: "current" | "projected") => {
    setCourses(courses.map(course => 
      course.id === id 
        ? { 
            ...course, 
            ...(type === "current" ? { currentGrade: grade } : { projectedGrade: grade })
          } 
        : course
    ));
  };

  const calculateGPA = (grades: { credits: number; grade: string }[]) => {
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach(({ credits, grade }) => {
      const points = gradePoints[grade] || 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const runSimulation = () => {
    // Current GPA calculation (based on existing grades)
    const currentGrades = courses
      .filter(course => course.currentGrade)
      .map(course => ({
        credits: course.credits,
        grade: course.currentGrade!
      }));
    
    const currentGPA = calculateGPA(currentGrades);

    // Projected GPA calculation (based on projected grades)
    const projectedGrades = courses.map(course => ({
      credits: course.credits,
      grade: course.projectedGrade || "A"
    }));
    
    const projectedGPA = calculateGPA(projectedGrades);
    
    const gpaChange = projectedGPA - currentGPA;
    
    // For graduation eligibility, assuming 3.0 GPA requirement and 120 credits needed
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const creditsNeeded = Math.max(0, 120 - totalCredits);
    const graduationEligible = projectedGPA >= 3.0 && creditsNeeded === 0;

    setSimulationResult({
      currentGPA: parseFloat(currentGPA.toFixed(2)),
      projectedGPA: parseFloat(projectedGPA.toFixed(2)),
      gpaChange: parseFloat(gpaChange.toFixed(2)),
      graduationEligible,
      creditsNeeded
    });
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-500";
    if (gpa >= 3.0) return "text-blue-500";
    if (gpa >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CGPA Simulator</h1>
          <p className="text-muted-foreground">{advisee.firstName} {advisee.lastName} - Academic Planning</p>
        </div>
        <Button onClick={runSimulation} className="gap-2">
          <Calculator size={18} />
          Run Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Current GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGpaColor(advisee.gpa)}`}>
              {advisee.gpa.toFixed(2)}
            </div>
            <div className="text-muted-foreground">Student record</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={20} />
              Projected GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${simulationResult ? getGpaColor(simulationResult.projectedGPA) : 'text-muted-foreground'}`}>
              {simulationResult ? simulationResult.projectedGPA.toFixed(2) : "-"}
            </div>
            <div className="text-muted-foreground">Based on projections</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              GPA Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${simulationResult ? getChangeColor(simulationResult.gpaChange) : 'text-muted-foreground'}`}>
              {simulationResult ? (simulationResult.gpaChange >= 0 ? '+' : '') + simulationResult.gpaChange.toFixed(2) : "-"}
            </div>
            <div className="text-muted-foreground">Improvement/decline</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Graduation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {simulationResult ? (simulationResult.graduationEligible ? "Eligible" : "Not Eligible") : "-"}
            </div>
            <div className="text-muted-foreground">
              {simulationResult ? `${simulationResult.creditsNeeded} credits needed` : "Run simulation"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Add Course
            </CardTitle>
            <CardDescription>Add courses to simulate their impact on GPA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS-401"
                  value={newCourse.courseCode}
                  onChange={(e) => setNewCourse({...newCourse, courseCode: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <select
                  id="credits"
                  className="w-full p-2 border rounded"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5, 6].map(credit => (
                    <option key={credit} value={credit}>{credit} credit{credit > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Capstone Project"
                  value={newCourse.courseName}
                  onChange={(e) => setNewCourse({...newCourse, courseName: e.target.value})}
                />
              </div>
            </div>
            
            <Button onClick={handleAddCourse} className="gap-2">
              <Plus size={16} />
              Add Course
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Instructions</CardTitle>
            <CardDescription>How to use the CGPA simulator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium">Add Courses</p>
                  <p className="text-sm text-muted-foreground">Add current and future courses to the simulation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium">Set Grades</p>
                  <p className="text-sm text-muted-foreground">Select current and projected grades for each course</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium">Run Simulation</p>
                  <p className="text-sm text-muted-foreground">Click the Run Simulation button to see projected outcomes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>Set current and projected grades for simulation</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{course.courseCode}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{course.courseName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{course.credits} credits</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCourse(course.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label>Current Grade</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={course.currentGrade || ""}
                        onChange={(e) => handleGradeChange(course.id, e.target.value, "current")}
                      >
                        <option value="">Not graded yet</option>
                        {Object.keys(gradePoints).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Projected Grade</Label>
                      <select
                        className="w-full p-2 border rounded"
                        value={course.projectedGrade || "A"}
                        onChange={(e) => handleGradeChange(course.id, e.target.value, "projected")}
                      >
                        {Object.keys(gradePoints).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No courses added</h3>
              <p className="text-sm text-muted-foreground">
                Add courses to begin simulating GPA outcomes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {simulationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={20} />
              Simulation Results
            </CardTitle>
            <CardDescription>Detailed analysis of GPA projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Current GPA</div>
                <div className={`text-2xl font-bold ${getGpaColor(simulationResult.currentGPA)}`}>
                  {simulationResult.currentGPA.toFixed(2)}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Projected GPA</div>
                <div className={`text-2xl font-bold ${getGpaColor(simulationResult.projectedGPA)}`}>
                  {simulationResult.projectedGPA.toFixed(2)}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">GPA Change</div>
                <div className={`text-2xl font-bold ${getChangeColor(simulationResult.gpaChange)}`}>
                  {(simulationResult.gpaChange >= 0 ? '+' : '') + simulationResult.gpaChange.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {simulationResult.graduationEligible ? (
                  <Target className="text-green-500" size={20} />
                ) : (
                  <AlertCircle className="text-yellow-500" size={20} />
                )}
                <span className="font-medium">
                  {simulationResult.graduationEligible 
                    ? "On track for graduation!" 
                    : "Additional work needed for graduation"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {simulationResult.graduationEligible
                  ? "Student meets GPA and credit requirements for graduation"
                  : `Student needs ${simulationResult.creditsNeeded} more credits and a minimum 3.0 GPA to graduate`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}