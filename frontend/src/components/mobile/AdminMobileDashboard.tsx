"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Shield, 
  Database, 
  BarChart3, 
  Settings, 
  Menu,
  Search,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MobileView = 
  | "dashboard"
  | "users"
  | "security"
  | "systems"
  | "database"
  | "analytics"
  | "settings";

export function AdminMobileDashboard() {
  const [activeView, setActiveView] = useState<MobileView>("dashboard");
  const [isOffline, setIsOffline] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="p-4 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">System overview and management</p>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">System Status</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="text-lg font-bold text-green-600">Operational</div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="text-2xl font-bold text-primary">1,248</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-3">System Management</h2>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("users")}>
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Users</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("security")}>
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Security</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("systems")}>
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Systems</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("database")}>
                  <Database className="h-5 w-5" />
                  <span className="text-xs">Database</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("analytics")}>
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 gap-1" onClick={() => setActiveView("settings")}>
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </div>

            {/* Recent Alerts */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Recent Alerts</h2>
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">System Update Completed</div>
                  <div className="text-xs text-muted-foreground">Database optimization finished successfully</div>
                  <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Resolved</Badge>
                </div>
                <div className="bg-card rounded-lg p-3 border">
                  <div className="font-medium text-sm">New User Registrations</div>
                  <div className="text-xs text-muted-foreground">42 new accounts created today</div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">Info</Badge>
                </div>
              </div>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border text-center">
                  <div className="text-sm text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold text-primary">2,458</div>
                </div>
                <div className="bg-card rounded-lg p-4 border text-center">
                  <div className="text-sm text-muted-foreground">Active Today</div>
                  <div className="text-2xl font-bold text-primary">1,248</div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">User Distribution</h2>
                <div className="space-y-3">
                  {[
                    { role: "Students", count: 1856, percentage: 75 },
                    { role: "Faculty", count: 342, percentage: 14 },
                    { role: "Staff", count: 187, percentage: 8 },
                    { role: "Admin", count: 73, percentage: 3 },
                  ].map((userType, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm">
                        <span>{userType.role}</span>
                        <span>{userType.count} ({userType.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${userType.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Security Management</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Security Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Firewall</div>
                      <div className="text-sm text-muted-foreground">Active and up-to-date</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Intrusion Detection</div>
                      <div className="text-sm text-muted-foreground">Monitoring network traffic</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Last Security Scan</div>
                      <div className="text-sm text-muted-foreground">No vulnerabilities found</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Clean</Badge>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Recent Security Events</h2>
                <div className="space-y-3">
                  {[
                    { event: "Failed Login Attempt", user: "john.doe@university.edu", time: "2 hours ago", severity: "Low" },
                    { event: "Suspicious Activity", user: "N/A", time: "1 day ago", severity: "Medium" },
                    { event: "Security Update", user: "System", time: "3 days ago", severity: "Info" },
                  ].map((event, index) => (
                    <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="font-medium text-sm">{event.event}</div>
                      <div className="text-xs text-muted-foreground">{event.user} • {event.time}</div>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" variant="destructive">
                <Shield className="h-4 w-4 mr-2" />
                Run Security Scan
              </Button>
            </div>
          </div>
        );
      case "systems":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">System Management</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Server Status</h2>
                <div className="space-y-3">
                  {[
                    { name: "Web Server", status: "Operational", uptime: "99.9%" },
                    { name: "Database Server", status: "Operational", uptime: "99.8%" },
                    { name: "API Gateway", status: "Operational", uptime: "99.95%" },
                    { name: "Load Balancer", status: "Operational", uptime: "100%" },
                  ].map((server, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-sm text-muted-foreground">Uptime: {server.uptime}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{server.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Resource Usage</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Disk Space</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                System Maintenance
              </Button>
            </div>
          </div>
        );
      case "database":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Database Management</h1>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border text-center">
                  <div className="text-sm text-muted-foreground">Total Records</div>
                  <div className="text-2xl font-bold text-primary">12.4M</div>
                </div>
                <div className="bg-card rounded-lg p-4 border text-center">
                  <div className="text-sm text-muted-foreground">Database Size</div>
                  <div className="text-2xl font-bold text-primary">842 GB</div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Database Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Connection Status</div>
                      <div className="text-sm text-muted-foreground">All connections healthy</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Last Backup</div>
                      <div className="text-sm text-muted-foreground">Today at 2:00 AM</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Performance</div>
                      <div className="text-sm text-muted-foreground">Response time &lt; 50ms</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Backup
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">System Analytics</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">User Activity</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Usage Time</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Session Duration</span>
                    <span>18 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most Active Day</span>
                    <span>Wednesday</span>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">System Performance</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span>42 ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span>0.02%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Requests (24h)</span>
                    <span>1.2M</span>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Detailed Analytics
              </Button>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">System Settings</h1>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">General Settings</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-muted-foreground">Temporarily disable system access</div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Auto Updates</div>
                      <div className="text-sm text-muted-foreground">Automatically apply security patches</div>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="font-semibold mb-3">Notification Settings</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Email Alerts</div>
                      <div className="text-sm text-muted-foreground">Send critical alerts to admins</div>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">SMS Alerts</div>
                      <div className="text-sm text-muted-foreground">Send urgent alerts via SMS</div>
                    </div>
                    <Button variant="outline" size="sm">Disabled</Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Import Config
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-xs">
        <div>9:41</div>
        <div className="flex items-center gap-1">
          {isOffline ? (
            <WifiOff className="h-3 w-3" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {isCharging ? (
            <BatteryCharging className="h-3 w-3" />
          ) : (
            <Battery className="h-3 w-3" />
          )}
          <span>{batteryLevel}%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="font-bold">Admin Dashboard</div>
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center border-t bg-background p-2">
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "dashboard" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("dashboard")}
        >
          <Home className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "users" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("users")}
        >
          <Users className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "security" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("security")}
        >
          <Shield className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "systems" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("systems")}
        >
          <Settings className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className={activeView === "analytics" ? "text-primary" : "text-muted-foreground"}
          onClick={() => setActiveView("analytics")}
        >
          <BarChart3 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}