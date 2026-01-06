import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const zones = [
    { id: 1, name: "Lobby Entrance", meta: "AQI: 45 • Temp: 71°F", status: "nominal" },
    { id: 2, name: "North Wing", meta: "Pressure Alert (High)", status: "critical" },
    { id: 3, name: "South Wing", meta: "AQI: 52 • Temp: 72°F", status: "nominal" },
    { id: 4, name: "Parking Levels", meta: "Lighting: Auto • Fans: On", status: "nominal" },
    { id: 5, name: "Data Center", meta: "Cooling: High • Temp: 6...", status: "nominal" },
]

export function ZoneStatusList() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-4 lg:col-span-1"
        >
            <Card className="bg-[#1d2135] border-white/5 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white text-lg">Zone Status</CardTitle>
                    <a href="#" className="text-xs text-primary hover:underline">View Map</a>
                </CardHeader>
                <CardContent className="space-y-4">
                    {zones.map((zone) => (
                        <div key={zone.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                            {/* Placeholder Thumbnail */}
                            <div className="h-10 w-10 rounded-md bg-white/10 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                                {/* Ensure image exists or fallback */}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{zone.name}</p>
                                <p className={`text-xs truncate ${zone.status === 'critical' ? 'text-red-400' : 'text-muted-foreground'}`}>
                                    {zone.meta}
                                </p>
                            </div>

                            <div className={`h-2 w-2 rounded-full ${zone.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    )
}
