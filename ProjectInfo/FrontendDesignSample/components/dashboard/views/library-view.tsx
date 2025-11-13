"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Download } from "lucide-react"

export function LibraryView() {
  const borrowedBooks = [
    {
      id: 1,
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson",
      dueDate: "2025-12-28",
      status: "active",
    },
    {
      id: 2,
      title: "Discrete Mathematics and Its Applications",
      author: "Kenneth H. Rosen",
      dueDate: "2026-01-04",
      status: "active",
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      dueDate: "2025-12-25",
      status: "overdue",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Library</h2>
        <p className="text-muted-foreground mt-1">Access books, digital resources, and manage loans</p>
      </div>

      {/* Library Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground mt-1">Active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Digital Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1,250+</div>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">Rs. 0</div>
            <p className="text-xs text-muted-foreground mt-1">Account in good standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Borrowed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Currently Borrowed
          </CardTitle>
          <CardDescription>Manage your active loans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="flex items-start justify-between rounded-lg border border-border p-3">
              <div className="flex-1">
                <h4 className="font-semibold">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={book.status === "overdue" ? "destructive" : "outline"}>
                  {book.status === "overdue" ? "Overdue" : "Active"}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(book.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Digital Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Resources</CardTitle>
          <CardDescription>E-books, journals, and research databases</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            "JSTOR - Academic Research",
            "ProQuest - Dissertations",
            "SpringerLink - Scientific Journals",
            "IEEE Xplore - Tech & Engineering",
          ].map((resource, index) => (
            <Button key={index} variant="outline" className="w-full justify-between bg-transparent">
              <span>{resource}</span>
              <Download size={16} />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
