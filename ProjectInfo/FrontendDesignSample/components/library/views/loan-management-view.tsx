"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LoanManagementView() {
  const loans = [
    { id: 1, book: "Data Science", patron: "Ahmed Khan", dueDate: "2025-11-20", status: "Active", daysLeft: 3 },
    { id: 2, book: "Web Dev", patron: "Fatima Ali", dueDate: "2025-11-15", status: "Overdue", daysLeft: -2 },
    { id: 3, book: "Algorithms", patron: "Sara Smith", dueDate: "2025-11-25", status: "Active", daysLeft: 8 },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Loan Management</h2>
        <p className="text-muted-foreground mt-1">Track and manage book loans and returns</p>
      </div>

      {/* Loan Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3,892</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">45</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{loan.book}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {loan.patron} • Due: {loan.dueDate}
                </p>
              </div>
              <Badge variant={loan.status === "Overdue" ? "destructive" : "default"}>
                {loan.status === "Overdue" ? `${Math.abs(loan.daysLeft)}d overdue` : `${loan.daysLeft}d left`}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
