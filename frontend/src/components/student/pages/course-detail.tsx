"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, MessageCircle, Video, FileText, Users } from "lucide-react";

interface CourseDetailPageProps {
  courseId: string;
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const router = useRouter();

  const course = {
    id: courseId,
    code: "CS-203",
    name: "Data Structures and Algorithms",
    instructor: "Dr. Ahmed Khan",
    credits: 3,
    semester: "Fall 2024",
    description: "Master fundamental data structures and algorithm design principles.",
    resources: 42,
    students: 85,
  };

  const syllabus = [
    { week: 1, topic: "Introduction to Data Structures", covered: true },
    { week: 2, topic: "Arrays and Linked Lists", covered: true },
    { week: 3, topic: "Stacks and Queues", covered: true },
    { week: 4, topic: "Trees and Graphs", covered: false },
  ];

  const notes = [
    { id: 1, title: "Lecture 1: Fundamentals", date: "2024-09-01", pages: 12 },
    { id: 2, title: "Lecture 2: Arrays", date: "2024-09-08", pages: 15 },
    { id: 3, title: "Lecture 3: Linked Lists", date: "2024-09-15", pages: 18 },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge>{course.semester}</Badge>
          <span className="text-muted-foreground">{course.code}</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
        <p className="text-muted-foreground mb-4">{course.description}</p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span>{course.students} Students</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <span>{course.credits} Credits</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{course.instructor}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="syllabus" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="syllabus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syllabus.map((item) => (
                  <div key={item.week} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Week {item.week}</p>
                      <p className="text-sm text-muted-foreground">{item.topic}</p>
                    </div>
                    <Badge variant={item.covered ? "default" : "outline"}>
                      {item.covered ? "Covered" : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid gap-3">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{note.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {note.date} • {note.pages} pages
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <Video size={18} />
                {course.resources} Video Lectures
              </Button>
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <FileText size={18} />
                Course Materials &amp; Textbooks
              </Button>
              <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                <MessageCircle size={18} />
                Discussion Forum
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
