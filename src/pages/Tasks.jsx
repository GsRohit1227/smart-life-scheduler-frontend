import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.log("Fetch Tasks Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const notifyAnalytics = () => {
    window.dispatchEvent(new Event("tasksUpdated"));
  };

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/tasks", {
        title,
        description: "",
        date: new Date(),
        priority: "Low",
        duration: 30,
        deadline: selectedDate,
        startTime: "09:00",
      });

      setTitle("");
      await fetchTasks();
      notifyAnalytics();
    } catch (err) {
      console.log("Add Task Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
      notifyAnalytics();
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await API.patch(`/tasks/${id}`, {
        completed: !currentStatus,
      });

      await fetchTasks();
      notifyAnalytics();
    } catch (err) {
      console.log("Toggle Error:", err.response?.data || err.message);
    }
  };

  const tasksForSelectedDate = tasks.filter((task) => {
    if (!task.deadline) return false;
    return (
      new Date(task.deadline).toDateString() ===
      selectedDate.toDateString()
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] p-10 text-white">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-10 tracking-wide">
        🗂 Task Manager
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-8">

          {/* ADD TASK CARD */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-200">
              Add New Task
            </h2>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter task name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-[#1f2937] border border-gray-700 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-xl font-medium transition shadow-lg"
              >
                Add Task
              </button>
            </div>
          </div>

          {/* TASK LIST */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="mb-6 text-gray-400">
              Total Tasks: {tasks.length}
            </h3>

            <div className="space-y-5">
              {tasks.length === 0 && (
                <p className="text-gray-500">No tasks yet</p>
              )}

              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex justify-between items-center bg-[#1f2937] border border-gray-700 rounded-xl p-5 transition hover:scale-[1.02] ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <p
                      className={`text-lg font-semibold ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      📅 {new Date(task.deadline).toDateString()}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        handleToggleComplete(task._id, task.completed)
                      }
                      className={`px-5 py-2 rounded-lg font-medium transition ${
                        task.completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {task.completed ? "Undo" : "Done"}
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="space-y-8">

          {/* CALENDAR CARD */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-200">
              Select Date
            </h2>

            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
              />
            </div>
          </div>

          {/* TASKS FOR SELECTED DATE */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Tasks for {selectedDate.toDateString()}
            </h3>

            {tasksForSelectedDate.length === 0 ? (
              <p className="text-gray-500">
                No tasks for this date
              </p>
            ) : (
              <div className="space-y-4">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task._id}
                    className="bg-[#1f2937] border border-gray-700 p-4 rounded-lg"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Tasks;
