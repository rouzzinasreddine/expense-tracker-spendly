"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#30353d] border border-[#464554]/20 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-mono font-bold text-[#c0c1ff]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function DashboardChart({ data }: { data: { day: string; amount: number }[] }) {
  const activeBarIndex = data.length > 0 ? data.length - 1 : 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        barCategoryGap="30%"
      >
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(192,193,255,0.04)" }} />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={index === activeBarIndex ? "#c0c1ff" : "rgba(192,193,255,0.25)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
