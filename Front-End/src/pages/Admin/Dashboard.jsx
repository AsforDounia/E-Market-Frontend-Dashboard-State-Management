import React, { useState, useEffect } from "react";
import { getLogs, clearCache } from "../../services/adminService";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        setLogs(data.logs);
      } catch (err) {
        setError("Failed to fetch logs.");
        toast.error("Failed to fetch logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);
  
  const handleClearCache = async () => {
      try {
          await clearCache();
          toast.success("Cache cleared successfully.");
      } catch (err) {
          toast.error("Failed to clear cache.");
      }
  }

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
          <CardTitle>Recent Logs</CardTitle>
          <Button onClick={handleClearCache} variant="outline">Clear Cache</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
