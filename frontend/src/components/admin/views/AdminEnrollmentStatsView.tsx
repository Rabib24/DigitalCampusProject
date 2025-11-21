"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminEnrollmentStatsView() {
  // Sample data for charts
  const enrollmentData = [
    { semester: "Spring 2023", enrolled: 1200, dropped: 45 },
    { semester: "Fall 2023", enrolled: 1350, dropped: 38 },
    { semester: "Spring 2024", enrolled: 1420, dropped: 32 },
    { semester: "Fall 2024", enrolled: 1580, dropped: 28 },
  ];

  const departmentData = [
    { department: "Computer Science", enrollment: 320 },
    { department: "Mathematics", enrollment: 280 },
    { department: "Physics", enrollment: 210 },
    { department: "Biology", enrollment: 190 },
    { department: "Chemistry", enrollment: 180 },
    { department: "English", enrollment: 150 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enrollment Statistics</h1>
        <p className="text-muted-foreground">
          Track enrollment trends and departmental distribution.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Semester-by-semester enrollment and drop rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#8884d8" name="Enrolled Students" />
                <Bar dataKey="dropped" fill="#82ca9d" name="Dropped Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Student enrollment by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="enrollment" fill="#8884d8" name="Enrolled Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment Growth</CardTitle>
          <CardDescription>Year-over-year enrollment growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enrolled" stroke="#8884d8" name="Total Enrollment" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}