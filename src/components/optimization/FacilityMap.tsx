import { useState, useEffect } from "react"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/useDashboardStore"
import { FACILITY_STRUCTURE } from "@/config/facility-data"
import { motion } from "framer-motion"

export function FacilityMap() {
    const {
        opsBlock, opsFloor, opsSystem,
        setOpsSelection,
        equipmentState
    } = useDashboardStore()

    // Local state for UI navigation, synced with store
    const [activeBlockId, setActiveBlockId] = useState(opsBlock || FACILITY_STRUCTURE[0].id)
    const [activeFloorId, setActiveFloorId] = useState(opsFloor || FACILITY_STRUCTURE[0].floors[0].id)

    // Sync local state when store changes (e.g. from outside)
    useEffect(() => {
        if (opsBlock) setActiveBlockId(opsBlock)
        if (opsFloor) setActiveFloorId(opsFloor)
    }, [opsBlock, opsFloor])

    // Derived active data
    const activeBlock = FACILITY_STRUCTURE.find(b => b.id === activeBlockId) || FACILITY_STRUCTURE[0]
    const activeFloor = activeBlock.floors.find(f => f.id === activeFloorId) || activeBlock.floors[0]
    const activeSystems = activeFloor.systems

    const handleBlockChange = (blockId: string) => {
        const block = FACILITY_STRUCTURE.find(b => b.id === blockId)
        if (block) {
            setActiveBlockId(block.id)
            const defaultFloor = block.floors[0]
            setActiveFloorId(defaultFloor.id)
            // Auto-select first system of new block/floor
            if (defaultFloor.systems.length > 0) {
                setOpsSelection(block.id, defaultFloor.id, defaultFloor.systems[0])
            }
        }
    }

    const handleFloorChange = (floorId: string) => {
        setActiveFloorId(floorId)
        const floor = activeBlock.floors.find(f => f.id === floorId)
        if (floor && floor.systems.length > 0) {
            setOpsSelection(activeBlock.id, floor.id, floor.systems[0])
        }
    }

    const handleSystemSelect = (systemId: string) => {
        setOpsSelection(activeBlock.id, activeFloor.id, systemId)
    }

    return (
        <div className="h-full flex flex-col bg-[#111421] border border-white/10 rounded-xl overflow-hidden">
            {/* Header: Block Tabs */}
            <div className="flex items-center border-b border-white/10 bg-black/20 px-4">
                {FACILITY_STRUCTURE.map(block => (
                    <button
                        key={block.id}
                        onClick={() => handleBlockChange(block.id)}
                        className={cn(
                            "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                            activeBlockId === block.id
                                ? "border-blue-500 text-white bg-white/5"
                                : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                    >
                        {block.label}
                    </button>
                ))}
            </div>

            {/* Sub-Header: Floor Tabs & Info */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    {activeBlock.floors.map(floor => (
                        <button
                            key={floor.id}
                            onClick={() => handleFloorChange(floor.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                activeFloorId === floor.id
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "bg-white/5 text-muted-foreground border border-transparent hover:border-white/10"
                            )}
                        >
                            {floor.label}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-muted-foreground">
                    {activeSystems.length} System{activeSystems.length !== 1 ? 's' : ''} Active
                </div>
            </div>

            {/* Zone/System Grid */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-dotted-pattern">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {activeSystems.map((systemId) => {
                        const isSelected = opsSystem === systemId
                        // In a real app, we'd fetch status per system. 
                        // Here we just use the global simulated status if selected, or 'Online' static for others
                        const isSimulated = isSelected
                        const status = isSimulated ? equipmentState.systemStatus : "Online"

                        return (
                            <motion.button
                                key={systemId}
                                onClick={() => handleSystemSelect(systemId)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "relative p-4 rounded-xl border text-left transition-all h-32 flex flex-col justify-between group",
                                    isSelected
                                        ? "bg-blue-500/10 border-blue-500"
                                        : "bg-[#1d2135] border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <div className={cn(
                                            "text-xs font-bold mb-1",
                                            isSelected ? "text-blue-400" : "text-muted-foreground group-hover:text-blue-200"
                                        )}>
                                            {systemId}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            AHU Unit
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        status === "Online" ? "bg-emerald-500" : "bg-red-500"
                                    )} />
                                </div>

                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        {/* Mock Mini Metrics or Real if selected */}
                                        {isSelected ? (
                                            <>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-muted-foreground">Temp</span>
                                                    <span className="text-sm font-bold text-white">{equipmentState.metrics.supplyTemp.toFixed(1)}°</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-muted-foreground">RH</span>
                                                    <span className="text-sm font-bold text-white">{equipmentState.metrics.humidity.toFixed(0)}%</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-muted-foreground/50">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-xs">Monitoring</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-outline"
                                        className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
