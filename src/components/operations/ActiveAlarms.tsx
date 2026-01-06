import { AlertTriangle } from "lucide-react"

export function ActiveAlarms() {
    return (
        <div className="bg-[#1d2135] border border-white/5 rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-bold text-white">Active Alarms</h3>
                </div>
                <span className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded-full">3</span>
            </div>

            <div className="space-y-3">
                <AlarmItem
                    title="Filter Pressure High"
                    source="AHU-01"
                    time="20 mins ago"
                    severity="critical"
                />
                <AlarmItem
                    title="Communication Loss"
                    source="VAV-104"
                    time="1 hr ago"
                    severity="warning"
                />
                <AlarmItem
                    title="Maintenance Due"
                    source="Chiller-B"
                    time="2 days ago"
                    severity="warning"
                />
            </div>
        </div>
    )
}

function AlarmItem({ title, source, time, severity }: { title: string, source: string, time: string, severity: 'critical' | 'warning' }) {
    const colorClass = severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20';
    const dotClass = severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500';
    const textClass = severity === 'critical' ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className={`p-4 rounded-lg border ${colorClass} transition-colors hover:bg-white/5`}>
            <div className="flex items-start gap-3">
                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dotClass} shrink-0 animate-pulse`} />
                <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${textClass} mb-0.5`}>{title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{source}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1">
                            {time}
                        </span>
                    </p>

                    {severity === 'critical' && (
                        <div className="flex gap-2 mt-3">
                            <button className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded transition-colors uppercase font-bold tracking-wide">
                                Ack
                            </button>
                            <button className="text-[10px] text-muted-foreground hover:text-white transition-colors uppercase font-bold tracking-wide px-2 py-1">
                                Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
