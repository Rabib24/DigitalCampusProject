"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Save,
  Edit,
  FileText,
  Plus,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export function CourseNotesPage({ courseId }: { courseId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note_001",
      title: "Data Structures Introduction",
      content: "Key concepts covered:\n- Arrays and their operations\n- Linked lists (singly and doubly)\n- Time complexity analysis\n- Space complexity analysis",
      createdAt: new Date("2025-11-01"),
      updatedAt: new Date("2025-11-01"),
      tags: ["data-structures", "introduction"]
    },
    {
      id: "note_002",
      title: "Sorting Algorithms",
      content: "Types of sorting algorithms:\n- Bubble sort (O(n²))\n- Selection sort (O(n²))\n- Insertion sort (O(n²))\n- Merge sort (O(n log n))\n- Quick sort (O(n log n) average)\n- Heap sort (O(n log n))",
      createdAt: new Date("2025-11-05"),
      updatedAt: new Date("2025-11-05"),
      tags: ["sorting", "algorithms"]
    }
  ]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: "New Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    setNotes([...notes, newNote]);
    setActiveNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (activeNote) {
      setNotes(notes.map(note => note.id === activeNote.id ? activeNote : note));
      setIsEditing(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Notes</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
              <CardDescription>
                Browse and manage your course notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeNote?.id === note.id ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                    onClick={() => {
                      setActiveNote(note);
                      setIsEditing(false);
                    }}
                  >
                    <div className="font-medium">{note.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {note.updatedAt.toLocaleDateString()}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {activeNote ? (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={activeNote.title}
                        onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                        className="text-2xl font-bold bg-transparent border-b border-muted focus:border-primary focus:outline-none w-full md:w-auto"
                      />
                    ) : (
                      <CardTitle>{activeNote.title}</CardTitle>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Last updated: {activeNote.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveNote}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => handleDeleteNote(activeNote.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        value={activeNote.content}
                        onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                        rows={15}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-1">
                        {activeNote.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button 
                              onClick={() => {
                                const newTags = [...activeNote.tags];
                                newTags.splice(index, 1);
                                setActiveNote({...activeNote, tags: newTags});
                              }}
                              className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <input
                          type="text"
                          placeholder="Add tag..."
                          className="border-b border-muted focus:border-primary focus:outline-none bg-transparent px-1 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              setActiveNote({
                                ...activeNote,
                                tags: [...activeNote.tags, e.currentTarget.value.trim()]
                              });
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {activeNote.content}
                    </pre>
                    {activeNote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {activeNote.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium mt-4">No note selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a note from the list or create a new one
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}