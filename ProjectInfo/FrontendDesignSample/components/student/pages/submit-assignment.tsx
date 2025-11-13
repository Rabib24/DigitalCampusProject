"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Upload, CheckCircle } from "lucide-react"

interface SubmitAssignmentPageProps {
  assignmentId: string
}

export function SubmitAssignmentPage({ assignmentId }: SubmitAssignmentPageProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <CardTitle className="text-2xl">Assignment Submitted Successfully!</CardTitle>
            <CardDescription>Your submission has been received and recorded.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/50 p-4 rounded-lg border">
              <p className="text-sm font-medium mb-2">Submission Details:</p>
              <ul className="text-sm space-y-1">
                <li>Assignment ID: {assignmentId}</li>
                <li>Submitted: {new Date().toLocaleString()}</li>
                <li>Files: {files.length}</li>
              </ul>
            </div>
            <Button onClick={() => router.back()} className="w-full">
              Back to Assignment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Submit Assignment</h1>
        <p className="text-muted-foreground">Assignment ID: {assignmentId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Submit your assignment files (PDF, ZIP, or code files)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/5 transition-colors">
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">ZIP, PDF, or code files up to 50MB</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Files:</p>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Add any comments about your submission</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your comments here (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={5}
          />
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Before you submit:</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Double-check all required files are included</li>
              <li>Ensure file formats are correct</li>
              <li>Verify your code compiles and runs</li>
              <li>You cannot modify files after submission</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={files.length === 0 || isSubmitting} className="flex-1">
          {isSubmitting ? "Submitting..." : "Submit Assignment"}
        </Button>
      </div>
    </div>
  )
}
