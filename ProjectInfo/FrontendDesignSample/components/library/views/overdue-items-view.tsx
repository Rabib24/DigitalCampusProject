"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function OverdueItemsView() {
  const overdueItems = [
    { id: 1, book: "Data Science", patron: "Ahmed Khan", dueDate: "2025-11-08", daysOverdue: 6 },
    { id: 2, book: "Web Development", patron: "Fatima Ali", dueDate: "2025-11-15", daysOverdue: 1 },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Overdue Items</h2>
        <p className="text-muted-foreground mt-1">Track and recover overdue books</p>
      </div>

      {/* Overdue Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">45</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">1-7 Days Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">28</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">7+ Days Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">17</div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue List */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Items List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {overdueItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{item.book}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.patron} • Due: {item.dueDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{item.daysOverdue}d overdue</Badge>
                <Button size="sm" variant="outline" className="bg-transparent">
                  Send Reminder
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
