"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookMarked, Plus } from "lucide-react"

export function ResearchView() {
  const projects = [
    { id: 1, title: "AI-Driven Educational Analytics", status: "Active", team: 3, publications: 2, funding: "$50,000" },
    { id: 2, title: "Blockchain in Education", status: "Planning", team: 2, publications: 0, funding: "Pending" },
    { id: 3, title: "Student Learning Patterns", status: "Completed", team: 4, publications: 5, funding: "$75,000" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Research Projects</h2>
          <p className="text-muted-foreground mt-1">Manage your research activities and publications</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookMarked size={20} className="text-primary" />
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                </div>
                <Badge>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="rounded-lg bg-accent/5 p-2">
                    <p className="text-muted-foreground">Team Members</p>
                    <p className="text-lg font-semibold mt-1">{project.team}</p>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-2">
                    <p className="text-muted-foreground">Publications</p>
                    <p className="text-lg font-semibold mt-1">{project.publications}</p>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-2">
                    <p className="text-muted-foreground">Funding</p>
                    <p className="text-lg font-semibold mt-1">{project.funding}</p>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-2">
                    <p className="text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold mt-1">{project.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Manage Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
