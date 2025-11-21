"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingUp
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorWhatIfScenarioView() {
  const scenarioStats = [
    {
      title: "Total Scenarios",
      value: "89",
      change: "+12 from last month",
      icon: Calculator
    },
    {
      title: "Students Analyzed",
      value: "67",
      change: "+8 from last week",
      icon: TrendingUp
    },
    {
      title: "Avg. GPA Impact",
      value: "+0.32",
      change: "+0.05 from last term",
      icon: Calculator
    },
    {
      title: "Success Rate",
      value: "84%",
      change: "+3% from last term",
      icon: TrendingUp
    }
  ];

  const gpaProjection = [
    { semester: "Current", gpa: 3.2 },
    { semester: "Scenario 1", gpa: 3.4 },
    { semester: "Scenario 2", gpa: 3.5 },
    { semester: "Scenario 3", gpa: 3.6 }
  ];

  const scenarios = [
    { 
      id: "SCN-001", 
      student: "John Doe", 
      currentGPA: 3.2,
      projectedGPA: 3.5,
      courses: ["Calculus II", "Physics II"],
      credits: 8,
      status: "Completed"
    },
    { 
      id: "SCN-002", 
      student: "Jane Smith", 
      currentGPA: 3.6,
      projectedGPA: 3.8,
      courses: ["Organic Chemistry", "Biology II"],
      credits: 6,
      status: "In Progress"
    },
    { 
      id: "SCN-003", 
      student: "Robert Johnson", 
      currentGPA: 2.8,
      projectedGPA: 3.2,
      courses: ["Statistics", "Computer Science II"],
      credits: 7,
      status: "Pending"
    },
    { 
      id: "SCN-004", 
      student: "Emily Davis", 
      currentGPA: 3.4,
      projectedGPA: 3.7,
      courses: ["Research Methods", "Advanced Mathematics"],
      credits: 9,
      status: "Completed"
    },
    { 
      id: "SCN-005", 
      student: "Michael Wilson", 
      currentGPA: 3.0,
      projectedGPA: 3.3,
      courses: ["Economics", "Business Analytics"],
      credits: 6,
      status: "In Progress"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">What-if Scenario Planner</h1>
        <p className="text-muted-foreground">
          Analyze potential academic outcomes based on different course selections and performance scenarios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {scenarioStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>GPA Projection Scenarios</CardTitle>
            <CardDescription>
              Projected GPA based on different academic scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gpaProjection}>
                <XAxis dataKey="semester" />
                <YAxis domain={[3.0, 4.0]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#3b82f6" 
                  name="Projected GPA" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common scenario planning tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Calculator className="mr-2 h-4 w-4" />
                Create New Scenario
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Scenarios
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Student
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Scenarios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Scenarios</CardTitle>
          <CardDescription>
            List of what-if scenarios for student academic planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{scenario.student}</p>
                  <p className="text-xs text-muted-foreground">{scenario.id}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scenario.courses.map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current GPA</p>
                    <p className="text-sm font-medium">{scenario.currentGPA}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Projected GPA</p>
                    <p className="text-sm font-medium">{scenario.projectedGPA}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="text-sm font-medium">{scenario.credits}</p>
                  </div>
                  <Badge 
                    variant={
                      scenario.status === "Completed" 
                        ? "default" 
                        : scenario.status === "In Progress" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {scenario.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}