const MOCK_LOGS = [
  {
    id: 1,
    level: "INFO",
    message: "User login successful",
    user: "admin@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: 2,
    level: "WARNING",
    message: "High memory usage detected",
    user: "System",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 3,
    level: "ERROR",
    message: "Database connection failed",
    user: "System",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 4,
    level: "INFO",
    message: "New product created: 'Gaming Laptop'",
    user: "manager@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 5,
    level: "ERROR",
    message: "Payment gateway timeout",
    user: "customer1@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 6,
    level: "INFO",
    message: "Order #12345 shipped",
    user: "warehouse@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day 2 hours ago
  },
];

const getLogs = async (params = {}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredLogs = [...MOCK_LOGS];

  if (params.level) {
    filteredLogs = filteredLogs.filter((log) => log.level === params.level);
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.message.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower)
    );
  }

  return {
    data: {
      logs: filteredLogs,
      total: filteredLogs.length,
    },
  };
};

const logService = {
  getLogs,
};

export default logService;
