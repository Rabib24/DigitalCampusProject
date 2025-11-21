"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Course = {
  id: string;
  name: string;
  credits: number;
  currentGrade?: string;
  predictedGrade?: string;
};

type GradePrediction = {
  course: string;
  currentGrade?: string;
  predictedGrade: string;
  impact: number;
};

export function CGPACalculatorView() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Data Structures", credits: 3, currentGrade: "B+" },
    { id: "2", name: "Calculus II", credits: 4, currentGrade: "A-" },
    { id: "3", name: "Physics II", credits: 4 },
    { id: "4", name: "English Composition", credits: 3 },
    { id: "5", name: "Economics", credits: 3, currentGrade: "B" },
  ]);

  const [currentCGPA, setCurrentCGPA] = useState(3.45);
  const [targetCGPA, setTargetCGPA] = useState(3.7);
  const [predictions, setPredictions] = useState<GradePrediction[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const gradePoints: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0
  };

  const calculateGPA = (courses: Course[]): number => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.currentGrade) {
        const points = gradePoints[course.currentGrade] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const handleGradeChange = (courseId: string, grade: string, isPredicted: boolean = false) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        if (isPredicted) {
          return { ...course, predictedGrade: grade };
        } else {
          return { ...course, currentGrade: grade };
        }
      }
      return course;
    }));
  };

  const calculatePredictedCGPA = (): number => {
    let totalPoints = currentCGPA * 60; // Assuming 60 credits completed so far
    let totalCredits = 60;

    courses.forEach(course => {
      const grade = course.predictedGrade || course.currentGrade;
      if (grade) {
        const points = gradePoints[grade] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 60 ? totalPoints / totalCredits : currentCGPA;
  };

  const generateRecommendations = () => {
    const predictedCGPA = calculatePredictedCGPA();
    const newPredictions: GradePrediction[] = [];

    courses.forEach(course => {
      if (!course.currentGrade && course.predictedGrade) {
        const currentPoints = currentCGPA * 60;
        const coursePoints = gradePoints[course.predictedGrade] * course.credits;
        const impact = ((currentPoints + coursePoints) / (60 + course.credits)) - currentCGPA;
        
        newPredictions.push({
          course: course.name,
          predictedGrade: course.predictedGrade,
          impact: parseFloat(impact.toFixed(3))
        });
      } else if (course.currentGrade && course.predictedGrade && course.currentGrade !== course.predictedGrade) {
        const currentPoints = currentCGPA * 60;
        const currentCoursePoints = gradePoints[course.currentGrade] * course.credits;
        const newCoursePoints = gradePoints[course.predictedGrade] * course.credits;
        const impact = ((currentPoints - currentCoursePoints + newCoursePoints) / 60) - currentCGPA;
        
        newPredictions.push({
          course: course.name,
          currentGrade: course.currentGrade,
          predictedGrade: course.predictedGrade,
          impact: parseFloat(impact.toFixed(3))
        });
      }
    });

    setPredictions(newPredictions);
    setShowRecommendations(true);
  };

  const predictedCGPA = calculatePredictedCGPA();
  const canReachTarget = predictedCGPA >= targetCGPA;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">CGPA Calculator</h2>
        <p className="text-muted-foreground mt-1">Calculate and predict your cumulative GPA</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Current Courses
              </CardTitle>
              <CardDescription>
                Enter your current or predicted grades for each course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.credits} credits</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.currentGrade && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">{course.currentGrade}</span>
                        </div>
                      )}
                      <div className="w-24">
                        <Select 
                          value={course.predictedGrade || ""} 
                          onValueChange={(value) => handleGradeChange(course.id, value, true)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Predict" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(gradePoints).map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                GPA Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">Current CGPA</div>
                  <div className="text-2xl font-bold text-primary mt-1">{currentCGPA.toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">Predicted CGPA</div>
                  <div className={`text-2xl font-bold mt-1 ${predictedCGPA >= targetCGPA ? 'text-green-600' : 'text-yellow-600'}`}>
                    {predictedCGPA.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <div className="text-sm text-muted-foreground">Target CGPA</div>
                  <div className="text-2xl font-bold text-primary mt-1">{targetCGPA.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="target-cgpa">Set Target CGPA</Label>
                <Input
                  id="target-cgpa"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={generateRecommendations}
                disabled={courses.every(course => !course.predictedGrade && !course.currentGrade)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze & Get Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    {canReachTarget ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        On Track
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Need Improvement
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Gap to Target</div>
                  <div className={`text-lg font-bold ${canReachTarget ? 'text-green-600' : 'text-red-600'}`}>
                    {(predictedCGPA - targetCGPA).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Recommendation</div>
                  <div className="mt-1">
                    {canReachTarget ? (
                      <p className="text-sm">You're on track to meet your target CGPA!</p>
                    ) : (
                      <p className="text-sm">Focus on improving grades in {courses.filter(c => !c.currentGrade || gradePoints[c.currentGrade] < 3.0).length} courses.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {showRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Grade Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="font-medium">{prediction.course}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">
                          {prediction.currentGrade && (
                            <span className="text-muted-foreground line-through mr-2">
                              {prediction.currentGrade}
                            </span>
                          )}
                          <span className="font-medium">{prediction.predictedGrade}</span>
                        </div>
                        <Badge variant={prediction.impact >= 0 ? "secondary" : "destructive"}>
                          {prediction.impact >= 0 ? '+' : ''}{prediction.impact.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {predictions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No significant changes predicted
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Tips for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Focus on courses with lower grades first</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Seek help from professors during office hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Form study groups with high-performing classmates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Utilize campus tutoring services</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}