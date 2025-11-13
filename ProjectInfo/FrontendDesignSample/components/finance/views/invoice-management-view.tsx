"use client"

import { Plus, Download, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function InvoiceManagementView() {
  const router = useRouter()

  const invoices = [
    {
      id: "INV-001",
      student: "Ahmed Hassan",
      amount: "PKR 45,000",
      date: "2024-11-20",
      status: "paid",
      dueDate: "2024-11-25",
    },
    {
      id: "INV-002",
      student: "Sarah Khan",
      amount: "PKR 45,000",
      date: "2024-11-19",
      status: "pending",
      dueDate: "2024-11-24",
    },
    {
      id: "INV-003",
      student: "John Doe",
      amount: "PKR 45,000",
      date: "2024-11-18",
      status: "overdue",
      dueDate: "2024-11-10",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground">Create and manage student invoices</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Search */}
      <Input placeholder="Search invoices..." className="w-full md:w-64" />

      {/* Invoices Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Invoice #</th>
                  <th className="text-left py-2 px-2">Student</th>
                  <th className="text-left py-2 px-2">Amount</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Due Date</th>
                  <th className="text-left py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-2">{invoice.id}</td>
                    <td className="py-3 px-2">{invoice.student}</td>
                    <td className="py-3 px-2 font-medium">{invoice.amount}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "default"
                            : invoice.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{invoice.dueDate}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
