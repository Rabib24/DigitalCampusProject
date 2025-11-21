"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
};

export function EmergencyContactView() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "John Smith",
      relationship: "Father",
      phone: "+1234567890",
      email: "john.smith@email.com",
      isPrimary: true
    },
    {
      id: "2",
      name: "Jane Smith",
      relationship: "Mother",
      phone: "+1234567891",
      email: "jane.smith@email.com",
      isPrimary: false
    }
  ]);

  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, "id">>({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    isPrimary: false
  });

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
  };

  const handleSave = () => {
    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? editingContact : c));
      setEditingContact(null);
    }
  };

  const handleCancel = () => {
    setEditingContact(null);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        ...newContact,
        id: Date.now().toString()
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: "",
        relationship: "",
        phone: "",
        email: "",
        isPrimary: false
      });
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
      <div>
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <p className="text-muted-foreground">
          Manage your emergency contact information for campus safety.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Emergency Contact</CardTitle>
          <CardDescription>
            Add a trusted person who can be contacted in case of emergency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  className="pl-10"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                placeholder="e.g., Parent, Guardian, Spouse"
                value={newContact.relationship}
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  className="pl-10"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={newContact.isPrimary}
              onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
            />
            <Label htmlFor="isPrimary">Set as Primary Contact</Label>
          </div>
          <Button onClick={handleAddContact}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>
            Your saved emergency contacts. The primary contact will be notified first in case of emergency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                {editingContact?.id === contact.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        value={editingContact.name}
                        onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <Input
                        value={editingContact.relationship}
                        onChange={(e) => setEditingContact({...editingContact, relationship: e.target.value})}
                        placeholder="Relationship"
                      />
                    </div>
                    <div>
                      <Input
                        value={editingContact.phone}
                        onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                        placeholder="Phone"
                      />
                    </div>
                    <div>
                      <Input
                        value={editingContact.email}
                        onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-4">
                      <Button onClick={handleSave} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.isPrimary && (
                          <Badge variant="default">
                            <Shield className="mr-1 h-3 w-3" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm flex items-center">
                          <Phone className="mr-1 h-4 w-4" />
                          {contact.phone}
                        </span>
                        <span className="text-sm">{contact.email}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!contact.isPrimary && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetPrimary(contact.id)}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Primary
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Services</CardTitle>
          <CardDescription>
            Important campus emergency contacts and services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Campus Security</h3>
              <p className="text-sm text-muted-foreground">24/7 emergency response</p>
              <p className="text-sm mt-1 flex items-center">
                <Phone className="mr-1 h-4 w-4" />
                (555) 123-4567
              </p>
            </div>
            <Button variant="destructive">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergency Call
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Medical Emergency</h3>
              <p className="text-sm text-muted-foreground">Campus health center</p>
              <p className="text-sm mt-1 flex items-center">
                <Phone className="mr-1 h-4 w-4" />
                (555) 123-4568
              </p>
            </div>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}