import React, { useState, useEffect } from "react";
import { getLogs } from "../../services/adminService";
import Loader from "../../components/common/Loader";
import AdminNav from "./AdminNav";

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
        setError("Failed to fetch logs.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <AdminNav />
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Logs</h2>
        <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-gray-800">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
