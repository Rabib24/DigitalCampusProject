"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Video, BarChart3, Calendar, MessageCircle } from "lucide-react";

export function FacultyQuickActions() {
  const router = useRouter();
  
  const actions = [
    { 
      id: 1, 
      label: "Create Assignment", 
      icon: <FileText size={18} />, 
      color: "bg-blue-500",
      onClick: () => router.push('/faculty/assignments')
    },
    { 
      id: 2, 
      label: "Schedule Class", 
      icon: <Calendar size={18} />, 
      color: "bg-green-500",
      onClick: () => router.push('/faculty/schedule')
    },
    { 
      id: 3, 
      label: "Start Recording", 
      icon: <Video size={18} />, 
      color: "bg-purple-500",
      onClick: () => router.push('/faculty/recordings')
    },
    { 
      id: 4, 
      label: "Grade Submissions", 
      icon: <BarChart3 size={18} />, 
      color: "bg-orange-500",
      onClick: () => router.push('/faculty/gradebook')
    },
    { 
      id: 5, 
      label: "Schedule Advising", 
      icon: <Users size={18} />, 
      color: "bg-pink-500",
      onClick: () => router.push('/faculty/advising')
    },
    { 
      id: 6, 
      label: "Send Announcement", 
      icon: <MessageCircle size={18} />, 
      color: "bg-teal-500",
      onClick: () => router.push('/faculty/announcements')
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}