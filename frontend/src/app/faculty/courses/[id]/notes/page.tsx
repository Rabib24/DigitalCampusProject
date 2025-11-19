"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Save,
  FileText
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";

// Mock data for the course
const mockCourse: FacultyCourse = {
  id: "1",
  code: "CS-301",
  name: "Data Science and Machine Learning",
  semester: "Fall",
  year: 2023,
  credits: 4,
  department: "Computer Science",
  studentCount: 28,
  syllabusStatus: "published"
};

interface CourseNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export default function CourseNotesPage() {
  const [course] = useState<FacultyCourse>(mockCourse);
  const [notes, setNotes] = useState<CourseNote[]>([
    {
      id: "1",
      title: "Week 3 Lecture Notes",
      content: "Today we covered data preprocessing techniques including handling missing values, normalization, and feature scaling. Students seemed to grasp the concepts well, but we should revisit feature engineering next week.",
      createdAt: "2023-09-20T10:00:00Z",
      updatedAt: "2023-09-20T10:00:00Z",
      tags: ["data-preprocessing", "lecture"]
    },
    {
      id: "2",
      title: "Project Ideas",
      content: "Some potential project ideas for the final assignment:\n1. Predicting stock prices using time series analysis\n2. Sentiment analysis of social media posts\n3. Image classification using CNNs\n4. Customer segmentation for e-commerce\n5. Fraud detection in financial transactions",
      createdAt: "2023-09-15T14:30:00Z",
      updatedAt: "2023-09-18T09:15:00Z",
      tags: ["projects", "ideas"]
    },
    {
      id: "3",
      title: "Common Student Questions",
      content: "Frequently asked questions from students:\n- How to handle imbalanced datasets?\n- Difference between supervised and unsupervised learning?\n- When to use which evaluation metric?\n- How to prevent overfitting?\n\nNeed to prepare additional examples for next lecture.",
      createdAt: "2023-09-10T11:20:00Z",
      updatedAt: "2023-09-10T11:20:00Z",
      tags: ["faq", "student-questions"]
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: ""
  });

  const [editingNote, setEditingNote] = useState({
    id: "",
    title: "",
    content: "",
    tags: ""
  });

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) {
      alert("Please fill in required fields");
      return;
    }

    const note: CourseNote = {
      id: (notes.length + 1).toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newNote.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", tags: "" });
    setIsCreating(false);
  };

  const handleEditNote = (note: CourseNote) => {
    setEditingNoteId(note.id);
    setEditingNote({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags.join(", ")
    });
  };

  const handleSaveEdit = () => {
    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? {
            ...note,
            title: editingNote.title,
            content: editingNote.content,
            tags: editingNote.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date().toISOString()
          }
        : note
    ));
    setEditingNoteId(null);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "all" || note.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Course Notes</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Create Note
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>Add a new note for this course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                placeholder="Enter note title"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note-content">Content *</Label>
              <Textarea
                id="note-content"
                placeholder="Enter your note content"
                rows={6}
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note-tags">Tags (comma separated)</Label>
              <Input
                id="note-tags"
                placeholder="e.g., lecture, homework, project"
                value={newNote.tags}
                onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateNote} className="gap-2">
                <Save size={16} />
                Save Note
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  {editingNoteId === note.id ? (
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-title-${note.id}`}>Title</Label>
                        <Input
                          id={`edit-title-${note.id}`}
                          value={editingNote.title}
                          onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-content-${note.id}`}>Content</Label>
                        <Textarea
                          id={`edit-content-${note.id}`}
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                          rows={6}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-tags-${note.id}`}>Tags</Label>
                        <Input
                          id={`edit-tags-${note.id}`}
                          value={editingNote.tags}
                          onChange={(e) => setEditingNote({...editingNote, tags: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} className="gap-2">
                          <Save size={16} />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingNoteId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{note.title}</h3>
                          <p className="text-muted-foreground mt-2 whitespace-pre-line">
                            {note.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            {note.tags.map(tag => (
                              <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditNote(note)}
                            className="gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteNote(note.id)}
                            className="gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No notes found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterTag !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first note to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Create Note
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}