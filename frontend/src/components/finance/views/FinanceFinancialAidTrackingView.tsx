"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface FinancialAid {
  id: string;
  type: "scholarship" | "grant" | "loan" | "work-study";
  name: string;
  amount: number;
  status: "applied" | "under-review" | "approved" | "rejected" | "disbursed";
  applicationDate: Date;
  decisionDate?: Date;
  disbursementSchedule?: {
    date: Date;
    amount: number;
  }[];
  requirements?: string[];
  documents?: string[];
}

export function FinanceFinancialAidTrackingView() {
  const [financialAid] = useState<FinancialAid[]>([
    {
      id: "aid_001",
      type: "scholarship",
      name: "Academic Excellence Scholarship",
      amount: 5000,
      status: "approved",
      applicationDate: new Date("2025-10-15"),
      decisionDate: new Date("2025-11-01"),
      disbursementSchedule: [
        { date: new Date("2025-12-15"), amount: 2500 },
        { date: new Date("2026-05-15"), amount: 2500 }
      ],
      requirements: ["Maintain 3.5 GPA", "Enroll full-time"]
    },
    {
      id: "aid_002",
      type: "grant",
      name: "Federal Pell Grant",
      amount: 3200,
      status: "disbursed",
      applicationDate: new Date("2025-09-01"),
      decisionDate: new Date("2025-10-15"),
      disbursementSchedule: [
        { date: new Date("2025-12-01"), amount: 1600 },
        { date: new Date("2026-05-01"), amount: 1600 }
      ]
    },
    {
      id: "aid_003",
      type: "loan",
      name: "Federal Student Loan",
      amount: 5000,
      status: "under-review",
      applicationDate: new Date("2025-11-10"),
      requirements: ["Complete entrance counseling", "Sign promissory note"]
    },
    {
      id: "aid_004",
      type: "work-study",
      name: "Campus Work-Study Program",
      amount: 2500,
      status: "applied",
      applicationDate: new Date("2025-11-05")
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-yellow-100 text-yellow-800">Applied</Badge>;
      case "under-review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "disbursed":
        return <Badge className="bg-purple-100 text-purple-800">Disbursed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "scholarship":
        return <Badge className="bg-indigo-100 text-indigo-800">Scholarship</Badge>;
      case "grant":
        return <Badge className="bg-teal-100 text-teal-800">Grant</Badge>;
      case "loan":
        return <Badge className="bg-orange-100 text-orange-800">Loan</Badge>;
      case "work-study":
        return <Badge className="bg-pink-100 text-pink-800">Work-Study</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const totalAwarded = financialAid
    .filter(aid => aid.status === "approved" || aid.status === "disbursed")
    .reduce((sum, aid) => sum + aid.amount, 0);

  const totalPending = financialAid
    .filter(aid => aid.status === "applied" || aid.status === "under-review")
    .reduce((sum, aid) => sum + aid.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Aid Tracking</h1>
        <p className="text-muted-foreground">
          Monitor the status of your financial aid applications and disbursements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Awarded
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAwarded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Approved financial aid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Under review or applied
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialAid.length}</div>
            <p className="text-xs text-muted-foreground">
              Total applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disbursed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${financialAid
                .filter(aid => aid.status === "disbursed")
                .reduce((sum, aid) => sum + aid.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Already received
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Aid Applications</CardTitle>
          <CardDescription>
            Track the status of all your financial aid applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialAid.map((aid) => (
              <div key={aid.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{aid.name}</div>
                    {getTypeBadge(aid.type)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Applied on {aid.applicationDate.toLocaleDateString()}
                  </div>
                  {aid.decisionDate && (
                    <div className="text-sm text-muted-foreground">
                      Decision on {aid.decisionDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">${aid.amount.toLocaleString()}</div>
                  <div className="mt-1">
                    {getStatusBadge(aid.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Disbursement Schedule
            </CardTitle>
            <CardDescription>
              Upcoming financial aid disbursements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialAid
                .filter(aid => aid.disbursementSchedule)
                .flatMap(aid => 
                  aid.disbursementSchedule!.map((disbursement, index) => ({
                    ...disbursement,
                    aidName: aid.name,
                    aidId: aid.id,
                    index
                  }))
                )
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((disbursement) => (
                  <div key={`${disbursement.aidId}-${disbursement.index}`} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{disbursement.aidName}</div>
                      <div className="text-sm text-muted-foreground">
                        {disbursement.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${disbursement.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {disbursement.date < new Date() ? "Past Due" : "Upcoming"}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Requirements
            </CardTitle>
            <CardDescription>
              Actions needed to complete your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialAid
                .filter(aid => aid.requirements && aid.requirements.length > 0)
                .map((aid) => (
                  <div key={aid.id} className="p-3 rounded-lg border">
                    <div className="font-medium mb-2">{aid.name}</div>
                    <div className="space-y-2">
                      {aid.requirements!.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Aid Resources</CardTitle>
          <CardDescription>
            Helpful information and tools for managing your financial aid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <h3 className="font-medium mb-2">Financial Literacy Resources</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn about budgeting, loans, and financial planning
              </p>
              <Button variant="outline" size="sm">
                View Resources
              </Button>
            </div>
            <div className="p-4 rounded-lg border">
              <h3 className="font-medium mb-2">Contact Financial Aid Office</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get help with your applications and questions
              </p>
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}