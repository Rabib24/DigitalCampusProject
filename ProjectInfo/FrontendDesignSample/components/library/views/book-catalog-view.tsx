"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Plus, Edit } from "lucide-react"

export function BookCatalogView() {
  const router = useRouter()

  const books = [
    {
      id: 1,
      title: "Data Science Fundamentals",
      author: "Smith, John",
      copies: 5,
      available: 3,
      isbn: "978-1234567890",
    },
    { id: 2, title: "Advanced Algorithms", author: "Khan, Ahmed", copies: 3, available: 1, isbn: "978-1234567891" },
    { id: 3, title: "Web Development Guide", author: "Ali, Fatima", copies: 8, available: 7, isbn: "978-1234567892" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Book Catalog</h2>
          <p className="text-muted-foreground mt-1">Search and manage library books</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => router.push("/library/add-book")}>
          <Plus size={18} />
          Add Book
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input placeholder="Search by title, author, or ISBN..." className="pl-10" />
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors cursor-pointer"
            onClick={() => router.push(`/library/book-${book.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Copies</p>
                    <p className="font-medium">{book.copies}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-medium text-green-500">{book.available}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">ISBN</p>
                    <p className="font-medium text-xs">{book.isbn}</p>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/library/book-${book.id}`)
                }}
              >
                <Edit size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
