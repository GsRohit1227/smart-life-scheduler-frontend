import { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const summaryRes = await API.get("/intelligence/summary");
      const productivityRes = await API.get("/intelligence/productivity");
      const recommendationRes = await API.get("/intelligence/recommendations");
      const historyRes = await API.get("/intelligence/history");

      setSummary(summaryRes.data);
      setProductivity(productivityRes.data);
      setRecommendations(recommendationRes.data.recommendations);
      setHistory(historyRes.data);
    } catch (error) {
      console.error(
        "Analytics Fetch Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const handleTaskUpdate = () => {
      fetchAnalytics();
    };

    window.addEventListener("tasksUpdated", handleTaskUpdate);

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 10000);

    return () => {
      window.removeEventListener("tasksUpdated", handleTaskUpdate);
      clearInterval(interval);
    };
  }, []);

  if (loading) return <p className="p-6">Loading analytics...</p>;

  const chartData = [
    { name: "Completed", value: summary?.completed || 0 },
    { name: "Pending", value: summary?.pending || 0 },
    { name: "Overdue", value: summary?.overdue || 0 },
  ];

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  const historyChartData = [...history]
    .reverse()
    .map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      productivity: item.productivityScore,
      health: item.healthScore,
    }));

  let currentWeekScore = 0;
  let previousWeekScore = 0;
  let difference = 0;
  let trend = "neutral";

  if (history.length >= 1) {
    currentWeekScore = history[0].productivityScore;
  }

  if (history.length >= 2) {
    previousWeekScore = history[1].productivityScore;
    difference = currentWeekScore - previousWeekScore;
    trend =
      difference > 0 ? "up" : difference < 0 ? "down" : "neutral";
  }

  const monthlyMap = {};

  history.forEach((item) => {
    const date = new Date(item.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        month: date.toLocaleString("default", { month: "short" }),
        total: 0,
        count: 0,
      };
    }

    monthlyMap[monthKey].total += item.productivityScore;
    monthlyMap[monthKey].count += 1;
  });

  const monthlyChartData = Object.values(monthlyMap).map((item) => ({
    month: item.month,
    productivity: Math.round(item.total / item.count),
  }));

  /* ===============================
     🔥 AI FORECAST LOGIC
  =============================== */

  let forecastScore = 0;
  let forecastTrend = "stable";
  let forecastConfidence = "Low";

  if (history.length >= 3) {
    const last3 = history.slice(0, 3);

    const growth1 =
      last3[0].productivityScore - last3[1].productivityScore;
    const growth2 =
      last3[1].productivityScore - last3[2].productivityScore;

    const avgGrowth = (growth1 + growth2) / 2;

    forecastScore = Math.round(
      last3[0].productivityScore + avgGrowth
    );

    if (avgGrowth > 0) forecastTrend = "improving";
    else if (avgGrowth < 0) forecastTrend = "declining";

    forecastConfidence =
      Math.abs(avgGrowth) > 5 ? "High" : "Medium";
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-gray-500">Total Tasks</h2>
          <p className="text-3xl font-bold">
            {summary?.totalTasks || 0}
          </p>
        </div>

        <div className="bg-green-100 shadow-lg rounded-2xl p-6">
          <h2 className="text-green-700">Completed</h2>
          <p className="text-3xl font-bold text-green-700">
            {summary?.completed || 0}
          </p>
        </div>

        <div className="bg-yellow-100 shadow-lg rounded-2xl p-6">
          <h2 className="text-yellow-700">Pending</h2>
          <p className="text-3xl font-bold text-yellow-700">
            {summary?.pending || 0}
          </p>
        </div>

        <div className="bg-red-100 shadow-lg rounded-2xl p-6">
          <h2 className="text-red-700">Overdue</h2>
          <p className="text-3xl font-bold text-red-700">
            {summary?.overdue || 0}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-gray-500">Weekly Change</h2>
          <p className="text-3xl font-bold">
            {difference > 0 && "+"}
            {difference}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Task Distribution
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Weekly Productivity Trend
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={historyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Productivity"
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Health Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Productivity Trend
        </h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔥 AI Forecast Card */}
      <div className="bg-indigo-50 shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          AI Forecast (Next Week)
        </h2>

        <p className="text-4xl font-bold text-indigo-700">
          {forecastScore || 0}%
        </p>

        <p className="mt-2">
          Trend:{" "}
          <span
            className={`font-semibold ${
              forecastTrend === "improving"
                ? "text-green-600"
                : forecastTrend === "declining"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {forecastTrend}
          </span>
        </p>

        <p className="mt-1 text-sm text-gray-600">
          Confidence: {forecastConfidence}
        </p>
      </div>

      {/* Recommendations */}
      <div className="bg-purple-50 shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          AI Recommendations
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))
          ) : (
            <li>No recommendations available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
