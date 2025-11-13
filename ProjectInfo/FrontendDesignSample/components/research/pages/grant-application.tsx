"use client"

import { ArrowLeft, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function GrantApplicationPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Grant Application</h1>
        <p className="text-muted-foreground">Submit a new research grant proposal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Project Title</Label>
            <Input placeholder="Enter project title..." />
          </div>

          <div>
            <Label>Funding Agency</Label>
            <select className="w-full px-3 py-2 border rounded-md mt-1">
              <option>HEC Pakistan</option>
              <option>World Bank</option>
              <option>NSF International</option>
            </select>
          </div>

          <div>
            <Label>Requested Amount (PKR)</Label>
            <Input type="number" placeholder="Amount..." />
          </div>

          <div>
            <Label>Project Description</Label>
            <Textarea placeholder="Detailed project description..." className="min-h-[120px]" />
          </div>

          <div>
            <Label>Objectives</Label>
            <Textarea placeholder="List project objectives..." className="min-h-[100px]" />
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
