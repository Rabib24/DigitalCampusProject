"use client"

import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function AdviseeProgressTrackingPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Advisee Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor student academic progress</p>
      </div>

      <div className="space-y-4">
        {[
          { name: "Ahmed Hassan", cgpa: 3.5, completed: 60, total: 120, status: "on-track" },
          { name: "Sarah Khan", cgpa: 2.8, completed: 45, total: 120, status: "warning" },
          { name: "Maria Santos", cgpa: 3.2, completed: 72, total: 120, status: "on-track" },
        ].map((student, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">CGPA: {student.cgpa}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${student.status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                  >
                    {student.status === "warning" ? "Needs Support" : "On Track"}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>
                      {student.completed}/{student.total} Credits
                    </span>
                  </div>
                  <Progress value={(student.completed / student.total) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
