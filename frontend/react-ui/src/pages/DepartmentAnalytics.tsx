import { useEffect, useState } from "react";
import api from "../utils/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

interface Dept {
  name: string;
  total_tokens: number;
  waiting: number;
  completed: number;
}

export default function DepartmentAnalytics() {
  const [data, setData] = useState<Dept[]>([]);

  const totalPatients = data.reduce((a, b) => a + b.total_tokens, 0);
  const totalWaiting = data.reduce((a, b) => a + b.waiting, 0);
  const totalCompleted = data.reduce((a, b) => a + b.completed, 0);

  const pieData = [
    { name: "Waiting", value: totalWaiting },
    { name: "Completed", value: totalCompleted },
  ];

  const COLORS = ["#f59e0b", "#10b981"];

  useEffect(() => {
    const loadAnalytics = async () => {
      const res = await api.get("/api/analytics/departments");

      const formatted: Dept[] = res.data.map((d: Dept) => ({
        name: d.name,
        total_tokens: Number(d.total_tokens),
        waiting: Number(d.waiting),
        completed: Number(d.completed),
      }));

      setData(formatted);
    };

    loadAnalytics();

    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Department Analytics</h2>

      <div className="stats-grid">
        {data.map(d => (
          <div key={d.name} className="stat-card fancy">
            <h3>{d.name}</h3>
            <div className="stat-row">
              <span>Total</span>
              <b>{d.total_tokens}</b>
            </div>
            <div className="stat-row warning">
              <span>Waiting</span>
              <b>{d.waiting}</b>
            </div>
            <div className="stat-row success">
              <span>Completed</span>
              <b>{d.completed}</b>
            </div>
          </div>
        ))}

        <div className="stat-card">👥 Total Patients: {totalPatients}</div>
        <div className="stat-card">⏳ Waiting: {totalWaiting}</div>
        <div className="stat-card">✅ Completed: {totalCompleted}</div>
      </div>

      <div className="chart-card">
        <h3>Department Load</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="waiting" fill="#f59e0b" />
            <Bar dataKey="completed" fill="#10b981" />
            <Bar dataKey="total_tokens" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}