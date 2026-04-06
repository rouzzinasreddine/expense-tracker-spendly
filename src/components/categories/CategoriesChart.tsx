"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#30353d] border border-[#464554]/20 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs font-bold text-[#dee3ec]">{payload[0].name}</p>
        <p className="text-sm font-mono font-bold text-[#c0c1ff]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export function CategoriesDonutChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const topCat = data[0];

  return (
    <div className="relative w-44 h-44 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {topCat.name.toUpperCase().slice(0, 6)}
        </span>
        <span className="text-xl font-mono font-bold text-[#dee3ec]">
          {Math.round((topCat.value / data.reduce((a: number, c: any) => a + c.value, 0)) * 100)}%
        </span>
      </div>
    </div>
  );
}

export function CategoriesSpikeChart({ data, peakIdx }: { data: any[]; peakIdx: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(192,193,255,0.04)" }} />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={index === peakIdx ? "#c0c1ff" : "rgba(70,69,84,0.5)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
