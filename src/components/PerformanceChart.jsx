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
        borderColor: "rgba(79,140,255,1)",
        backgroundColor: "rgba(79,140,255,0.15)",
        tension: 0.35
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "rgba(255,255,255,0.8)" } }
    },
    scales: {
      x: { ticks: { color: "rgba(255,255,255,0.6)" }, grid: { color: "rgba(255,255,255,0.08)" } },
      y: { ticks: { color: "rgba(255,255,255,0.6)" }, grid: { color: "rgba(255,255,255,0.08)" }, min: 0, max: 100 }
    }
  };

  return (
    <div className="card">
      <div className="font-bold mb-3">Performance Trend</div>
      <Line data={chartData} options={options} />
    </div>
  );
}