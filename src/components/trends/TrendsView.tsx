import { useState } from "react"
import { ChevronDown, Activity, Zap, Wind } from "lucide-react"

import { useTrendData } from "@/hooks/useTrendData"
import { TrendChart } from "./TrendChart"
import { TrendTable } from "@/components/trends/TrendTable"
import { cn } from "@/lib/utils"

const FLOORS = [
    { id: "lv1", label: "Level 1 (Production)" },
    { id: "lv2", label: "Level 2 (Labs)" },
    { id: "lv3", label: "Level 3 (Tech)" },
    { id: "wh", label: "Warehouse" },
]

const ZONES_BY_FLOOR: Record<string, any[]> = {
    "lv1": [
        { id: "ISO5", label: "Grade A ISO 5" },
        { id: "GF01", label: "AHU-GF-01 (Grade D)" },
        { id: "GF16", label: "AHU-GF-16 (Grade C)" }
    ],
    "lv2": [
        { id: "LAB01", label: "Microbiology Lab" },
        { id: "QC", label: "Quality Control" }
    ],
    "lv3": [{ id: "AHU_DECK", label: "AHU Deck" }],
    "wh": [
        { id: "WH_COLD", label: "Cold Room (2-8°C)" },
        { id: "WH_FRZ", label: "Deep Freeze (-20°C)" },
        { id: "WH_AMB", label: "Ambient Storage" }
    ]
}

const SYSTEMS = [
    { id: "HVAC", label: "HVAC System", icon: Wind, color: "text-blue-400" },
    { id: "BMS", label: "BMS Power", icon: Zap, color: "text-orange-400" },
    { id: "EMS", label: "Env. Monitoring", icon: Activity, color: "text-emerald-400" },
]

export function TrendsView() {
    const [selectedFloor, setSelectedFloor] = useState("lv1")
    const [selectedZone, setSelectedZone] = useState("ISO5")
    const [selectedSystem, setSelectedSystem] = useState<"HVAC" | "BMS" | "EMS">("HVAC")
    const [timeRange, setTimeRange] = useState("24H")
    const [showAllRecords, setShowAllRecords] = useState(false)

    // Get Simulated Living Data
    const data = useTrendData(selectedZone, selectedSystem, timeRange as any)

    // Handle Floor Change -> Reset Zone
    const currentZones = ZONES_BY_FLOOR[selectedFloor] || []
    const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const floor = e.target.value
        setSelectedFloor(floor)
        setSelectedZone(ZONES_BY_FLOOR[floor]?.[0]?.id || "")
    }

    return (
        <div className="max-w-7xl mx-auto p-6 h-full overflow-auto space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-500" />
                        Building Trends Console
                    </h1>
                    <p className="text-sm text-muted-foreground">Historical and Real-time performance analytics</p>
                </div>

                <div className="flex items-center gap-2 bg-[#111421] p-1 rounded-lg border border-white/10">
                    {["1H", "24H", "7D", "30D"].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded transition-all",
                                timeRange === range ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selection Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Zone Selector */}
                <div className="md:col-span-4 bg-[#111421] border border-white/10 rounded-xl p-4 flex gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1.5 block">Floor</label>
                        <div className="relative">
                            <select
                                value={selectedFloor}
                                onChange={handleFloorChange}
                                className="w-full bg-[#1d2135] border border-white/10 rounded-lg h-9 pl-3 pr-8 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                {FLOORS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1.5 block">Zone / Room</label>
                        <div className="relative">
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                className="w-full bg-[#1d2135] border border-white/10 rounded-lg h-9 pl-3 pr-8 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                {currentZones.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* System Tabs */}
                <div className="md:col-span-8 bg-[#111421] border border-white/10 rounded-xl p-2 flex items-center justify-between">
                    {SYSTEMS.map(sys => {
                        const Icon = sys.icon
                        const isActive = selectedSystem === sys.id
                        return (
                            <button
                                key={sys.id}
                                onClick={() => setSelectedSystem(sys.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 h-full rounded-lg transition-all mx-1",
                                    isActive ? "bg-[#1d2135] shadow-sm border border-white/5" : "hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? sys.color : "text-muted-foreground")} />
                                <span className={cn("text-sm font-medium", isActive ? "text-white" : "text-muted-foreground")}>{sys.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Chart */}
            <div className="min-h-[400px]">
                <TrendChart data={data} system={selectedSystem} />
            </div>

            {/* Data Table */}
            <div className="bg-[#111421] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="font-bold text-white text-sm">Detailed Data Log</h3>
                    <span
                        onClick={() => setShowAllRecords(!showAllRecords)}
                        className="text-xs text-blue-400 cursor-pointer hover:underline select-none"
                    >
                        {showAllRecords ? "View Recent Only" : "View All Records"}
                    </span>
                </div>
                <div className={cn("transition-all duration-300", showAllRecords ? "max-h-[600px] overflow-y-auto" : "")}>
                    <TrendTable data={data} system={selectedSystem} showAll={showAllRecords} />
                </div>
            </div>
        </div>
    )
}
