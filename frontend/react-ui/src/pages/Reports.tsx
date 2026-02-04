import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface HourlyData {
    hour: string;
    tokens: number;
}

interface DepartmentData {
    department: string;
    served: number;
}

interface JsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY: number;
    };
}

export default function Reports() {
    const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // ✅ EXPORT FUNCTIONS (OUTSIDE useEffect)
    const exportCSV = () => {
        const rows = [
            ["Hour", "Tokens"],
            ...hourlyData.map(d => [d.hour, d.tokens]),
        ];

        const csvContent = rows.map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "token_report.csv";
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF() as JsPDFWithAutoTable;

        doc.text("MediQueue - Reports", 14, 15);

        autoTable(doc, {
            startY: 20,
            head: [["Hour", "Tokens"]],
            body: hourlyData.map(d => [d.hour, d.tokens]),
        });

        autoTable(doc, {
            startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20,
            head: [["Department", "Tokens Served"]],
            body: departmentData.map(d => [d.department, d.served]),
        });

        doc.save("mediqueue_report.pdf");
    };

    // ✅ DATA FETCHING
    useEffect(() => {
        const fetchReports = () => {
            setHourlyData([
                { hour: "9 AM", tokens: Math.floor(Math.random() * 30) },
                { hour: "10 AM", tokens: Math.floor(Math.random() * 30) },
                { hour: "11 AM", tokens: Math.floor(Math.random() * 30) },
                { hour: "12 PM", tokens: Math.floor(Math.random() * 30) },
                { hour: "1 PM", tokens: Math.floor(Math.random() * 30) },
            ]);

            setDepartmentData([
                { department: "General", served: Math.floor(Math.random() * 40) },
                { department: "Pediatrics", served: Math.floor(Math.random() * 25) },
                { department: "Ortho", served: Math.floor(Math.random() * 20) },
            ]);

            setLastUpdated(new Date());
        };

        fetchReports();
        const interval = setInterval(fetchReports, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="page-header">
                <h2>Reports & Analytics</h2>
                <small className="muted">
                    Auto-refreshes every 5 seconds
                    {lastUpdated && ` · Last updated at ${lastUpdated.toLocaleTimeString()}`}
                </small>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <button className="primary" onClick={exportCSV}>Export CSV</button>
                <button className="secondary" onClick={exportPDF}>Export PDF</button>
            </div>

            <div className="chart-grid">
                <div className="chart-card">
                    <h3>Tokens Generated per Hour</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={hourlyData}>
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="tokens"
                                stroke="#0b5ed7"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Tokens Served by Department</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={departmentData}>
                            <XAxis dataKey="department" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="served" fill="#198754" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
