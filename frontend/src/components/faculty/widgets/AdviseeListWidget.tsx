"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, TrendingUp, AlertTriangle } from "lucide-react";

interface Advisee {
  id: number;
  name: string;
  studentId: string;
  cgpa: number;
  status: "good" | "warning" | "at-risk";
}

export function AdviseeListWidget() {
  // This would normally come from an API call
  const advisees: Advisee[] = [
    { id: 1, name: "Ahmed Khan", studentId: "S2024001", cgpa: 3.75, status: "good" },
    { id: 2, name: "Fatima Rahman", studentId: "S2024002", cgpa: 3.2, status: "warning" },
    { id: 3, name: "Mahmudul Hasan", studentId: "S2024003", cgpa: 2.8, status: "at-risk" },
  ];

  const getStatusIcon = (status: Advisee["status"]) => {
    switch (status) {
      case "good":
        return <TrendingUp size={16} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case "at-risk":
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <TrendingUp size={16} className="text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            My Advisees
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus size={16} />
            Add
          </Button>
        </div>
        <CardDescription>Academic advising overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advisees.map((advisee) => (
            <div key={advisee.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5">
              <div>
                <div className="font-medium">{advisee.name}</div>
                <div className="text-sm text-muted-foreground">{advisee.studentId}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  CGPA: <span className="font-medium">{advisee.cgpa.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(advisee.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}