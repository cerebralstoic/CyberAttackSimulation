import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { LAB_CATEGORIES } from "../constants";

export function Sidebar({
  collapsed,
  onToggle,
  onLabSelect,
  selectedLabId,
}) {
  const [expandedCategories, setExpandedCategories] = useState(
    new Set(["sql-injection", "xss", "cmdi", "upload"])
  );

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0d1238] border-r border-gray-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } overflow-y-auto`}
    >
      <div className="p-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-400 hover:text-gray-200"
        >
          {collapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Lab Categories
            </h3>
          </div>

          <div className="space-y-1">
            {LAB_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id}>
                  <button
                    onClick={() =>
                      !category.comingSoon && toggleCategory(category.id)
                    }
                    disabled={category.comingSoon}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      category.comingSoon
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-gray-100"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1 text-left truncate">
                      {category.name}
                    </span>
                    {category.comingSoon ? (
                      <span className="text-xs text-gray-600">Soon</span>
                    ) : (
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isExpanded &&
                    !category.comingSoon &&
                    category.labs.length > 0 && (
                      <div className="mt-1 ml-4 space-y-1">
                        {category.labs.map((lab) => (
                          <button
                            key={lab.id}
                            onClick={() =>
                              onLabSelect({
                                id: lab.id,
                                category: category.id,
                                type: lab.type,
                                name: lab.name,
                                description: `Practice ${lab.name} techniques in a controlled environment.`,
                                status: lab.status,
                                attempts: lab.attempts,
                                completed: lab.completed,
                              })
                            }
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedLabId === lab.id
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                            }`}
                          >
                            <div
                              className={`size-1.5 rounded-full shrink-0 ${
                                lab.status === "vulnerable"
                                  ? "bg-green-500 animate-pulse"
                                  : lab.status === "secure"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="flex-1 text-left truncate">
                              {lab.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
