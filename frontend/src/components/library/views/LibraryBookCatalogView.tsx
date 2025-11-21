"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, BookOpen } from "lucide-react";

export function LibraryBookCatalogView() {
  const books = [
    {
      id: "978-0134685991",
      title: "Effective Java",
      author: "Joshua Bloch",
      category: "Computer Science",
      copies: 5,
      available: 3,
      status: "available",
    },
    {
      id: "978-0596009205",
      title: "Head First Design Patterns",
      author: "Eric Freeman",
      category: "Computer Science",
      copies: 3,
      available: 0,
      status: "unavailable",
    },
    {
      id: "978-0135166307",
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      category: "Mathematics",
      copies: 4,
      available: 2,
      status: "available",
    },
    {
      id: "978-0321905759",
      title: "University Physics",
      author: "Hugh Young",
      category: "Physics",
      copies: 2,
      available: 1,
      status: "available",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Catalog</h1>
        <p className="text-muted-foreground">
          Manage library book collection and availability.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Book Collection</CardTitle>
              <CardDescription>
                View and manage all books in the library.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISBN</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.id}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.copies}</TableCell>
                  <TableCell>{book.available}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        book.status === "available"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Books distribution across categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Computer Science", books: 120, available: 85 },
                { category: "Mathematics", books: 95, available: 68 },
                { category: "Physics", books: 78, available: 52 },
                { category: "Biology", books: 65, available: 48 },
                { category: "Literature", books: 88, available: 72 },
              ].map((cat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.books} total books</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cat.available} available</p>
                    <div className="w-20 bg-secondary rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${(cat.available / cat.books) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common book management tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Import Books from CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Export Book Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Bulk Update Book Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}