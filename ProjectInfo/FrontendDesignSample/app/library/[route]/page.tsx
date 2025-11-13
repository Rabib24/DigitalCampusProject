"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookDetailPage } from "@/components/library/pages/book-detail"
import { PatronDetailPage } from "@/components/library/pages/patron-detail"
import { LoanDetailPage } from "@/components/library/pages/loan-detail"
import { DigitalResourceDetailPage } from "@/components/library/pages/digital-resource-detail"

export default function LibraryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const route = params.route as string

  const renderPage = () => {
    switch (true) {
      case route.startsWith("book-"):
        return <BookDetailPage bookId={route.split("-").pop() || ""} />
      case route.startsWith("patron-"):
        return <PatronDetailPage patronId={route.split("-").pop() || ""} />
      case route.startsWith("loan-"):
        return <LoanDetailPage loanId={route.split("-").pop() || ""} />
      case route.startsWith("digital-"):
        return <DigitalResourceDetailPage resourceId={route.split("-").pop() || ""} />
      default:
        return <div className="p-6">Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" className="gap-2 mb-6 bg-transparent" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Back
        </Button>
        {renderPage()}
      </div>
    </div>
  )
}
