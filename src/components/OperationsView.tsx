import { FacilityMap } from "./optimization/FacilityMap"
import { ZoneDetailsPanel } from "./operations/ZoneDetailsPanel"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/useDashboardStore"
import { useDigitalTwin } from "@/hooks/useDigitalTwin"

export function OperationsView() {
    useDigitalTwin() // Start Simulation
    const { activeSOP, optimizationMode } = useDashboardStore()

    return (
        <div className="p-6 h-full flex flex-col bg-background overflow-y-auto lg:overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        Operations
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            OPERATIONS V2.0
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Manage building zones, parameters, and equipment.
                        {activeSOP && <span className="text-emerald-400 ml-2">• Optimization Active</span>}
                    </p>
                </div>

                {/* Optimization Badge */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#111421] border border-white/10 rounded-full">
                    <div className={cn("h-2 w-2 rounded-full animate-pulse", activeSOP ? "bg-blue-500" : "bg-emerald-500")} />
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Current Mode</span>
                        <span className="text-xs font-bold text-white">{optimizationMode}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Left: Map / Grid (8 columns) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-8 flex flex-col min-h-[500px] lg:min-h-0"
                >
                    <FacilityMap />
                </motion.div>

                {/* Right: Details Panel (4 columns) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-4 min-h-[600px] lg:min-h-0"
                >
                    <ZoneDetailsPanel />
                </motion.div>
            </div>
        </div>
    )
}
