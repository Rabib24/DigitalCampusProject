"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethod {
  id: string;
  type: "credit" | "debit" | "paypal" | "bank";
  name: string;
  lastFour?: string;
  expiryDate?: string;
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue";
}

export function FinanceTuitionPaymentView() {
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_001",
      type: "credit",
      name: "Visa ending in 4532",
      lastFour: "4532",
      expiryDate: "12/2027"
    },
    {
      id: "pm_002",
      type: "paypal",
      name: "PayPal Account"
    },
    {
      id: "pm_003",
      type: "bank",
      name: "Bank Transfer"
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: "inv_001",
      description: "Fall Semester Tuition",
      amount: 5420.00,
      dueDate: new Date("2025-12-15"),
      status: "pending"
    },
    {
      id: "inv_002",
      description: "Library Fees",
      amount: 125.00,
      dueDate: new Date("2025-12-15"),
      status: "pending"
    },
    {
      id: "inv_003",
      description: "Spring Semester Tuition",
      amount: 5420.00,
      dueDate: new Date("2026-05-15"),
      status: "pending"
    }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("pm_001");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<string>("inv_001");

  const handlePayment = () => {
    alert(`Payment of $${paymentAmount} processed successfully!`);
    // In a real app, this would connect to a payment gateway
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPendingAmount = invoices
    .filter(inv => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tuition Payment</h1>
        <p className="text-muted-foreground">
          Manage and process your tuition payments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Make a Payment
            </CardTitle>
            <CardDescription>
              Select an invoice and payment method to process your payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Invoice</Label>
              <div className="space-y-2">
                {invoices.filter(inv => inv.status === "pending").map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedInvoice === invoice.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedInvoice(invoice.id);
                      setPaymentAmount(invoice.amount.toString());
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{invoice.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {invoice.dueDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={selectedPaymentMethod} 
                onValueChange={setSelectedPaymentMethod}
                className="space-y-2"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center gap-2 w-full p-3 rounded-lg border">
                      {method.type === "credit" && <CreditCard className="h-4 w-4" />}
                      {method.type === "paypal" && <span className="font-bold">PayPal</span>}
                      {method.type === "bank" && <FileText className="h-4 w-4" />}
                      <span className="flex-1">
                        {method.name}
                        {method.lastFour && (
                          <span className="text-sm text-muted-foreground block">
                            •••• {method.lastFour} {method.expiryDate && `Expires ${method.expiryDate}`}
                          </span>
                        )}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button onClick={handlePayment} className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>
                Overview of your payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selected Invoice</span>
                <span className="font-medium">
                  {invoices.find(inv => inv.id === selectedInvoice)?.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-medium">${paymentAmount || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">
                  {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${paymentAmount || "0.00"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pending Invoices
              </CardTitle>
              <CardDescription>
                Invoices that require payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.filter(inv => inv.status === "pending").map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{invoice.description}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {invoice.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total Pending</span>
                    <span>${totalPendingAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Payment History
          </CardTitle>
          <CardDescription>
            Recent payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Summer Semester Tuition</div>
                <div className="text-sm text-muted-foreground">
                  Paid on Oct 15, 2025 • Visa ending in 4532
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">-$5,420.00</div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Lab Fees</div>
                <div className="text-sm text-muted-foreground">
                  Paid on Sep 10, 2025 • PayPal
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">-$350.00</div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}