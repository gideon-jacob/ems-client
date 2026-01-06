import { useState } from 'react'
import {
    Heart,
    AlertTriangle,
    Timer,
    Download,
    Leaf,
    Droplets,
    Gauge,
    Info,
    CheckCircle2
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// Utilizing Recharts for the mini-charts
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

// Mock data for charts
const tempData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: 72 + Math.random() * 0.8 - 0.4
}))

const humidityData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: 45 + Math.random() * 0.5 - 0.25
}))

const pressureData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    // Simulate a rising trend for the "High Load" warning
    value: 110 + (i * 0.8) + Math.random() * 2
}))

const ALERTS = [
    {
        id: 1,
        type: 'warning',
        title: 'Pressure spike detected (Unit 04)',
        description: 'Differential pressure exceeded 120 Pa threshold.',
        time: '10:42 AM',
        action: 'ACKNOWLEDGE'
    },
    {
        id: 2,
        type: 'info',
        title: 'Scheduled Maintenance',
        description: 'Routine calibration sequence initiated.',
        time: '09:00 AM',
        action: 'DETAILS'
    },
    {
        id: 3,
        type: 'success',
        title: 'Humidity Level Normalized',
        description: 'Value returned to optimal range (45%).',
        time: '08:45 AM',
        action: 'RESOLVED'
    }
]

export function EMSSystemView() {
    const [currentTime] = useState(new Date().toLocaleTimeString())

    return (
        <div className="p-8 space-y-6 h-full overflow-y-auto bg-[#0B0E14]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-white">EMS system</h1>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                            OPERATIONAL
                        </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                        System Time: {currentTime}
                    </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 gap-2">
                    <Download className="h-4 w-4" />
                    Export Logs
                </Button>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    label="SYSTEM HEALTH"
                    value="Nominal"
                    icon={Heart}
                    statusColor="text-emerald-500"
                    barColor="bg-emerald-500"
                    bgIcon
                />
                <StatsCard
                    label="ACTIVE ALERTS"
                    value={
                        <span className="flex items-center gap-2">
                            1 <span className="text-lg font-normal text-yellow-500">(Warning)</span>
                        </span>
                    }
                    icon={AlertTriangle}
                    statusColor="text-white"
                    barColor="bg-yellow-500"
                    bgIcon
                />
                <StatsCard
                    label="UPTIME"
                    value="14d 2h 15m"
                    icon={Timer}
                    statusColor="text-white"
                    barColor="bg-blue-500"
                    bgIcon
                />
            </div>

            {/* Middle Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ParameterCard
                    title="TEMPERATURE"
                    value="72.4"
                    unit="°C"
                    status="Stable"
                    statusType="success"
                    icon={Leaf} // Using Leaf as a generic 'environment' icon or could use Thermometer if available
                    data={tempData}
                    strokeColor="#10b981"
                />
                <ParameterCard
                    title="RELATIVE HUMIDITY"
                    value="45.0"
                    unit="%"
                    status="Optimal"
                    statusType="success"
                    icon={Droplets}
                    data={humidityData}
                    strokeColor="#3b82f6"
                />
                <ParameterCard
                    title="DIFF. PRESSURE"
                    value="125"
                    unit="Pa"
                    status="High Load (+15%)"
                    statusType="warning"
                    icon={Gauge}
                    data={pressureData}
                    strokeColor="#eab308"
                    showThreshold
                />
            </div>

            {/* Recent Alerts Section */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-white font-bold text-lg">Recent Alerts</span>
                </div>

                <div className="bg-[#111421] border border-white/5 rounded-xl overflow-hidden">
                    {ALERTS.map((alert) => (
                        <div key={alert.id} className="p-4 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div className="flex items-start gap-4">
                                <AlertIcon type={alert.type} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-semibold">{alert.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-mono text-muted-foreground">{alert.time}</span>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "text-xs font-bold",
                                        alert.type === 'warning' ? "text-blue-400 hover:text-blue-300" :
                                            alert.type === 'success' ? "text-emerald-500 hover:text-emerald-400" :
                                                "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {alert.action}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Subcomponents

function StatsCard({ label, value, icon: Icon, statusColor, barColor, bgIcon }: any) {
    return (
        <Card className="bg-[#111421] border-white/10 p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{label}</span>
                    {bgIcon && <Icon className="h-12 w-12 absolute right-4 top-4 text-white/5 group-hover:text-white/10 transition-colors" />}
                </div>
                <div className={cn("text-3xl font-bold mb-4", statusColor)}>{value}</div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", barColor)} style={{ width: '40%' }} />
                    {/* Fixed width for visual demo, in real app this would be calculated */}
                </div>
            </div>
        </Card>
    )
}

function ParameterCard({ title, value, unit, status, statusType, icon: Icon, data, strokeColor, showThreshold }: any) {
    return (
        <Card className="bg-[#111421] border-white/10 p-6 relative">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-white/40" />
                    <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{title}</span>
                </div>
                <div className={cn(
                    "h-2 w-2 rounded-full",
                    statusType === 'success' ? 'bg-emerald-500' : 'bg-yellow-500'
                )} />
            </div>

            <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{value}</span>
                <span className="text-xl text-muted-foreground mb-1">{unit}</span>
            </div>

            <Badge className={cn(
                "mb-6",
                statusType === 'success' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            )}>
                {statusType === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {status}
            </Badge>

            {/* Mini Chart */}
            <div className="h-16 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        {showThreshold && (
                            <Line type="monotone" dataKey={() => 120} stroke="#ca8a04" strokeDasharray="3 3" strokeWidth={1} dot={false} />
                        )}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={strokeColor}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Time labels mock */}
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                <span>10:00</span>
                <span>10:15</span>
                <span>10:30</span>
                <span>10:45</span>
            </div>
        </Card>
    )
}

function AlertIcon({ type }: { type: string }) {
    if (type === 'warning') {
        return (
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
        )
    }
    if (type === 'info') {
        return (
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Info className="h-5 w-5 text-blue-500" />
            </div>
        )
    }
    return (
        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
    )
}
