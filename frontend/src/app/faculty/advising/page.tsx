"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, TrendingUp, AlertTriangle, Search, Filter } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Advisee {
  id: number;
  studentId: string;
  name: string;
  email: string;
  cgpa: number;
  creditsCompleted: number;
  program: string;
  status: "good" | "warning" | "at-risk";
  nextAppointment?: string;
}

export default function FacultyAdvisingPage() {
  const router = useRouter();
  const { state } = useFaculty();
  const [advisees, setAdvisees] = useState<Advisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // In a real implementation, we would fetch advisee data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAdvisees([
        {
          id: 1,
          studentId: "S2024001",
          name: "Ahmed Khan",
          email: "ahmed.khan@student.university.edu",
          cgpa: 3.75,
          creditsCompleted: 95,
          program: "Computer Science",
          status: "good"
        },
        {
          id: 2,
          studentId: "S2024002",
          name: "Fatima Rahman",
          email: "fatima.r@student.university.edu",
          cgpa: 3.2,
          creditsCompleted: 82,
          program: "Software Engineering",
          status: "warning"
        },
        {
          id: 3,
          studentId: "S2024003",
          name: "Mahmudul Hasan",
          email: "mahmudul.h@student.university.edu",
          cgpa: 2.8,
          creditsCompleted: 75,
          program: "Information Technology",
          status: "at-risk"
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusVariant = (status: Advisee["status"]) => {
    switch (status) {
      case "good":
        return "default";
      case "warning":
        return "secondary";
      case "at-risk":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: Advisee["status"]) => {
    switch (status) {
      case "good":
        return <TrendingUp size={16} />;
      case "warning":
        return <AlertTriangle size={16} />;
      case "at-risk":
        return <AlertTriangle size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  const filteredAdvisees = advisees.filter(advisee => 
    advisee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisee.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Academic Advising</h1>
          <p className="text-muted-foreground">Manage your advisees and academic progress</p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => router.push("/faculty/advising/schedule")}
        >
          <Plus size={18} />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Advisees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{advisees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {advisees.filter(a => a.status === "at-risk").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>My Advisees</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search advisees..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage your academic advisees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAdvisees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">
                {searchTerm ? "No advisees found" : "No advisees assigned"}
              </CardTitle>
              <CardDescription className="mt-2">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "You don't have any advisees assigned to you yet"}
              </CardDescription>
              <Button className="mt-4 gap-2">
                <Users size={16} />
                Request Advisee Assignment
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAdvisees.map((advisee) => (
                <div key={advisee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {advisee.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{advisee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {advisee.studentId} • {advisee.program}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">CGPA: {advisee.cgpa.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {advisee.creditsCompleted} credits
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(advisee.status)} className="flex items-center gap-1">
                      {getStatusIcon(advisee.status)}
                      {advisee.status.charAt(0).toUpperCase() + advisee.status.slice(1)}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => router.push(`/faculty/advising/advisees/${advisee.id}`)}
                    >
                      <Calendar size={16} />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}