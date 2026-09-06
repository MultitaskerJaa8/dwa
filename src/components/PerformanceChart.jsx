import dynamic from "next/dynamic";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), { ssr: false });

let registered = false;

export default function PerformanceChart({ labels = [], data = [] }) {
  useEffect(() => {
    if (!registered) {
      ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
      registered = true;
    }
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Approved Score",
        data,
        borderColor: "rgba(37, 99, 235, 1)",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        pointBackgroundColor: "rgba(37, 99, 235, 1)",
        tension: 0.35
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#0f172a" } }
    },
    scales: {
      x: { ticks: { color: "#475569" }, grid: { color: "rgba(15,23,42,0.06)" } },
      y: { ticks: { color: "#475569" }, grid: { color: "rgba(15,23,42,0.06)" }, min: 0, max: 100 }
    }
  };

  return (
    <div className="card">
      <div className="card-hd">
        <div className="font-extrabold tracking-tight text-slate-900">Performance Trend</div>
        <div className="text-xs muted mt-1">Last 6 months average of approved scores</div>
      </div>
      <div className="card-bd">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}