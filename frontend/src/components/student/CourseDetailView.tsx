"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Course } from "@/lib/student/course-enrollment";
import { BookOpen, Users, Clock, CreditCard, Calendar, Check, X, MapPin } from "lucide-react";

interface CourseDetailViewProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (courseId: string) => void;
}

export function CourseDetailView({ course, isOpen, onClose, onAddToCart }: CourseDetailViewProps) {
  if (!course) return null;

  const isWaitlistOnly = course.available_seats === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {course.name}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2 text-base">
                <span className="font-mono bg-muted px-2 py-0.5 rounded text-foreground">{course.code}</span>
                <span>•</span>
                <span className="text-primary font-medium">{course.credits} Credits</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" /> Instructor & Dept
              </h4>
              <div className="text-sm space-y-1 text-muted-foreground pl-6">
                <p>Department: <span className="text-foreground">{course.department}</span></p>
                <p>Instructor ID: <span className="text-foreground">{course.instructor_id}</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" /> Schedule
              </h4>
              <div className="text-sm space-y-1 text-muted-foreground pl-6">
                {course.schedule ? (
                  <>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Days: <span className="text-foreground font-medium">{course.schedule.days}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Time: <span className="text-foreground font-medium">{course.schedule.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Room: <span className="text-foreground font-medium">{course.schedule.room}</span>
                    </p>
                  </>
                ) : (
                  <p>Check syllabus for schedule</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              Prerequisites
            </h4>
            {course.prerequisites && course.prerequisites.length > 0 ? (
              <div className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <span className="font-mono text-sm">{prereq}</span>
                    {course.prereqs_met ? (
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                        <Check className="h-3 w-3 mr-1" /> Met
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
                        <X className="h-3 w-3 mr-1" /> Missing
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No prerequisites required.</p>
            )}
          </div>

          <div className="p-4 rounded-lg bg-accent/20 border border-accent">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Seat Availability</span>
              <span className="text-sm font-bold">
                {course.available_seats} / {course.total_seats}
              </span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${course.available_seats < 5 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${(course.available_seats / course.total_seats) * 100}%` }}
              ></div>
            </div>
            {isWaitlistOnly && (
              <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> Class is full. You will be added to the waitlist.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button
            onClick={() => {
              onAddToCart(course.id);
              onClose();
            }}
            disabled={isWaitlistOnly && !course.available_seats} // Enable waitlist logic later if needed
            className={isWaitlistOnly ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isWaitlistOnly ? "Join Waitlist" : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}