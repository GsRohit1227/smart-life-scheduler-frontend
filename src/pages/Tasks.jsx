import { useState, useEffect } from "react";
import API from "../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

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

  // 🔥 Notify Analytics that tasks changed
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
        deadline: new Date(),
        startTime: "09:00",
      });

      setTitle("");
      await fetchTasks();
      notifyAnalytics(); // 🔥 trigger refresh
    } catch (err) {
      console.log("Add Task Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
      notifyAnalytics(); // 🔥 trigger refresh
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
      notifyAnalytics(); // 🔥 trigger refresh
    } catch (err) {
      console.log("Toggle Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <p className="mb-4 text-gray-600">
        Total Tasks: {tasks.length}
      </p>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-400">No tasks yet</p>
        )}

        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex justify-between items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition ${
              task.completed ? "opacity-70" : ""
            }`}
          >
            <div className="flex flex-col">
              <span
                className={`font-semibold text-lg ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>

              <div className="flex gap-2 mt-2 items-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority}
                </span>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    task.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {task.completed ? "Completed" : "Active"}
                </span>

                <span className="text-xs text-gray-500">
                  ⏳ {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleToggleComplete(task._id, task.completed)
                }
                className={`px-4 py-2 rounded-lg transition ${
                  task.completed
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {task.completed ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
