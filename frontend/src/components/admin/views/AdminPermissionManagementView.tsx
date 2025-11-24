"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash2, RefreshCw } from "lucide-react";
import { getAdminPermissionManagement, assignUserPermission, removeUserPermission } from "@/lib/admin/api";

interface Permission {
  id: string;
  name: string;
  codename: string;
  description: string;
  category: string;
}

interface UserPermission {
  id: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  permission: Permission;
  granted_at: string;
  granted_by: string;
  scope: Record<string, unknown>;
}

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

export function AdminPermissionManagementView() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const [scope, setScope] = useState<string>("");

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching permission management data...');
      const data = await getAdminPermissionManagement();
      console.log('Received permission management data:', data);
      setPermissions(data.permissions || []);
      setUserPermissions(data.userPermissions || []);
      
      // Extract unique users from userPermissions
      const uniqueUsers = Array.from(
        new Map(
          (data.userPermissions || []).map((up: UserPermission) => [up.user.id, up.user])
        ).values()
      ) as User[];
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Error in fetchPermissions:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load permission data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleAssignPermission = async () => {
    if (!selectedUser || !selectedPermission) {
      setError("Please select both user and permission");
      return;
    }

    try {
      const scopeObj = scope ? JSON.parse(scope) : {};
      await assignUserPermission({
        user_id: selectedUser,
        permission_id: selectedPermission,
        scope: scopeObj
      });
      
      // Refresh data
      fetchPermissions();
      
      // Reset form
      setSelectedUser("");
      setSelectedPermission("");
      setScope("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign permission";
      setError(errorMessage);
    }
  };

  const handleRemovePermission = async (userId: string, permissionId: string) => {
    try {
      await removeUserPermission({
        user_id: userId,
        permission_id: permissionId
      });
      
      // Refresh data
      fetchPermissions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove permission";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Loading permission data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Permission Management</h1>
        <p className="text-muted-foreground">
          Manage user permissions and access controls
        </p>
      </div>

      <Card className="border border-border bg-dashboard-card hover:bg-dashboard-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle>Assign Permission</CardTitle>
          <CardDescription>
            Grant permissions to users with optional scope restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((permission) => (
                    <SelectItem key={permission.id} value={permission.id}>
                      {permission.name} ({permission.codename})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scope">Scope (JSON)</Label>
              <Input
                id="scope"
                placeholder='{"department": "CS"}'
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleAssignPermission} className="bg-sidebar-active hover:bg-sidebar-active/90">
            <Plus className="h-4 w-4 mr-2" />
            Assign Permission
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border bg-dashboard-card hover:bg-dashboard-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>
            View and manage assigned permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Granted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPermissions.map((up) => (
                <TableRow key={up.id}>
                  <TableCell>
                    {up.user.first_name} {up.user.last_name} ({up.user.username})
                  </TableCell>
                  <TableCell>
                    {up.permission.name} ({up.permission.codename})
                  </TableCell>
                  <TableCell>
                    {up.scope ? JSON.stringify(up.scope) : "No scope"}
                  </TableCell>
                  <TableCell>
                    {new Date(up.granted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemovePermission(up.user.id, up.permission.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border border-border bg-dashboard-card hover:bg-dashboard-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
          <CardDescription>
            System-wide permissions that can be assigned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Codename</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>{permission.codename}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>{permission.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}