"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  Users, 
  BookOpen, 
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "assignment" | "announcement" | "discussion" | "grade" | "meeting" | "research";
  title: string;
  description: string;
  time: string;
  course?: string;
  priority: "low" | "medium" | "high";
  status: "completed" | "pending" | "overdue";
}

interface FacultyRecentActivityProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "assignment": return <FileText className="h-4 w-4" />;
    case "announcement": return <Bell className="h-4 w-4" />;
    case "discussion": return <MessageSquare className="h-4 w-4" />;
    case "grade": return <TrendingUp className="h-4 w-4" />;
    case "meeting": return <Users className="h-4 w-4" />;
    case "research": return <BookOpen className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

const getActivityVariant = (type: string) => {
  switch (type) {
    case "assignment": return "default";
    case "announcement": return "secondary";
    case "discussion": return "outline";
    case "grade": return "default";
    case "meeting": return "secondary";
    case "research": return "outline";
    default: return "default";
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "high": return "destructive";
    case "medium": return "default";
    case "low": return "secondary";
    default: return "secondary";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed": return "default";
    case "pending": return "secondary";
    case "overdue": return "destructive";
    default: return "secondary";
  }
};

export default function FacultyRecentActivity({
  activities,
  onViewAll
}: FacultyRecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.status === "completed" ? "bg-green-500/10" : activity.status === "overdue" ? "bg-red-500/10" : "bg-muted"}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm">{activity.title}</h3>
                    <Badge variant={getPriorityVariant(activity.priority)}>
                      {activity.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  {activity.course && (
                    <div className="flex items-center gap-1 mt-1">
                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.course}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No recent activity</h3>
              <p className="text-sm text-muted-foreground">
                Your recent actions will appear here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}