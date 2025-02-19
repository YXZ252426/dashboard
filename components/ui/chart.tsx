import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// 注册所需的组件
ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

export function ProbabilityChart({ probabilities }: { probabilities: number[] }) {
  // 这里你可以根据你在表格里的映射关系进行标注
  // 例如 (N)=正常, (D)=糖尿病, ...
  const labels = ["正常(N)", "糖尿病(D)", "青光眼(G)", "白内障(C)", "AMD(A)", "高血压(H)", "近视(M)", "其他(O)"];

  const data = {
    labels,
    datasets: [
      {
        label: "患病概率",
        data: probabilities,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // 让条形图水平展示，可根据喜好
    scales: {
      x: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.1,
        },
      },
    },
  };

  return (
    <div className="max-w-xl">
      <Bar data={data} options={options} />
    </div>
  );
}