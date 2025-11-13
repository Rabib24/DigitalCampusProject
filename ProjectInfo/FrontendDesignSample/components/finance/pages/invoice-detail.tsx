"use client"

import { ArrowLeft, Download, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function InvoiceDetailPage({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Invoice {invoiceId}</h1>
          <p className="text-muted-foreground">Ahmed Hassan</p>
        </div>
        <Badge className="text-lg px-4 py-2">Pending</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Date:</span>
              <span className="font-medium">2024-11-20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span className="font-medium">2024-11-25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">Fall 2024</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>PKR 45,000</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Item Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Tuition Fee</span>
              <span className="font-medium">PKR 40,000</span>
            </div>
            <div className="flex justify-between">
              <span>Lab Fee</span>
              <span className="font-medium">PKR 3,000</span>
            </div>
            <div className="flex justify-between">
              <span>Library Fee</span>
              <span className="font-medium">PKR 2,000</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Send className="h-4 w-4" />
          Send Reminder
        </Button>
      </div>
    </div>
  )
}
