"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  User,
  Building,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface EmergencyContact {
  id: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  email: string;
  location: string;
  availability: "24/7" | "business-hours" | "on-call";
  isPrimary: boolean;
}

export function EmergencyContactDirectoryView() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "contact_001",
      name: "Campus Security",
      department: "Public Safety",
      role: "Emergency Response",
      phone: "+1 (555) 123-4567",
      email: "security@iub.edu.bd",
      location: "Security Building, Main Entrance",
      availability: "24/7",
      isPrimary: true
    },
    {
      id: "contact_002",
      name: "Dr. Sarah Johnson",
      department: "Student Health Services",
      role: "Chief Medical Officer",
      phone: "+1 (555) 123-4568",
      email: "sarah.johnson@iub.edu.bd",
      location: "Health Center, Room 101",
      availability: "business-hours",
      isPrimary: true
    },
    {
      id: "contact_003",
      name: "Michael Chen",
      department: "IT Services",
      role: "Network Administrator",
      phone: "+1 (555) 123-4569",
      email: "michael.chen@iub.edu.bd",
      location: "IT Building, 2nd Floor",
      availability: "on-call",
      isPrimary: false
    },
    {
      id: "contact_004",
      name: "Facilities Management",
      department: "Operations",
      role: "Maintenance Supervisor",
      phone: "+1 (555) 123-4570",
      email: "facilities@iub.edu.bd",
      location: "Maintenance Building",
      availability: "24/7",
      isPrimary: true
    },
    {
      id: "contact_005",
      name: "Dr. Robert Williams",
      department: "Counseling Services",
      role: "Director of Student Counseling",
      phone: "+1 (555) 123-4571",
      email: "robert.williams@iub.edu.bd",
      location: "Student Center, Room 305",
      availability: "business-hours",
      isPrimary: true
    }
  ]);

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "24/7":
        return <Badge className="bg-green-100 text-green-800">24/7</Badge>;
      case "business-hours":
        return <Badge className="bg-blue-100 text-blue-800">Business Hours</Badge>;
      case "on-call":
        return <Badge className="bg-yellow-100 text-yellow-800">On Call</Badge>;
      default:
        return <Badge>{availability}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Contact Directory</h1>
          <p className="text-muted-foreground mt-1">Find emergency contacts and services on campus</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {contact.name}
                    {contact.isPrimary && (
                      <Badge className="bg-primary text-primary-foreground">Primary</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {contact.role} - {contact.department}
                  </CardDescription>
                </div>
                {getAvailabilityBadge(contact.availability)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Location</div>
                        <div className="text-sm text-muted-foreground">
                          {contact.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Availability</div>
                        <div className="text-sm text-muted-foreground">
                          {contact.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No emergency contacts found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no emergency contacts in the directory. Add a new contact to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Emergency Numbers</CardTitle>
          <CardDescription>
            Quick access to important emergency services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Emergency Services</h3>
              </div>
              <div className="text-2xl font-bold text-red-600">911</div>
              <p className="text-sm text-muted-foreground mt-1">
                For immediate life-threatening emergencies
              </p>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Campus Security</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">+1 (555) 123-4567</div>
              <p className="text-sm text-muted-foreground mt-1">
                24/7 campus security services
              </p>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Health Services</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">+1 (555) 123-4568</div>
              <p className="text-sm text-muted-foreground mt-1">
                Student health and medical services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}