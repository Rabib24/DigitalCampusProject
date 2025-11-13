"use client"

import { ArrowLeft, Mail, Phone, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function AdviseeDetailPage({ adviseeId }: { adviseeId: string }) {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <p className="text-muted-foreground">Ahmed Hassan (STU001)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">ahmed@iub.edu.bd</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+92-300-1234567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Status */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="text-2xl font-bold">3.5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Credits</p>
              <p className="text-lg font-medium">60/120</p>
            </div>
            <Badge variant="default">Good Standing</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { code: "CS301", name: "Data Structures", grade: "A-" },
              { code: "MATH301", name: "Calculus III", grade: "B+" },
              { code: "PHY301", name: "Physics III", grade: "A" },
            ].map((course) => (
              <div key={course.code} className="flex justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{course.code}</p>
                  <p className="text-sm text-muted-foreground">{course.name}</p>
                </div>
                <Badge>{course.grade}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Advisor Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "Maintain current academic performance",
            "Consider taking advanced CS courses next semester",
            "On track for graduation in 2 years",
          ].map((rec, idx) => (
            <div key={idx} className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-blue-900">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Meeting
        </Button>
        <Button variant="outline">Send Message</Button>
      </div>
    </div>
  )
}
