"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Calendar, TrendingUp, AlertTriangle, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyAdvisees } from "@/lib/faculty/api";

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

export function FacultyAdvisingView() {
  const router = useRouter();
  const [advisees, setAdvisees] = useState<Advisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAdvisees: 0,
    atRiskStudents: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    const fetchAdvisees = async () => {
      try {
        setLoading(true);
        const data = await getFacultyAdvisees();
        setAdvisees(data.advisees || []);
        
        // Calculate stats
        const atRiskCount = data.advisees?.filter((a: Advisee) => a.status === "at-risk").length || 0;
        setStats({
          totalAdvisees: data.advisees?.length || 0,
          atRiskStudents: atRiskCount,
          pendingAppointments: 0 // Placeholder
        });
      } catch (err) {
        setError("Failed to load advisees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisees();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Academic Advising</h2>
          <p className="text-muted-foreground mt-1">Manage your advisees and academic progress</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
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
            <div className="text-3xl font-bold text-primary">{stats.totalAdvisees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.atRiskStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.pendingAppointments}</div>
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
                <Input placeholder="Search advisees..." className="pl-8" />
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
          {advisees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">No advisees assigned</CardTitle>
              <CardDescription className="mt-2">
                You don&apos;t have any advisees assigned to you yet.
              </CardDescription>
              <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
                <Users size={16} />
                Request Advisee Assignment
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {advisees.map((advisee) => (
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
                      onClick={() => router.push(`/faculty/advising/${advisee.id}`)}
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
  );
}