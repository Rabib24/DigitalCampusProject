"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Router, 
  Globe, 
  Activity, 
  Zap, 
  Shield,
  Upload,
  Download
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ITAdminNetworkView() {
  const networkStatus = [
    {
      id: "CORE-01",
      name: "Core Router",
      status: "Operational",
      bandwidth: "1.2 Gbps",
      utilization: "65%",
      latency: "12ms"
    },
    {
      id: "FW-01",
      name: "Firewall",
      status: "Operational",
      bandwidth: "980 Mbps",
      utilization: "52%",
      latency: "8ms"
    },
    {
      id: "SW-01",
      name: "Core Switch",
      status: "Degraded",
      bandwidth: "2.1 Gbps",
      utilization: "89%",
      latency: "25ms"
    },
    {
      id: "LB-01",
      name: "Load Balancer",
      status: "Operational",
      bandwidth: "1.8 Gbps",
      utilization: "72%",
      latency: "15ms"
    }
  ];

  const bandwidthData = [
    { time: "00:00", inbound: 120, outbound: 85 },
    { time: "04:00", inbound: 95, outbound: 60 },
    { time: "08:00", inbound: 420, outbound: 380 },
    { time: "12:00", inbound: 680, outbound: 520 },
    { time: "16:00", inbound: 750, outbound: 690 },
    { time: "20:00", inbound: 580, outbound: 420 }
  ];

  const networkMetrics = [
    {
      title: "Total Bandwidth",
      value: "5.0 Gbps",
      change: "+0.5 Gbps from upgrade",
      icon: Wifi
    },
    {
      title: "Active Connections",
      value: "12,450",
      change: "+890 from last hour",
      icon: Activity
    },
    {
      title: "Avg. Latency",
      value: "15ms",
      change: "-3ms from last week",
      icon: Zap
    },
    {
      title: "Security Events",
      value: "24",
      change: "+3 from yesterday",
      icon: Shield
    }
  ];

  const trafficStats = [
    { 
      id: "TR-001", 
      type: "Web Traffic", 
      volume: "2.4 TB", 
      change: "+12% this week" 
    },
    { 
      id: "TR-002", 
      type: "API Calls", 
      volume: "45.2M", 
      change: "+8% this week" 
    },
    { 
      id: "TR-003", 
      type: "File Transfers", 
      volume: "890 GB", 
      change: "+5% this week" 
    },
    { 
      id: "TR-004", 
      type: "Video Streaming", 
      volume: "1.2 PB", 
      change: "+15% this week" 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Network Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage network infrastructure and connectivity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {networkMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bandwidth Utilization</CardTitle>
            <CardDescription>
              Inbound and outbound traffic over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={bandwidthData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="inbound" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Inbound (Mbps)" />
                <Area type="monotone" dataKey="outbound" stackId="1" stroke="#10b981" fill="#10b981" name="Outbound (Mbps)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Statistics</CardTitle>
            <CardDescription>
              Data volume by traffic type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.type}</p>
                    <p className="text-xs text-muted-foreground">{stat.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.volume}</p>
                    <p className="text-xs text-green-500">
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Infrastructure</CardTitle>
          <CardDescription>
            Status of critical network components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkStatus.map((device, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${
                    device.status === "Operational" 
                      ? "bg-green-500" 
                      : device.status === "Degraded" 
                      ? "bg-yellow-500" 
                      : "bg-red-500"
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{device.name}</p>
                    <p className="text-xs text-muted-foreground">{device.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Bandwidth</p>
                    <p className="text-sm font-medium">{device.bandwidth}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="text-sm font-medium">{device.utilization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-sm font-medium">{device.latency}</p>
                  </div>
                  <Badge 
                    variant={
                      device.status === "Operational" 
                        ? "default" 
                        : device.status === "Degraded" 
                        ? "destructive" 
                        : "secondary"
                    }
                  >
                    {device.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Tools</CardTitle>
          <CardDescription>
            Quick access to network management utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Activity className="mr-2 h-4 w-4" />
              Network Diagnostics
            </Button>
            <Button variant="outline">
              <Router className="mr-2 h-4 w-4" />
              Router Configuration
            </Button>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Firewall Rules
            </Button>
            <Button variant="outline">
              <Globe className="mr-2 h-4 w-4" />
              DNS Management
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bandwidth Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}