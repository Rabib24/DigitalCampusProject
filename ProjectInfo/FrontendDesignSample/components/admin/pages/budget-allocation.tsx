"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function BudgetAllocationPage({ budgetId }: { budgetId: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Budget Allocation</h2>
        <p className="text-muted-foreground mt-1">Allocate and manage budget resources</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Allocation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Category</Label>
            <div className="mt-2 p-3 rounded border border-border bg-muted">Faculty Salaries</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Total Budget</Label>
            <Input defaultValue="$160,000" className="mt-2" />
          </div>

          <div>
            <Label className="text-sm font-medium">Currently Allocated</Label>
            <Input defaultValue="$150,000" className="mt-2" />
          </div>

          <div>
            <Label className="text-sm font-medium">Available</Label>
            <div className="mt-2 p-3 rounded border border-border bg-green-50 text-green-900">$10,000</div>
          </div>

          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Utilization:</strong> 94% of total budget
            </p>
          </div>

          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">Update Allocation</Button>
            <Button variant="outline" className="bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
