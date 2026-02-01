import { ArrowRight, Clock } from "lucide-react";
import { StatusIndicator } from "./Statusindicator";

export function LabCard({ lab, onSelect }) {
  return (
    <div
      className="bg-[#0d1238] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-500/5 group cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
            {lab.name}
          </h3>
          <p className="text-sm text-gray-400">{lab.description}</p>
        </div>
        <ArrowRight className="size-5 text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
        <StatusIndicator status={lab.status} />

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="size-4" />
          <span>{lab.attempts} attempts</span>
        </div>

        {lab.completed && (
          <div className="ml-auto">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
              Completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
