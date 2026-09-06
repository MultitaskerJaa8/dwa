import dynamic from "next/dynamic";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });

let registered = false;

export default function BarChart({ title, labels = [], data = [] }) {
  useEffect(() => {
    if (!registered) {
      ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
      registered = true;
    }
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Final Score",
        data,
        backgroundColor: "rgba(37, 99, 235, 0.18)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1
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
        <div className="font-extrabold tracking-tight text-slate-900">{title}</div>
        <div className="text-xs muted mt-1">Top performers for selected period</div>
      </div>
      <div className="card-bd">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}