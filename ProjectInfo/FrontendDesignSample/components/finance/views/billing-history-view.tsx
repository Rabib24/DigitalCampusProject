"use client"

import { Download, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BillingHistoryView() {
  const billingRecords = [
    { id: 1, period: "Fall 2024", amount: "PKR 450,000", date: "2024-08-15", status: "paid" },
    { id: 2, period: "Spring 2024", amount: "PKR 450,000", date: "2024-02-15", status: "paid" },
    { id: 3, period: "Fall 2023", amount: "PKR 450,000", date: "2023-08-15", status: "paid" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Billing History</h1>
        <p className="text-muted-foreground">View past billing and payment records</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {billingRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium">{record.period}</p>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{record.amount}</p>
                  <p className="text-xs text-green-600">{record.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
