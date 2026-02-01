export function StatusIndicator({ status }) {
  const statusConfig = {
    vulnerable: {
      color: "text-green-500",
      bgColor: "bg-green-500",
      label: "Vulnerable",
    },
    secure: {
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      label: "Secure",
    },
    exploited: {
      color: "text-red-500",
      bgColor: "bg-red-500",
      label: "Exploited",
    },
  };

  const config = statusConfig[status];

  if (!config) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`size-2 ${config.bgColor} rounded-full ${
          status === "vulnerable" ? "animate-pulse" : ""
        }`}
      />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}
