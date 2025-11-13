"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FinanceAnalyticsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Finance Analytics</h1>
        <p className="text-muted-foreground">Financial reports and analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Tuition Fees", amount: "PKR 18M", percentage: "55%" },
                { category: "Hostel Charges", amount: "PKR 8M", percentage: "24%" },
                { category: "Lab Fees", amount: "PKR 4.5M", percentage: "13%" },
                { category: "Other", amount: "PKR 1.5M", percentage: "8%" },
              ].map((item) => (
                <div key={item.category}>
                  <p className="text-sm font-medium">
                    {item.category}: {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Salaries", amount: "PKR 12M", percentage: "50%" },
                { category: "Infrastructure", amount: "PKR 6M", percentage: "25%" },
                { category: "Utilities", amount: "PKR 3M", percentage: "12%" },
                { category: "Others", amount: "PKR 3M", percentage: "13%" },
              ].map((item) => (
                <div key={item.category}>
                  <p className="text-sm font-medium">
                    {item.category}: {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
