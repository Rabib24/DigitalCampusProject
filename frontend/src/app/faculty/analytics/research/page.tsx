"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  LineChart,
  PieChart
} from "lucide-react";

interface ResearchMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
}

interface Publication {
  id: string;
  title: string;
  journal: string;
  date: string;
  citations: number;
  impactFactor: number;
}

interface Collaboration {
  id: string;
  name: string;
  institution: string;
  project: string;
  startDate: string;
  status: "active" | "completed" | "pending";
}

export default function ResearchOutputDashboard() {
  const [metrics, setMetrics] = useState<ResearchMetric[]>([
    {
      id: "1",
      title: "Total Publications",
      value: 24,
      change: 12,
      trend: "up"
    },
    {
      id: "2",
      title: "Citation Count",
      value: 428,
      change: 65,
      trend: "up"
    },
    {
      id: "3",
      title: "H-Index",
      value: 18,
      change: 3,
      trend: "up"
    },
    {
      id: "4",
      title: "Research Projects",
      value: 8,
      change: 2,
      trend: "up"
    }
  ]);

  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "1",
      title: "Machine Learning Approaches for Healthcare Predictive Analytics",
      journal: "Journal of Medical Informatics",
      date: "2023-09-15",
      citations: 24,
      impactFactor: 4.2
    },
    {
      id: "2",
      title: "A Comprehensive Review of AI in Medicine",
      journal: "AI in Medicine",
      date: "2023-11-20",
      citations: 12,
      impactFactor: 3.8
    },
    {
      id: "3",
      title: "Deep Learning for Medical Image Analysis",
      journal: "Medical Image Analysis",
      date: "2023-07-10",
      citations: 38,
      impactFactor: 5.1
    }
  ]);

  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: "1",
      name: "Dr. John Doe",
      institution: "Stanford University",
      project: "Machine Learning in Healthcare",
      startDate: "2023-06-01",
      status: "active"
    },
    {
      id: "2",
      name: "Prof. Alice Johnson",
      institution: "MIT",
      project: "Quantum Computing Applications",
      startDate: "2023-09-15",
      status: "active"
    },
    {
      id: "3",
      name: "Dr. Robert Brown",
      institution: "Harvard University",
      project: "Data Privacy in Research",
      startDate: "2023-01-10",
      status: "completed"
    }
  ]);

  const [timeRange, setTimeRange] = useState("year");
  const [chartType, setChartType] = useState("bar");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "pending": return "outline";
      default: return "default";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp size={16} className="text-green-500" />;
      case "down": return <TrendingUp size={16} className="text-red-500 rotate-180" />;
      default: return <TrendingUp size={16} className="text-muted-foreground" />;
    }
  };

  const getCitationData = () => {
    return [
      { month: "Jan", citations: 15 },
      { month: "Feb", citations: 22 },
      { month: "Mar", citations: 18 },
      { month: "Apr", citations: 25 },
      { month: "May", citations: 30 },
      { month: "Jun", citations: 28 },
      { month: "Jul", citations: 35 },
      { month: "Aug", citations: 42 },
      { month: "Sep", citations: 38 },
      { month: "Oct", citations: 45 },
      { month: "Nov", citations: 52 },
      { month: "Dec", citations: 48 }
    ];
  };

  const getPublicationData = () => {
    return [
      { year: "2020", publications: 3 },
      { year: "2021", publications: 5 },
      { year: "2022", publications: 8 },
      { year: "2023", publications: 8 }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Research Output Dashboard</h1>
          <p className="text-muted-foreground">Track your research impact and productivity</p>
        </div>
        <div className="flex gap-2">
          <select
            className="p-2 border rounded"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(metric.trend)}
                <span className={metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-red-500" : "text-muted-foreground"}>
                  {metric.change > 0 ? '+' : ''}{metric.change} this period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Citations Over Time
                </CardTitle>
                <CardDescription>Monthly citation count</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={chartType === "bar" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart size={16} />
                </Button>
                <Button 
                  variant={chartType === "line" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <LineChart size={16} />
                </Button>
                <Button 
                  variant={chartType === "pie" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setChartType("pie")}
                >
                  <PieChart size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  {chartType === "bar" && "Bar chart visualization would appear here"}
                  {chartType === "line" && "Line chart visualization would appear here"}
                  {chartType === "pie" && "Pie chart visualization would appear here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing citation trends over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Publication Impact
            </CardTitle>
            <CardDescription>Impact factors of recent publications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Impact factor visualization would appear here
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing publication impact metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Recent Publications
                </CardTitle>
                <CardDescription>Your latest research publications</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{pub.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{pub.journal}</span>
                        <span>•</span>
                        <span>{new Date(pub.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      IF: {pub.impactFactor}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText size={14} className="text-muted-foreground" />
                      <span>{pub.citations} citations</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Research Collaborations
                </CardTitle>
                <CardDescription>Active and completed collaborations</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborations.map((collab) => (
                <div key={collab.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{collab.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {collab.institution}
                      </div>
                      <div className="text-sm mt-1">
                        Project: {collab.project}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(collab.status)}>
                      {collab.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-muted-foreground" />
                      <span>Started: {new Date(collab.startDate).toLocaleDateString()}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart size={20} />
            Research Metrics Summary
          </CardTitle>
          <CardDescription>Comprehensive overview of your research output</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Publication Types</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Journal Articles</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span>Conference Papers</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span>Book Chapters</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Citation Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Self-citations</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="flex justify-between">
                  <span>External citations</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average per paper</span>
                  <span className="font-medium">17.8</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Collaboration Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>International</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Domestic</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Institutional</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}