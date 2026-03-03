import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import ChatBot from "./components/ChatBot";
import {
  Settings,
  Bot,
  ClipboardList,
  BarChart3,
  FileText,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const assistantRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scrollToAssistant = () => {
    assistantRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white px-20 py-12">

      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-4xl font-bold flex items-center gap-3 text-gray-800">
          <ClipboardList size={40} className="text-blue-600" />
          Smart-Life-Scheduler
        </h1>

        <div className="relative group">
          <button className="flex items-center gap-2 bg-gray-200 px-6 py-2 rounded-full hover:bg-gray-300 transition">
            <Settings size={18} />
            Settings
          </button>

          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div  className="grid md:grid-cols-2 gap-20 items-center">

        {/* Left Cards */}
        <div className="grid grid-cols-2 gap-10">

          <Card
            icon={<Bot size={60} className="text-blue-500" />}
            title="Smart Assistant Chat"
            onClick={scrollToAssistant}
          />

          <Card
            icon={<ClipboardList size={60} className="text-green-500" />}
            title="Tasks"
            onClick={() => navigate("/tasks")}
          />

          <Card
            icon={<BarChart3 size={60} className="text-yellow-500" />}
            title="Analytics"
            onClick={() => navigate("/analytics")}
          />

          <Card
            icon={<FileText size={60} className="text-orange-500" />}
            title="Reports"
            onClick={() => alert("Reports Coming Soon")}
          />

        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">
          <img
            src="/illustration.png"
            alt="Dashboard Illustration"
            className="w-[600px]"
          />
        </div>

      </div>

      {/* Assistant Section */}
      <div ref={assistantRef} className="mt-24">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Smart Assistant
        </h2>
        <ChatBot />
      </div>

    </div>
  );
}

function Card({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-10 flex flex-col items-center justify-center cursor-pointer"
    >
      {icon}
      <h2 className="mt-6 text-xl font-semibold text-gray-700 text-center">
        {title}
      </h2>
    </div>
  );
}

export default Dashboard;
