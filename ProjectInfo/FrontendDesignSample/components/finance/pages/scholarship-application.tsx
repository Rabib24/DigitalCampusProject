"use client"

import { ArrowLeft, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function ScholarshipApplicationPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Scholarship Application</h1>
        <p className="text-muted-foreground">Apply for available scholarships</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Scholarship Type</Label>
            <select className="w-full px-3 py-2 border rounded-md mt-1">
              <option>Merit-based Scholarship</option>
              <option>Need-based Aid</option>
              <option>Minority Scholarship</option>
            </select>
          </div>

          <div>
            <Label>Academic Performance (CGPA)</Label>
            <Input type="number" placeholder="3.5" step="0.01" />
          </div>

          <div>
            <Label>Financial Need Statement</Label>
            <Textarea placeholder="Explain your financial situation..." className="min-h-[120px]" />
          </div>

          <div>
            <Label>Supporting Documents</Label>
            <input type="file" multiple className="w-full px-3 py-2 border rounded-md mt-1" />
          </div>

          <Button className="w-full gap-2">
            <Send className="h-4 w-4" />
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
