"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Download, 
  Printer,
  Save,
  Edit,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CourseSyllabusPage({ courseId }: { courseId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [syllabus, setSyllabus] = useState(`Week 1: Introduction to Data Structures
- Course overview and objectives
- Review of prerequisite concepts
- Introduction to complexity analysis

Week 2: Arrays and Linked Lists
- Static vs dynamic memory allocation
- Array operations and limitations
- Singly and doubly linked lists
- Circular linked lists

Week 3: Stacks and Queues
- Stack operations and applications
- Queue operations and variations
- Priority queues
- Implementation techniques

Week 4: Trees
- Binary trees and traversals
- Binary search trees
- AVL trees and balancing
- Tree applications

Week 5: Graphs
- Graph representations
- Graph traversals (BFS, DFS)
- Shortest path algorithms
- Minimum spanning trees

Week 6: Sorting Algorithms
- Bubble sort, selection sort, insertion sort
- Merge sort, quick sort, heap sort
- Complexity analysis of sorting algorithms
- Choosing the right sorting algorithm

Week 7: Searching Algorithms
- Linear search, binary search
- Hash tables and hash functions
- Collision resolution techniques
- Applications of searching algorithms

Week 8: Advanced Topics
- Dynamic programming
- Greedy algorithms
- Backtracking
- Course review and preparation for final exam`);

  const handleSave = () => {
    // In a real app, this would save the syllabus to the backend
    console.log("Saving syllabus:", syllabus);
    setIsEditing(false);
    alert("Syllabus saved successfully!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Syllabus</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Syllabus
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Detailed Syllabus
              </CardTitle>
              <CardDescription>
                Course schedule and learning objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {syllabus}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Instructor</h3>
                  <p className="text-muted-foreground">Dr. Ahmed Khan</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">a.khan@university.edu</p>
                </div>
                <div>
                  <h3 className="font-semibold">Office Hours</h3>
                  <p className="text-muted-foreground">Mon/Wed 2:00-4:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold">Credits</h3>
                  <p className="text-muted-foreground">3 credits</p>
                </div>
                <div>
                  <h3 className="font-semibold">Prerequisites</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary">CS-101</Badge>
                    <Badge variant="secondary">MA-101</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grading Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Assignments</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Midterm Exam</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Exam</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Participation</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Understand fundamental data structures and their implementations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Analyze time and space complexity of algorithms</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Apply appropriate data structures to solve computational problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Implement and evaluate sorting and searching algorithms</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm">Required Textbooks</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    <li>Introduction to Algorithms by Cormen</li>
                    <li>Data Structures and Algorithms in Java by Goodrich</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Online Resources</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    <li>Course website with lecture slides</li>
                    <li>Online coding platform for assignments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}