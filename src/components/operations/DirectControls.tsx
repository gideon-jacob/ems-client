import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { useDashboardStore } from "@/store/useDashboardStore"

export function DirectControls() {
    const { opsSystem, equipmentState, updateEquipmentControls } = useDashboardStore()
    const { fanMode, tempSetpoint, coolingValve } = equipmentState.controls

    const handleModeChange = (mode: "Auto" | "On" | "Off") => {
        updateEquipmentControls({ fanMode: mode })
    }

    const handleTempChange = (val: number) => {
        updateEquipmentControls({ tempSetpoint: val })
    }

    const handleValveChange = (val: number) => {
        updateEquipmentControls({ coolingValve: val })
    }

    return (
        <div className="bg-[#1d2135] border border-white/5 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-white">Direct Controls</h3>
                    <span className="text-xs text-blue-400 font-mono">{opsSystem}</span>
                </div>
                <Settings2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-8 flex-1">
                {/* Fan Mode */}
                <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 block">
                        Fan Mode
                    </label>
                    <div className="grid grid-cols-3 bg-[#111421] p-1 rounded-lg border border-white/5">
                        {(['Off', 'Auto', 'On'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                className={`text-sm font-medium py-2 rounded-md transition-all ${fanMode === mode
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Supply Temp Slider */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            Supply Temp Setpoint
                        </label>
                        <span className="text-sm font-bold text-primary">{tempSetpoint}°C</span>
                    </div>
                    {/* Slider */}
                    <div className="relative h-2 bg-[#111421] rounded-full overflow-hidden cursor-pointer">
                        <input
                            type="range"
                            min="16"
                            max="26"
                            step="0.5"
                            value={tempSetpoint}
                            onChange={(e) => handleTempChange(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute top-0 left-0 h-full bg-primary/30 w-full" />
                        <div
                            className="absolute top-0 left-0 h-full bg-primary"
                            style={{ width: `${((tempSetpoint - 16) / 10) * 100}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full shadow-lg border-2 border-[#1d2135] pointer-events-none"
                            style={{ left: `${((tempSetpoint - 16) / 10) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
                        <span>16°C</span>
                        <span>26°C</span>
                    </div>
                </div>

                {/* Cooling Valve */}
                <div>
                    <div className="flex justify-between mb-3">
                        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            Cooling Valve
                        </label>
                        <span className="text-sm font-bold text-white">{coolingValve}%</span>
                    </div>
                    <div className="relative h-2 bg-[#111421] rounded-full overflow-hidden cursor-pointer">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={coolingValve}
                            onChange={(e) => handleValveChange(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute top-0 left-0 h-full bg-white/10 w-full" />
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-500"
                            style={{ width: `${coolingValve}%` }}
                        />
                    </div>
                </div>
            </div>

            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold">
                Apply Manual Override
            </Button>
        </div>
    )
}
