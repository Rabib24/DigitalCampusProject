"use client"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PublicationManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Publication Management</h1>
          <p className="text-muted-foreground">Track research publications</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Publication
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Journal Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
          </CardContent>
        </Card>
      </div>

      {/* Publications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Publications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: "Deep Learning in Medical Diagnosis",
              authors: "Khan F., et al.",
              year: "2024",
              journal: "IEEE Transactions",
            },
            {
              title: "Sustainable Urban Planning",
              authors: "Hassan A., et al.",
              year: "2024",
              journal: "Urban Studies",
            },
            { title: "Blockchain Security", authors: "Ahmed S., et al.", year: "2023", journal: "Cryptography Review" },
          ].map((pub, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="font-medium">{pub.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{pub.authors}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {pub.journal} ({pub.year})
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
