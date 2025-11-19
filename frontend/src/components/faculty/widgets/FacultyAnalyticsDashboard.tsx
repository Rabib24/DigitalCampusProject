"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

// Mock data for the chart
const analyticsData = [
  { name: "Mon", students: 45 },
  { name: "Tue", students: 52 },
  { name: "Wed", students: 48 },
  { name: "Thu", students: 60 },
  { name: "Fri", students: 55 },
  { name: "Sat", students: 30 },
  { name: "Sun", students: 20 },
];

export function FacultyAnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Weekly Analytics
          </CardTitle>
        </div>
        <CardDescription>Student engagement this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tickMargin={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickMargin={8}
              />
              <Tooltip 
                cursor={{ fill: "hsl(var(--accent))" }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar 
                dataKey="students" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <div className="text-2xl font-bold text-primary">245</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <div className="text-2xl font-bold text-green-500">89%</div>
            <div className="text-sm text-muted-foreground">Avg. Attendance</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-sm text-muted-foreground">Pending Grades</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}