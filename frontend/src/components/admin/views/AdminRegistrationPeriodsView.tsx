"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminEnrollmentPeriodsService, type EnrollmentPeriod, type CreateEnrollmentPeriodData, type UpdateEnrollmentPeriodData } from "@/lib/admin/enrollment-periods";

export function AdminRegistrationPeriodsView() {
  const [periods, setPeriods] = useState<EnrollmentPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<EnrollmentPeriod | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    student_group: "",
    is_active: true
  });

  // Load enrollment periods on component mount
  useEffect(() => {
    loadEnrollmentPeriods();
  }, []);

  const loadEnrollmentPeriods = async () => {
    try {
      setLoading(true);
      const data = await AdminEnrollmentPeriodsService.getEnrollmentPeriods();
      setPeriods(data);
    } catch (err) {
      setError("Failed to load enrollment periods");
      console.error("Enrollment periods load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePeriod = async () => {
    try {
      // Format datetime for submission
      const startDateTime = new Date(formData.start_date).toISOString();
      const endDateTime = new Date(formData.end_date).toISOString();
      
      const data: CreateEnrollmentPeriodData = {
        name: formData.name,
        description: formData.description,
        start_date: startDateTime,
        end_date: endDateTime,
        student_group: formData.student_group,
        is_active: formData.is_active
      };
      
      await AdminEnrollmentPeriodsService.createEnrollmentPeriod(data);
      setIsCreating(false);
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        student_group: "",
        is_active: true
      });
      loadEnrollmentPeriods();
    } catch (err) {
      setError("Failed to create enrollment period");
      console.error("Create period error:", err);
    }
  };

  const handleUpdatePeriod = async () => {
    if (!editingPeriod) return;
    
    try {
      // Format datetime for submission
      const startDateTime = new Date(formData.start_date).toISOString();
      const endDateTime = new Date(formData.end_date).toISOString();
      
      const updateData: UpdateEnrollmentPeriodData = {
        name: formData.name || undefined,
        description: formData.description || undefined,
        start_date: startDateTime,
        end_date: endDateTime,
        student_group: formData.student_group || undefined,
        is_active: formData.is_active
      };
      
      await AdminEnrollmentPeriodsService.updateEnrollmentPeriod(editingPeriod.id, updateData);
      setEditingPeriod(null);
      loadEnrollmentPeriods();
    } catch (err) {
      setError("Failed to update enrollment period");
      console.error("Update period error:", err);
    }
  };

  const handleDeletePeriod = async (id: string) => {
    try {
      await AdminEnrollmentPeriodsService.deleteEnrollmentPeriod(id);
      loadEnrollmentPeriods();
    } catch (err) {
      setError("Failed to delete enrollment period");
      console.error("Delete period error:", err);
    }
  };

  const startEditing = (period: EnrollmentPeriod) => {
    setEditingPeriod(period);
    // Convert ISO string to local datetime format for input
    const startDate = period.start_date ? new Date(period.start_date).toLocaleString('sv-SE').substring(0, 16) : "";
    const endDate = period.end_date ? new Date(period.end_date).toLocaleString('sv-SE').substring(0, 16) : "";
    
    setFormData({
      name: period.name,
      description: period.description,
      start_date: startDate,
      end_date: endDate,
      student_group: period.student_group,
      is_active: period.is_active
    });
  };

  const cancelEditing = () => {
    setEditingPeriod(null);
    setIsCreating(false);
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      student_group: "",
      is_active: true
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const isCurrentPeriod = (period: EnrollmentPeriod) => {
    const currentDate = new Date();
    const startDate = new Date(period.start_date);
    const endDate = new Date(period.end_date);
    return period.is_active && startDate <= currentDate && endDate >= currentDate;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registration Period Management</h1>
        <p className="text-muted-foreground">
          Manage enrollment periods for different student groups.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isCreating || editingPeriod) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPeriod ? "Edit Registration Period" : "Create New Registration Period"}</CardTitle>
            <CardDescription>
              {editingPeriod 
                ? "Modify the details of the registration period below." 
                : "Set up a new registration period for students."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Period Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Spring 2024 Freshman Registration"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="student_group">Student Group</Label>
                <Input
                  id="student_group"
                  value={formData.student_group}
                  onChange={(e) => setFormData({...formData, student_group: e.target.value})}
                  placeholder="e.g., freshmen, sophomores"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date & Time</Label>
                <div className="relative">
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date & Time</Label>
                <div className="relative">
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this registration period..."
                />
              </div>
              
              <div className="flex items-center space-x-2 md:col-span-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active Period</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEditing}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={editingPeriod ? handleUpdatePeriod : handleCreatePeriod}>
                <Save className="mr-2 h-4 w-4" />
                {editingPeriod ? "Update Period" : "Create Period"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registration Periods</h2>
          <p className="text-muted-foreground">
            Manage all enrollment periods for student registration.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Period
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Student Group</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-medium">{period.name}</TableCell>
                  <TableCell>
                    {period.student_group ? (
                      <Badge variant="secondary">{period.student_group}</Badge>
                    ) : (
                      <span className="text-muted-foreground">All Students</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(period.start_date)} - {formatDate(period.end_date)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Badge 
                        variant={period.is_active ? "default" : "secondary"}
                        className={isCurrentPeriod(period) ? "bg-green-500" : ""}
                      >
                        {period.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {isCurrentPeriod(period) && (
                        <span className="text-xs text-green-500 mt-1">Current</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => startEditing(period)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeletePeriod(period.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {periods.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No registration periods found. Create your first period to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}