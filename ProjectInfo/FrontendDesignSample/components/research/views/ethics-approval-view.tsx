"use client"

import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function EthicsApprovalView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Ethics Approval</h1>
        <p className="text-muted-foreground">Review research ethics applications</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { project: "Human Trial Research", status: "under-review", daysWaiting: 15 },
            { project: "Survey Methodology", status: "pending", daysWaiting: 8 },
            { project: "Data Collection Study", status: "pending", daysWaiting: 22 },
          ].map((app, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{app.project}</p>
                  <p className="text-sm text-muted-foreground">Waiting for {app.daysWaiting} days</p>
                </div>
                <Badge variant="secondary">{app.status}</Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  Request Info
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
