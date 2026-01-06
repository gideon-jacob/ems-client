import { useState } from "react"
import { useDashboardStore } from "@/store/useDashboardStore"
import { Thermometer, Droplets, Wind, Gauge, Activity, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PIDDiagram } from "../operations/PIDDiagram"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

// Mock Trend Data for Sparklines
const MOCK_TREND = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: 20 + Math.random() * 2
}))

export function ZoneDetailsPanel() {
    const { opsSystem, equipmentState, updateEquipmentControls } = useDashboardStore()
    const { metrics, controls } = equipmentState
    const [isPIDOpen, setIsPIDOpen] = useState(false)

    // Handle Setpoint Change
    const handleSetpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateEquipmentControls({ tempSetpoint: parseFloat(e.target.value) })
    }

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2">
            {/* Header / Identity */}
            <div className="bg-[#111421] border border-white/10 p-6 rounded-xl relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 leading-normal py-1">{opsSystem}</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                CLASS 100
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ONLINE
                            </span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-32 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <MetricCard
                    label="Temperature"
                    value={metrics.supplyTemp.toFixed(1)}
                    unit="°C"
                    icon={Thermometer}
                    color="text-blue-400"
                    trend={MOCK_TREND}
                />
                <MetricCard
                    label="Humidity"
                    value={metrics.humidity.toFixed(1)}
                    unit="%"
                    icon={Droplets}
                    color="text-cyan-400"
                    trend={MOCK_TREND.map(d => ({ ...d, value: 45 + Math.random() * 5 }))}
                />
                <MetricCard
                    label="Pressure"
                    value={metrics.pressure.toFixed(1)}
                    unit="Pa"
                    icon={Gauge}
                    color="text-emerald-400"
                />
                <MetricCard
                    label="CO2 Level"
                    value={metrics.co2Level.toFixed(0)}
                    unit="ppm"
                    icon={Wind}
                    color="text-yellow-400"
                />
            </div>

            {/* Controls */}
            <div className="bg-[#111421] border border-white/10 p-6 rounded-xl space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="h-4 w-4 text-white" />
                    <h3 className="font-bold text-white text-sm">Quick Controls</h3>
                </div>

                {/* Temperature Setpoint Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Setpoint Control</span>
                        <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">
                            {controls.tempSetpoint.toFixed(1)}°C
                        </span>
                    </div>
                    <input
                        type="range"
                        min="16"
                        max="30"
                        step="0.1"
                        value={controls.tempSetpoint}
                        onChange={handleSetpointChange}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground/50">
                        <span>16°C</span>
                        <span>30°C</span>
                    </div>
                </div>

                {/* Fan Mode Toggle */}
                <div className="space-y-3">
                    <span className="text-xs text-muted-foreground">Fan Configuration</span>
                    <div className="grid grid-cols-3 gap-2">
                        {["Auto", "On", "Off"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => updateEquipmentControls({ fanMode: mode as any })}
                                className={`
                                    px-3 py-2 rounded-lg text-xs font-bold transition-all border
                                    ${controls.fanMode === mode
                                        ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                        : "bg-[#1d2135] border-white/5 text-muted-foreground hover:bg-white/5"}
                                `}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions / PID Modal */}
            <div className="mt-auto">
                <Dialog open={isPIDOpen} onOpenChange={setIsPIDOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide border border-indigo-400/30 shadow-lg shadow-indigo-500/20">
                            <Activity className="mr-2 h-4 w-4" />
                            VIEW DETAILED P&ID DIAGRAM
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] h-[80vh] bg-[#0b0d15] border-white/10 p-0 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#111421]">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-indigo-400" />
                                    System P&ID Schematic
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono mt-1">{opsSystem}</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#0f111a] relative p-8 flex items-center justify-center">
                            <div className="w-full max-w-5xl">
                                <PIDDiagram />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

function MetricCard({ label, value, unit, icon: Icon, color, trend }: any) {
    return (
        <div className="bg-[#111421] border border-white/10 p-4 rounded-xl relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-bold">{label}</span>
                <Icon className={`h-4 w-4 ${color} opacity-60`} />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className="text-xs text-muted-foreground">{unit}</span>
            </div>

            {/* Mini Trend Line */}
            {trend && (
                <div className="h-8 mt-2 -mx-2 -mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trend}>
                            <defs>
                                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="currentColor" className={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="currentColor" className={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="currentColor"
                                className={color}
                                fill={`url(#grad-${label})`}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}
