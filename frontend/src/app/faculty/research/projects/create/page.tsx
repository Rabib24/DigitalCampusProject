"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";
import { createFacultyResearchProject } from "@/lib/faculty/api";
import { useFaculty } from "@/hooks/faculty/FacultyContext";

export default function CreateResearchProjectPage() {
  const router = useRouter();
  const { state } = useFaculty();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    start_date: "",
    end_date: "",
    collaborators: "",
    funding: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert form data to API format
      const projectData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        collaborators: formData.collaborators.split(",").map(c => c.trim()).filter(c => c),
        funding: formData.funding ? parseFloat(formData.funding) : 0
      };

      const response = await createFacultyResearchProject(projectData);
      
      if (response.success) {
        // Show success message and redirect to research projects page after a short delay
        alert("Research project created successfully!");
        router.push("/faculty/research");
      } else {
        setError(response.message || "Failed to create research project");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Research Project</h1>
            <p className="text-muted-foreground">Create a new research project</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter the details for your new research project</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-md">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="draft">Draft</option>
                    <option value="proposal">Proposal</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding">Funding (USD)</Label>
                  <Input
                    id="funding"
                    name="funding"
                    type="number"
                    value={formData.funding}
                    onChange={handleChange}
                    placeholder="Enter funding amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collaborators">Collaborators</Label>
                <Input
                  id="collaborators"
                  name="collaborators"
                  value={formData.collaborators}
                  onChange={handleChange}
                  placeholder="Enter collaborator names, separated by commas"
                />
                <p className="text-sm text-muted-foreground">
                  Enter collaborator names separated by commas
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FacultyProtectedRoute>
  );
}