import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Trophy
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { subscribeToLeaderboard } from "../services/leaderboard.services";
import { listenToUserStats } from "../services/user.service";

export function RightSidebar() {
  const [userData, setUserData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubUser = listenToUserStats(
      auth.currentUser.uid,
      (data) => {
        setUserData(data);
      }
    );

    const unsubLeaderboard = subscribeToLeaderboard(setLeaderboard);
    return () => {
      unsubUser();
      unsubLeaderboard();
    };
  }, []);

  if (!userData) {
    return (
      <div className="text-gray-400">
        Loading dashboard stats...
      </div>
    );
  }
  const stats = userData.stats || {};
  const streak = userData.streak || {current: 0};

  const successRate =
    stats.totalLabsStarted > 0
      ? Math.round(
          (stats.totalLabsCompleted /
            stats.totalLabsStarted) *
            100
        )
      : 0;

  const completionProgress =
    stats.totalLabsStarted > 0
      ? Math.round(
          (stats.totalLabsCompleted /
            stats.totalLabsStarted) *
            100
        )
      : 0;


  return (
    <aside className={`fixed right-0 top-16 h-[calc(100vh-4rem)] w-70 bg-[#0d1238] border-r p-2 border-gray-800 transition-all duration-300 overflow-y-auto`}>

      <div className="bg-[#0d1238] border border-[#1e2939] rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">
          Your Security Snapshot
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">
              Completion Progress
            </span>
            <span className="text-blue-400 font-medium">
              {completionProgress}%
            </span>
          </div>
          <div className="h-2 bg-[#1e2939] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-purple-600 transition-all"
              style={{ width: `${completionProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-2">

        <div className="bg-[#0d1238] border border-[#1e2939] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                Labs Completed
              </p>
              <p className="text-2xl font-bold">
                {stats.totalLabsCompleted || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1238] border border-[#1e2939] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                Success Rate
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {successRate}%
                </p>
                <TrendingUp className="size-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1238] border border-[#1e2939] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Zap className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold">
                {streak.current}
                <span className="text-base text-gray-500">
                  {" "}days
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-[#0d1238] border border-[#1e2939] rounded-xl p-5 mt-2">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="size-5 text-[#fdc700]" />
          <h3 className="font-semibold">
            Top Performers
          </h3>
        </div>

        {leaderboard?.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className="flex justify-between text-sm py-2 border-b border-[#1e2939] last:border-none"
          >
            <span className="text-gray-300">
              #{user.rank} {user.name || user.email}
            </span>
            <span className="text-green-400 font-medium">
              {user.stats?.totalLabsCompleted || 0}
            </span>
          </div>
        ))}

        {leaderboard?.length === 0 && (
          <p className="text-sm text-gray-500">
            No leaderboard data.
          </p>
        )}
      </div>

    </aside>
  );
}