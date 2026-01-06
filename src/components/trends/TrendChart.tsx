import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { format } from "date-fns"

interface TrendChartProps {
    data: any[]
    system: "HVAC" | "BMS" | "EMS" | "ALL"
}

export function TrendChart({ data, system }: TrendChartProps) {
    // Config based on System
    const config = getChartConfig(system)

    return (
        <div className="w-full h-[400px] bg-[#111421] border border-white/10 rounded-xl p-4 relative">
            {/* Debug Info */}
            <div className="absolute top-2 right-2 text-[10px] text-gray-500 z-50">
                Points: {data?.length || 0}
            </div>

            {(!data || data.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                    No Data Available / Loading...
                </div>
            )}

            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                    {config.series.map(s => (
                        <div key={s.key} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.stroke }} />
                            <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                            <span className="text-sm font-bold text-white">
                                {data.length > 0 ? data[data.length - 1][s.key] : "-"} {s.unit}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    {/* Legend or other controls could go here */}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        {config.series.map(s => (
                            <linearGradient key={s.key} id={`grad${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={s.stroke} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={s.stroke} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(t) => format(new Date(t), "HH:mm")}
                        stroke="#4b5563"
                        fontSize={10}
                        tickMargin={10}
                    />

                    {/* Primary Y Axis (Left) */}
                    <YAxis
                        yAxisId="left"
                        stroke="#4b5563"
                        fontSize={10}
                        unit={config.leftUnit}
                        domain={config.leftDomain as [string | number, string | number]}
                    />

                    {/* Secondary Y Axis (Right) */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#4b5563"
                        fontSize={10}
                        unit={config.rightUnit}
                        domain={config.rightDomain as [string | number, string | number]}
                    />

                    <Tooltip
                        contentStyle={{ backgroundColor: "#1d2135", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        labelFormatter={(t) => format(new Date(t), "MMM dd, HH:mm:ss")}
                        itemStyle={{ fontSize: 12 }}
                    />

                    {config.series.map(s => (
                        <Area
                            key={s.key}
                            yAxisId={s.axis}
                            type="monotone"
                            dataKey={s.key}
                            stroke={s.stroke}
                            fill={`url(#grad${s.key})`}
                            strokeWidth={2}
                            isAnimationActive={false} // Disable animation for smoother live updates
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

function getChartConfig(system: string) {
    switch (system) {
        case "BMS":
            return {
                leftUnit: " kW",
                rightUnit: " %",
                leftDomain: [0, 'auto'],
                rightDomain: [0, 100],
                series: [
                    { key: "power", label: "Power Usage", stroke: "#f97316", axis: "left", unit: "kW" },
                    { key: "fanSpeed", label: "Fan Speed", stroke: "#3b82f6", axis: "right", unit: "%" },
                ]
            }
        case "EMS":
            return {
                leftUnit: "",
                rightUnit: " Pa",
                leftDomain: [0, 'auto'], // Particles can spike
                rightDomain: [0, 60],
                series: [
                    { key: "particles", label: "Particle Count (0.5µm)", stroke: "#ef4444", axis: "left", unit: "/ft³" },
                    { key: "pressure", label: "Diff Pressure", stroke: "#10b981", axis: "right", unit: "Pa" },
                ]
            }
        case "HVAC":
        default:
            return {
                leftUnit: " °C",
                rightUnit: " %",
                leftDomain: ['auto', 'auto'],
                rightDomain: [0, 100],
                series: [
                    { key: "supplyTemp", label: "Supply Temp", stroke: "#3b82f6", axis: "left", unit: "°C" },
                    { key: "returnTemp", label: "Return Temp", stroke: "#8b5cf6", axis: "left", unit: "°C" },
                    { key: "humidity", label: "Humidity", stroke: "#06b6d4", axis: "right", unit: "%" },
                ]
            }
    }
}
