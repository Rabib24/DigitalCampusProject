"use client"

import { Calculator, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export function CGPASimulatorView() {
  const [currentCGPA, setCurrentCGPA] = useState("3.2")
  const [projectedGrade, setProjectedGrade] = useState("A")
  const [credits, setCredits] = useState("3")

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">CGPA Simulator</h1>
        <p className="text-muted-foreground">Plan retakes and course strategy</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Use this tool to simulate different grading scenarios for advisees</AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current CGPA</Label>
              <Input type="number" value={currentCGPA} onChange={(e) => setCurrentCGPA(e.target.value)} step="0.01" />
            </div>

            <div>
              <Label>Projected Grade</Label>
              <Select value={projectedGrade} onValueChange={setProjectedGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A (4.0)</SelectItem>
                  <SelectItem value="A-">A- (3.7)</SelectItem>
                  <SelectItem value="B+">B+ (3.3)</SelectItem>
                  <SelectItem value="B">B (3.0)</SelectItem>
                  <SelectItem value="B-">B- (2.7)</SelectItem>
                  <SelectItem value="C+">C+ (2.3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Credits</Label>
              <Input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} />
            </div>

            <Button className="w-full gap-2">
              <Calculator className="h-4 w-4" />
              Calculate CGPA
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Projected Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">New CGPA</p>
              <p className="text-3xl font-bold text-primary">3.45</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Impact: +0.25</p>
              <div className="space-y-2 text-sm">
                <p>
                  Current CGPA: <span className="font-medium">{currentCGPA}</span>
                </p>
                <p>
                  Grade: <span className="font-medium">{projectedGrade}</span>
                </p>
                <p>
                  Credits: <span className="font-medium">{credits}</span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">Above academic probation threshold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Focus on improving grades in quantitative courses",
            "Consider retaking low-scoring courses (C, D grades)",
            "Projected to graduate with distinction if maintains B+ average",
            "Current trajectory suggests on-time graduation",
          ].map((rec, idx) => (
            <div key={idx} className="flex gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
