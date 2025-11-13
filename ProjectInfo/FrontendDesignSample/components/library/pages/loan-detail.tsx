"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LoanDetailPage({ loanId }: { loanId: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Loan Details</h2>
        <p className="text-muted-foreground mt-1">Manage loan information and returns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Book Title</p>
              <p className="font-medium mt-1">Data Science Fundamentals</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patron</p>
              <p className="font-medium mt-1">Ahmed Khan</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loan Date</p>
              <p className="font-medium mt-1">November 14, 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium mt-1">November 28, 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Left</p>
              <p className="font-medium mt-1 text-green-500">14 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Process Return</Button>
        <Button variant="outline" className="bg-transparent">
          Extend Loan
        </Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
