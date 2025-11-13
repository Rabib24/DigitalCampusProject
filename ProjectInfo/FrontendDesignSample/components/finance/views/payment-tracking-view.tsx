"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function PaymentTrackingView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Tracking</h1>
        <p className="text-muted-foreground">Monitor student payments and collections</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 12.5M</div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 2.3M</div>
            <p className="text-xs text-muted-foreground">From 45 students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">PKR 850K</div>
            <p className="text-xs text-destructive">12 students</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Collection Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Collection Rate</span>
              <span className="font-medium">82%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Target: 90%</span>
              <span className="text-muted-foreground">Need +8% more</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { student: "Ahmed Hassan", amount: "PKR 45,000", date: "2024-11-20", status: "completed" },
            { student: "Sarah Khan", amount: "PKR 45,000", date: "2024-11-19", status: "pending" },
            { student: "Maria Santos", amount: "PKR 45,000", date: "2024-11-18", status: "completed" },
          ].map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">{tx.student}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{tx.amount}</p>
                <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs mt-1">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
