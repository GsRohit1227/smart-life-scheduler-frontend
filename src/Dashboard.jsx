import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api";

function Dashboard() {
  const navigate = useNavigate();
  const [taskCount, setTaskCount] = useState(0);

  const fetchTaskCount = async () => {
    try {
      const res = await API.get("/tasks");
      setTaskCount(res.data.tasks.length);
    } catch (error) {
      console.error("Task Count Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTaskCount();

    const handleTaskUpdate = () => {
      fetchTaskCount();
    };

    window.addEventListener("tasksUpdated", handleTaskUpdate);

    const interval = setInterval(() => {
      fetchTaskCount();
    }, 10000);

    return () => {
      window.removeEventListener("tasksUpdated", handleTaskUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">

        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          Smart Life
        </div>

        <nav className="flex-1 p-4 space-y-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            🏠 Overview
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            <span>📋 Tasks</span>
            <span className="bg-indigo-600 text-xs px-2 py-1 rounded-full">
              {taskCount}
            </span>
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            📊 Analytics
          </button>

          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            🧠 Reports
          </button>

          <button
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            ⚙ Settings
          </button>

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Welcome to Smart Life Scheduler 🚀
        </h1>
      </div>

    </div>
  );
}

export default Dashboard;