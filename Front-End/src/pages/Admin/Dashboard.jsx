import React, { useState, useEffect } from "react";
import { clearCache } from "../../services/adminService";
import logService from "../../services/logService";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, CreditCard, Activity, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StatCard = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [filter, setFilter] = useState("ALL"); // ALL, ERROR, WARNING, INFO
  const [search, setSearch] = useState("");

  const {
    data: logsData,
    isLoading: logsLoading,
    isError: logsError,
  } = useQuery({
    queryKey: ["system-logs", filter, search],
    queryFn: () =>
      logService.getLogs({
        level: filter === "ALL" ? null : filter,
        search: search || null,
      }),
    keepPreviousData: true,
    onError: () => toast.error("Failed to load system logs"),
  });

  const logs = logsData?.data?.logs || [];

  const handleClearCache = async () => {
    try {
      await clearCache();
      toast.success("Cache cleared successfully.");
    } catch (err) {
      toast.error("Failed to clear cache.");
    }
  }

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case "ERROR":
        return "destructive";
      case "WARNING":
        return "warning"; // Assuming you have a warning variant, otherwise use secondary or default
      case "INFO":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <AdminNav />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Revenue" value="$45,231.89" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} description="+20.1% from last month" />
        <StatCard title="Subscriptions" value="+2350" icon={<Users className="h-4 w-4 text-muted-foreground" />} description="+180.1% from last month" />
        <StatCard title="Sales" value="+12,234" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} description="+19% from last month" />
        <StatCard title="Active Now" value="+573" icon={<Activity className="h-4 w-4 text-muted-foreground" />} description="+201 since last hour" />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Logs</CardTitle>
          <Button onClick={handleClearCache} variant="outline">Clear Cache</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="ALL">All Logs</TabsTrigger>
                <TabsTrigger value="ERROR">Error</TabsTrigger>
                <TabsTrigger value="WARNING">Warning</TabsTrigger>
                <TabsTrigger value="INFO">Info</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {logsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : logsError ? (
            <div className="p-8 text-center text-destructive">
              Error loading logs. Please try again.
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No logs found matching your criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="text-muted-foreground">{log.user}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
