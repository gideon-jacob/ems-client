import { useState, useEffect } from "react"
import { Scan, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const GRADES = ["Grade A", "Grade B", "Grade C", "Grade D"]

const SENSORS = [
    { id: "particle", label: "Particle Counters (0.5µm)" },
    { id: "pressure", label: "Differential Pressure" },
    { id: "temp", label: "Temperature & RH" },
    { id: "airflow", label: "Air Change Rate / Velocity" },
    { id: "micro", label: "Viable Monitoring" }
]

export function RoomGradeConfig() {
    const [selectedGrade, setSelectedGrade] = useState("Grade C")
    const [priorities, setPriorities] = useState(SENSORS)

    // Auto-prioritize based on Grade
    useEffect(() => {
        if (selectedGrade === "Grade A") {
            // Grade A: Particles and Airflow/Velocity are critical (ISO 5)
            setPriorities([
                SENSORS.find(s => s.id === "particle")!,
                SENSORS.find(s => s.id === "airflow")!,
                SENSORS.find(s => s.id === "pressure")!,
                SENSORS.find(s => s.id === "micro")!,
                SENSORS.find(s => s.id === "temp")!,
            ])
        } else if (selectedGrade === "Grade B") {
            setPriorities([
                SENSORS.find(s => s.id === "pressure")!,
                SENSORS.find(s => s.id === "particle")!,
                SENSORS.find(s => s.id === "micro")!,
                SENSORS.find(s => s.id === "airflow")!,
                SENSORS.find(s => s.id === "temp")!,
            ])
        }
        // Keep default for C/D or custom sorting
    }, [selectedGrade])

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                    <Scan className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Process Room & Grading</h2>
            </div>

            <div className="bg-[#111421] border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Grade Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-white">GMP Grade Classification</label>
                        <div className="grid grid-cols-1 gap-2">
                            {GRADES.map((grade) => (
                                <button
                                    key={grade}
                                    onClick={() => setSelectedGrade(grade)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all",
                                        selectedGrade === grade
                                            ? "bg-emerald-500/20 border-emerald-500 text-white"
                                            : "bg-[#1d2135] border-white/5 text-muted-foreground hover:bg-[#1d2135]/80"
                                    )}
                                >
                                    <span>{grade}</span>
                                    {selectedGrade === grade && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description Box */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <ShieldAlert className="h-4 w-4" />
                            <span className="font-bold text-sm">Compliance Target</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                            {selectedGrade === "Grade A" && "Critical Zone. High risk operations. Requires ISO 5 (at rest/in op). Monitoring focus: Continuous Particle Counting and Laminar Flow Velocity."}
                            {selectedGrade === "Grade B" && "Background Zone. Aseptic preparation. Requires ISO 5 (at rest) / ISO 7 (in op). Monitoring focus: Differential Pressure cascade."}
                            {selectedGrade === "Grade C" && "Clean Zone. Non-critical sterile stages. ISO 7 (at rest) / ISO 8 (in op). Standard monitoring applies."}
                            {selectedGrade === "Grade D" && "General Clean Zone. Handling of components after washing. ISO 8. Temperature and Humidity focus."}
                        </p>
                        <div className="mt-auto pt-3 border-t border-emerald-500/20 flex justify-between items-center">
                            <span className="text-xs text-white">Max Particles (0.5µm):</span>
                            <span className="font-mono text-emerald-400 text-sm">
                                {selectedGrade === "Grade A" ? "3,520 /m³" :
                                    selectedGrade === "Grade B" ? "3,520 /m³" :
                                        selectedGrade === "Grade C" ? "352,000 /m³" : "3,520,000 /m³"}
                            </span>
                        </div>
                    </div>

                    {/* Sensor Priorities */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-white">Sensor Priority</label>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">High to Low</span>
                        </div>
                        <div className="space-y-2 bg-[#1d2135] p-2 rounded-lg border border-white/5">
                            {priorities.map((sensor, index) => (
                                <div key={sensor.id} className="flex items-center gap-3 bg-[#111421] p-2 rounded border border-white/5 text-xs text-gray-300">
                                    <span className="font-mono text-gray-600 w-4">{index + 1}</span>
                                    <span>{sensor.label}</span>
                                    {index === 0 && <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">CRITICAL</span>}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">
                            *Priority determines sampling frequency and alarm latency
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
