import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../services/api";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, color, icon }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending   = tasks.filter((t) => t.status === "pending").length;
  const highPrio  = tasks.filter((t) => t.priority === "high" && t.status === "pending").length;

  // Recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);

  const priorityBadge = {
    high:   "bg-red-50 text-red-500 border border-red-100",
    medium: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    low:    "bg-green-50 text-green-600 border border-green-100",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Good day, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Here's a summary of your tasks.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-20 bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Tasks"
            value={total}
            color="bg-blue-50"
            icon={<svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard
            label="Completed"
            value={completed}
            color="bg-green-50"
            icon={<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Pending"
            value={pending}
            color="bg-yellow-50"
            icon={<svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="High Priority"
            value={highPrio}
            color="bg-red-50"
            icon={<svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          />
        </div>
      )}

      {/* Progress bar */}
      {total > 0 && !loading && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Overall Progress</p>
            <p className="text-sm font-medium text-primary-600">{Math.round((completed / total) * 100)}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{completed} of {total} tasks completed</p>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-3">No tasks yet.</p>
            <Link to="/tasks/create" className="btn-primary text-sm">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === "completed" ? "bg-green-400" : "bg-yellow-400"}`} />
                  <p className={`text-sm text-gray-700 truncate ${task.status === "completed" ? "line-through text-gray-400" : ""}`}>
                    {task.title}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-3 capitalize flex-shrink-0 ${priorityBadge[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
