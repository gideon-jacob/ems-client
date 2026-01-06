import { useDashboardStore } from "@/store/useDashboardStore"
import { motion } from "framer-motion"

export function PIDDiagram() {
    const { equipmentState } = useDashboardStore()
    const { fanMode, coolingValve } = equipmentState.controls
    const { supplyTemp } = equipmentState.metrics
    const isFanOn = fanMode === "On" || fanMode === "Auto"

    return (
        <div className="bg-[#111421] border border-white/5 rounded-xl p-8 relative overflow-hidden h-full flex items-center justify-center min-h-[400px]">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* P&ID SVG Container */}
            <div className="relative w-full max-w-3xl aspect-[16/9] select-none">

                {/* Main Duct Line */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-[#1d2135] -translate-y-1/2 rounded-full z-0 border border-white/10" />
                {isFanOn && <div className="absolute top-1/2 left-20 right-20 h-1 bg-blue-500/20 -translate-y-1/2 z-0 animate-pulse" />}


                {/* Filter */}
                <div className="absolute top-1/2 left-[10%] -translate-y-1/2 z-10">
                    <div className="flex flex-col gap-0.5 transform -skew-x-12">
                        <div className="w-8 h-12 bg-[#1d2135] border border-white/20 rounded-sm" />
                        <div className="w-8 h-12 bg-[#1d2135] border border-white/20 rounded-sm" />
                    </div>
                    <span className="absolute -top-8 left-0 text-xs text-muted-foreground font-mono">Filter</span>
                </div>

                {/* Supply Fan */}
                <div className="absolute top-1/2 left-[30%] -translate-y-1/2 z-20">
                    <div className="relative">
                        <div className={`w-24 h-24 rounded-full bg-[#111421] border-2 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center justify-center transition-colors ${isFanOn ? 'border-blue-500' : 'border-white/10'}`}>
                            <motion.div
                                animate={{ rotate: isFanOn ? 360 : 0 }}
                                transition={{ duration: isFanOn ? 2 : 0, repeat: Infinity, ease: "linear" }}
                            >
                                <FanIcon className={`w-12 h-12 ${isFanOn ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#1d2135] border border-white/10 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap">
                            {fanMode.toUpperCase()}: {isFanOn ? 'RUNNING' : 'STOPPED'}
                        </div>
                    </div>
                </div>

                {/* Flow Arrow */}
                {isFanOn && (
                    <div className="absolute top-1/2 left-[42%] -translate-y-1/2 z-10 text-blue-500/50">
                        <ArrowIcon className="w-8 h-8" />
                    </div>
                )}


                {/* Cooling Coil */}
                <div className="absolute top-1/2 left-[50%] -translate-y-1/2 z-10">
                    <div className={`w-16 h-24 bg-[#1d2135] border rounded flex items-center justify-center relative transition-colors ${coolingValve > 0 ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-white/20'}`}>
                        <SnowIcon className={`w-8 h-8 ${coolingValve > 0 ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        <div className="absolute -top-8 bg-[#1d2135] border border-white/10 px-2 py-0.5 rounded textxs font-mono">{supplyTemp}°C</div>
                    </div>
                    {/* Valve Indicator */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 font-mono">
                        Valve: {coolingValve}%
                    </div>
                </div>

                {/* Heating Coil */}
                <div className="absolute top-1/2 left-[62%] -translate-y-1/2 z-10">
                    <div className="w-16 h-24 bg-[#1d2135] border border-red-500/30 rounded flex items-center justify-center relative">
                        <HeatIcon className="w-8 h-8 text-red-500/50" />
                        <div className="absolute -top-8 bg-[#1d2135] border border-white/10 px-2 py-0.5 rounded textxs font-mono text-muted-foreground">OFF</div>
                    </div>
                </div>

                {/* Damper */}
                <div className="absolute top-1/2 left-[78%] -translate-y-1/2 z-10">
                    <div className="w-16 h-24 bg-[#1d2135] border border-white/20 rounded flex items-center justify-center relative overflow-hidden">
                        <div className="w-[120%] h-1 bg-white/40 transform -rotate-45" />
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">DMP: 45%</div>
                    </div>
                </div>

            </div>

            <div className="absolute bottom-4 left-4">
                <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live Diagram • Updated 2s ago
                </div>
            </div>
        </div>
    )
}

// Simple Icons for the Diagram
function FanIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" opacity="0.2" />
            <path d="M12 12c2.5 0 2.5 -2 5 -2c2 2 2 2.5 0 5c-2.5 0 -2.5 -2 -5 -2z" transform="rotate(0 12 12)" />
            <path d="M12 12c2.5 0 2.5 -2 5 -2c2 2 2 2.5 0 5c-2.5 0 -2.5 -2 -5 -2z" transform="rotate(120 12 12)" />
            <path d="M12 12c2.5 0 2.5 -2 5 -2c2 2 2 2.5 0 5c-2.5 0 -2.5 -2 -5 -2z" transform="rotate(240 12 12)" />
        </svg>
    )
}

function SnowIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 3v18" />
            <path d="M6 9l12 6" />
            <path d="M18 9l-12 6" />
        </svg>
    )
}

function HeatIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 4a2 2 0 0 0 -2 2v12a2 2 0 0 0 4 0v-12a2 2 0 0 0 -2 -2" />
            <path d="M8 8v8" />
            <path d="M16 8v8" />
        </svg>
    )
}

function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M15 8l4 4l-4 4" />
        </svg>
    )
}
