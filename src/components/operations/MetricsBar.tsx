import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useDashboardStore } from "@/store/useDashboardStore"
import { FACILITY_STRUCTURE } from "@/config/facility-data"

export function MetricsBar() {
    const { thresholds, opsBlock, opsFloor, opsSystem, setOpsSelection } = useDashboardStore()

    // Find current active data
    const activeBlock = FACILITY_STRUCTURE.find(b => b.id === opsBlock) || FACILITY_STRUCTURE[0]
    const activeFloor = activeBlock.floors.find(f => f.id === opsFloor) || activeBlock.floors[0]

    // Location Change Handler (Block or Floor)
    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [blockId, floorId] = e.target.value.split(":")
        const newBlock = FACILITY_STRUCTURE.find(b => b.id === blockId)!
        const newFloor = newBlock.floors.find(f => f.id === floorId)!
        // Default to first system in new floor
        setOpsSelection(blockId, floorId, newFloor.systems[0] || "")
    }

    // System Change Handler
    const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOpsSelection(opsBlock, opsFloor, e.target.value)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            {/* Hierarchy Selectors */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Location / Floor
                    </label>
                    <div className="relative">
                        <select
                            className="w-full bg-[#1d2135] border border-white/10 rounded-lg h-12 px-3 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={`${opsBlock}:${opsFloor}`}
                            onChange={handleLocationChange}
                        >
                            {FACILITY_STRUCTURE.map(block => (
                                <optgroup key={block.id} label={block.label}>
                                    {block.floors.map(floor => (
                                        <option key={`${block.id}:${floor.id}`} value={`${block.id}:${floor.id}`}>
                                            {floor.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Equipment Unit
                    </label>
                    <div className="relative">
                        <select
                            className="w-full bg-[#1d2135] border border-white/10 rounded-lg h-12 px-3 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={opsSystem}
                            onChange={handleSystemChange}
                        >
                            {activeFloor.systems.length > 0 ? (
                                activeFloor.systems.map(sys => (
                                    <option key={sys} value={sys}>{sys}</option>
                                ))
                            ) : (
                                <option disabled>No Systems</option>
                            )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Supply Temp"
                    value={useDashboardStore(s => s.equipmentState.metrics.supplyTemp.toFixed(1))} // Selective subscribe for perf
                    unit="°C"
                    setpoint={`${thresholds.tempMin}-${thresholds.tempMax}°C`}
                />
                <MetricCard
                    label="Return Temp"
                    value={useDashboardStore(s => s.equipmentState.metrics.returnTemp.toFixed(1))}
                    unit="°C"
                    setpoint={`${thresholds.tempMin + 1}-${thresholds.tempMax + 1}°C`}
                />
                <MetricCard
                    label="Humidity"
                    value={useDashboardStore(s => s.equipmentState.metrics.humidity.toFixed(1))}
                    unit="%"
                    setpoint={`${thresholds.humidityMin}-${thresholds.humidityMax}%`}
                />
                <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                    <MetricCard
                        label="Pressure"
                        value={useDashboardStore(s => s.equipmentState.metrics.pressure.toFixed(1))}
                        unit="Pa"
                        setpoint={`> ${thresholds.pressureMin} Pa`}
                        small
                    />
                    <MetricCard
                        label="Co2 Level"
                        value={useDashboardStore(s => s.equipmentState.metrics.co2Level.toString())}
                        unit="PPM"
                        valueColor="text-green-500"
                        setpoint="< 800"
                        small
                    />
                </div>
            </div>
        </div>
    )
}

function MetricCard({
    label,
    value,
    unit,
    setpoint,
    valueColor = "text-white",
    small = false
}: { label: string, value: string, unit: string, setpoint?: string, valueColor?: string, small?: boolean }) {
    return (
        <Card className={`bg-[#1d2135] border-white/5 flex flex-col justify-center ${small ? 'p-3' : 'p-4'}`}>
            <span className={`text-muted-foreground font-medium mb-1 ${small ? 'text-[10px]' : 'text-xs'}`}>{label}</span>
            <div className="flex items-baseline gap-1">
                <span className={`font-bold ${valueColor} ${small ? 'text-lg' : 'text-2xl'}`}>{value}</span>
                <span className={`text-muted-foreground font-medium ${small ? 'text-[10px]' : 'text-xs'}`}>{unit}</span>
            </div>
            {setpoint && (
                <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-1.5 py-0.5 rounded">
                        Target: {setpoint}
                    </span>
                </div>
            )}
        </Card>
    )
}
