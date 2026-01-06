import { format } from "date-fns"
// Trend Table Component
import type { TrendDataPoint } from "@/hooks/useTrendData"

export function TrendTable({ data, system, showAll = false }: { data: TrendDataPoint[], system: string, showAll?: boolean }) {
    // Show only last 10 records descending unless showAll is true
    const recentData = [...data].reverse().slice(0, showAll ? undefined : 10)

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-white/5 text-xs text-muted-foreground uppercase bg-[#1d2135]/50">
                        <th className="px-4 py-3 font-medium">Timestamp</th>

                        {system === "HVAC" && (
                            <>
                                <th className="px-4 py-3 font-medium">Supply Temp</th>
                                <th className="px-4 py-3 font-medium">Return Temp</th>
                                <th className="px-4 py-3 font-medium">Humidity</th>
                            </>
                        )}
                        {system === "BMS" && (
                            <>
                                <th className="px-4 py-3 font-medium">Power</th>
                                <th className="px-4 py-3 font-medium">Valve Pos</th>
                                <th className="px-4 py-3 font-medium">Fan Speed</th>
                            </>
                        )}
                        {system === "EMS" && (
                            <>
                                <th className="px-4 py-3 font-medium">Particle Count</th>
                                <th className="px-4 py-3 font-medium">Diff Pressure</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {recentData.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                                {format(new Date(row.timestamp), "MMM dd, HH:mm:ss")}
                            </td>

                            {system === "HVAC" && (
                                <>
                                    <td className="px-4 py-3 font-mono text-blue-400">{row.supplyTemp}°C</td>
                                    <td className="px-4 py-3 font-mono text-purple-400">{row.returnTemp}°C</td>
                                    <td className="px-4 py-3 font-mono text-cyan-400">{row.humidity}%</td>
                                </>
                            )}
                            {system === "BMS" && (
                                <>
                                    <td className="px-4 py-3 font-mono text-orange-400">{row.power} kW</td>
                                    <td className="px-4 py-3 font-mono text-gray-300">{row.valvePos}%</td>
                                    <td className="px-4 py-3 font-mono text-blue-400">{row.fanSpeed}%</td>
                                </>
                            )}
                            {system === "EMS" && (
                                <>
                                    <td className="px-4 py-3 font-mono text-red-400">{row.particles}</td>
                                    <td className="px-4 py-3 font-mono text-emerald-400">{row.pressure} Pa</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
