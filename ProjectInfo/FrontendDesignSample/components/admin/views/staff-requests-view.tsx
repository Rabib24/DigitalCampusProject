"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function StaffRequestsView() {
  const requests = [
    { id: 1, type: "Course Approval", description: "Advanced Machine Learning", status: "Pending", days: 2 },
    { id: 2, type: "Budget Request", description: "Lab Equipment Purchase", status: "Approved", days: 1 },
    { id: 3, type: "Faculty Leave", description: "Dr. Khan - Conference", status: "Pending", days: 5 },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Staff Requests</h2>
        <p className="text-muted-foreground mt-1">Review and approve staff requests</p>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="font-semibold text-foreground">{request.type}</h4>
                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={request.status === "Pending" ? "outline" : "default"}>{request.status}</Badge>
                {request.status === "Pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
