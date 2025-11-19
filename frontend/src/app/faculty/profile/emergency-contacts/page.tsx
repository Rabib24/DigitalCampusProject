"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Plus, 
  Edit,
  Trash2,
  User,
  Home,
  Building
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export default function EmergencyContactManagementPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "John Smith",
      relationship: "Spouse",
      primaryPhone: "+1 (555) 123-4567",
      secondaryPhone: "+1 (555) 987-6543",
      email: "john.smith@email.com",
      address: "123 Main St, Anytown, ST 12345",
      isPrimary: true
    },
    {
      id: "2",
      name: "Jane Smith",
      relationship: "Sibling",
      primaryPhone: "+1 (555) 456-7890",
      email: "jane.smith@email.com",
      isPrimary: false
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    address: "",
    isPrimary: false
  });

  const [editContact, setEditContact] = useState<EmergencyContact>({
    id: "",
    name: "",
    relationship: "",
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    address: "",
    isPrimary: false
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.relationship || !newContact.primaryPhone) {
      alert("Please fill in required fields");
      return;
    }

    // If this is the first contact or marked as primary, set as primary
    const isPrimary = contacts.length === 0 || newContact.isPrimary;

    // If this contact is primary, unset primary flag on all other contacts
    if (isPrimary) {
      setContacts(contacts.map(contact => ({ ...contact, isPrimary: false })));
    }

    const contact: EmergencyContact = {
      id: (contacts.length + 1).toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      primaryPhone: newContact.primaryPhone,
      secondaryPhone: newContact.secondaryPhone || undefined,
      email: newContact.email || undefined,
      address: newContact.address || undefined,
      isPrimary
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: "",
      relationship: "",
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      address: "",
      isPrimary: false
    });
    setIsAdding(false);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditContact(contact);
    setIsEditing(contact.id);
  };

  const handleSaveEdit = () => {
    // If this contact is being set as primary, unset primary flag on all other contacts
    if (editContact.isPrimary) {
      setContacts(contacts.map(contact => 
        contact.id === editContact.id 
          ? editContact 
          : { ...contact, isPrimary: false }
      ));
    } else {
      setContacts(contacts.map(contact => 
        contact.id === editContact.id ? editContact : contact
      ));
    }

    setIsEditing(null);
  };

  const handleDeleteContact = (id: string) => {
    if (contacts.length <= 1) {
      alert("You must have at least one emergency contact");
      return;
    }

    if (confirm("Are you sure you want to delete this emergency contact?")) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const handleSetPrimary = (id: string) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Emergency Contacts</h1>
          <p className="text-muted-foreground">Manage your emergency contact information</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={18} />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contacts.length}</div>
            <div className="text-muted-foreground">Emergency contacts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone size={20} />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {contacts.find(c => c.isPrimary)?.name || "Not set"}
            </div>
            <div className="text-muted-foreground">
              {contacts.find(c => c.isPrimary)?.relationship || "No primary contact"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building size={20} />
              Contact Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {contacts.filter(c => c.email).length}
            </div>
            <div className="text-muted-foreground">With email addresses</div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add Emergency Contact</CardTitle>
            <CardDescription>Add a new emergency contact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship *</Label>
                <Input
                  id="relationship"
                  placeholder="e.g., Spouse, Parent, Sibling"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryPhone">Primary Phone *</Label>
                <Input
                  id="primaryPhone"
                  placeholder="Enter primary phone number"
                  value={newContact.primaryPhone}
                  onChange={(e) => setNewContact({...newContact, primaryPhone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input
                  id="secondaryPhone"
                  placeholder="Enter secondary phone number"
                  value={newContact.secondaryPhone}
                  onChange={(e) => setNewContact({...newContact, secondaryPhone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={newContact.address}
                  onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Primary Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Set this as your primary emergency contact
                </p>
              </div>
              <Button 
                variant={newContact.isPrimary ? "default" : "outline"}
                onClick={() => setNewContact({...newContact, isPrimary: !newContact.isPrimary})}
              >
                {newContact.isPrimary ? "Yes" : "No"}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddContact} className="gap-2">
                <Plus size={16} />
                Add Contact
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>Your list of emergency contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  {isEditing === contact.id ? (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            value={editContact.name}
                            onChange={(e) => setEditContact({...editContact, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Input
                            value={editContact.relationship}
                            onChange={(e) => setEditContact({...editContact, relationship: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Primary Phone *</Label>
                          <Input
                            value={editContact.primaryPhone}
                            onChange={(e) => setEditContact({...editContact, primaryPhone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Secondary Phone</Label>
                          <Input
                            value={editContact.secondaryPhone || ""}
                            onChange={(e) => setEditContact({...editContact, secondaryPhone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={editContact.email || ""}
                            onChange={(e) => setEditContact({...editContact, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            value={editContact.address || ""}
                            onChange={(e) => setEditContact({...editContact, address: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Primary Contact</h3>
                          <p className="text-sm text-muted-foreground">
                            Set this as your primary emergency contact
                          </p>
                        </div>
                        <Button 
                          variant={editContact.isPrimary ? "default" : "outline"}
                          onClick={() => setEditContact({...editContact, isPrimary: !editContact.isPrimary})}
                        >
                          {editContact.isPrimary ? "Yes" : "No"}
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} className="gap-2">
                          <Edit size={16} />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(null)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                {contact.name}
                                {contact.isPrimary && (
                                  <Badge variant="default">Primary</Badge>
                                )}
                              </h3>
                              <p className="text-muted-foreground">{contact.relationship}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-muted-foreground" />
                              <div>
                                <div className="font-medium">{contact.primaryPhone}</div>
                                {contact.secondaryPhone && (
                                  <div className="text-sm text-muted-foreground">
                                    Secondary: {contact.secondaryPhone}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-muted-foreground" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            
                            {contact.address && (
                              <div className="flex items-start gap-2 md:col-span-2">
                                <Home size={16} className="text-muted-foreground mt-1" />
                                <span>{contact.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {!contact.isPrimary && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSetPrimary(contact.id)}
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditContact(contact)}
                            className="gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteContact(contact.id)}
                            className="gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No emergency contacts</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first emergency contact to get started
                </p>
                <Button onClick={() => setIsAdding(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Contact
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}