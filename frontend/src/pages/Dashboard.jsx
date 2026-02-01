import { Activity, CheckCircle2, Target, TrendingUp } from "lucide-react";
import { LabCard } from "../components/Labcard.jsx";

const activeLabs = [
  {
    id: "xss-2",
    category: "xss",
    type: "stored",
    name: "Stored XSS",
    description:
      "Learn how stored XSS attacks work and how to identify vulnerable input fields.",
    status: "vulnerable",
    attempts: 2,
    completed: false,
  },
  {
    id: "sql-2",
    category: "sql-injection",
    type: "basic",
    name: "Blind SQL Injection",
    description:
      "Practice blind SQL injection techniques using boolean-based and time-based attacks.",
    status: "secure",
    attempts: 3,
    completed: false,
  },
];

const completedLabs = [
  {
    id: "xss-1",
    category: "xss",
    type: "reflected",
    name: "Reflected XSS",
    description:
      "Master reflected XSS by exploiting unvalidated user input in web applications.",
    status: "exploited",
    attempts: 5,
    completed: true,
  },
];

export function Dashboard({ onLabSelect }) {
  const stats = [
    {
      icon: Activity,
      label: "Active Labs",
      value: "2",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: "1",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Target,
      label: "Total Attempts",
      value: "10",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "67%",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="max-w-7xl">
    
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-3">
          Welcome to Cyber Attack Simulation
        </h1>
        <p className="text-gray-400 max-w-2xl">
          A professional security training platform for hands-on practice with
          real-world attack scenarios. Develop practical skills in a safe,
          controlled environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#0d1238] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-semibold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Active Labs</h2>
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onSelect={() => onLabSelect(lab)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Completed Labs</h2>
          <CheckCircle2 className="size-5 text-green-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {completedLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onSelect={() => onLabSelect(lab)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
