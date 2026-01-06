import { Card } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useDashboardStore } from "@/store/useDashboardStore"

export function AlarmStats() {
    const { alarms } = useDashboardStore()

    // Compute Stats
    const criticalCount = alarms.filter(a => a.severity === 'Critical' && a.status === 'Active').length
    const warningCount = alarms.filter(a => a.severity === 'Warning' && a.status === 'Active').length
    const infoCount = alarms.filter(a => a.severity === 'Info').length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Critical Active */}
            <Card className="bg-[#1d2135] border-white/5 p-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="h-24 w-24 text-red-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Critical Incidents</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{criticalCount}</span>
                        <span className="text-sm font-medium text-red-500 mb-1">Active</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[45%]" />
                    </div>
                </div>
            </Card>

            {/* Warnings */}
            <Card className="bg-[#1d2135] border-white/5 p-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="h-24 w-24 text-orange-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Active Warnings</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{warningCount}</span>
                        <span className="text-sm font-medium text-orange-500 mb-1">Active</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[20%]" />
                    </div>
                </div>
            </Card>

            {/* Info / System Status */}
            <Card className="bg-[#1d2135] border-white/5 p-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Info className="h-24 w-24 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Informational Events</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">{infoCount}</span>
                        <span className="text-sm font-medium text-blue-500 mb-1">Total</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
