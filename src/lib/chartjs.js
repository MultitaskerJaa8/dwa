import { Chart as ChartJS, registerables } from "chart.js";

const g = typeof window !== "undefined" ? window : global;

// register only once (prevents Fast Refresh canvas issues)
if (!g.__chartjs_registered__) {
  ChartJS.register(...registerables);
  g.__chartjs_registered__ = true;
}

export { ChartJS };
