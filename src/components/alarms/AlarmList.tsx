import { CheckCircle } from "lucide-react"
import { Badge } from "../ui/badge"

export interface AlarmItem {
    id: string
    severity: 'Critical' | 'Warning' | 'Info'
    description: string
    subtext: string
    source: string
    system: 'HVAC' | 'BMS' | 'EMS'
    time: string
    duration: string
    status: 'Active' | 'Ack\'d' | 'Resolved'
}

interface AlarmListProps {
    alarms: AlarmItem[]
}

export function AlarmList({ alarms }: AlarmListProps) {
    return (
        <div className="bg-[#1d2135] border border-white/5 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#111421] text-xs uppercase text-muted-foreground font-semibold sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                            </th>
                            <th className="px-4 py-4 w-32">Severity</th>
                            <th className="px-4 py-4">Alarm Description</th>
                            <th className="px-4 py-4">Source</th>
                            <th className="px-4 py-4">System</th>
                            <th className="px-4 py-4 w-24">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {alarms.map((alarm) => (
                            <AlarmRow key={alarm.id} item={alarm} />
                        ))}
                    </tbody>
                </table>
                {alarms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mb-4 opacity-20" />
                        <p>No active alarms for this filter</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function AlarmRow({ item }: { item: AlarmItem }) {
    const severityColors = {
        'Critical': 'text-red-500 bg-red-500/10 border-red-500/20',
        'Warning': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'Info': 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }

    return (
        <tr className="group hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 text-center">
                <input type="checkbox" className="rounded border-white/20 bg-transparent group-hover:border-white/40" />
            </td>
            <td className="px-4 py-4">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-md border w-fit font-medium ${severityColors[item.severity]}`}>
                    <div className={`h-2 w-2 rounded-full bg-current animate-pulse`} />
                    {item.severity}
                </div>
            </td>
            <td className="px-4 py-4">
                <div className="font-semibold text-white">{item.description}</div>
                <div className="text-xs text-muted-foreground">{item.subtext}</div>
            </td>
            <td className="px-4 py-4 text-white/80">{item.source}</td>
            <td className="px-4 py-4">
                <Badge variant="outline" className="border-white/10 text-xs font-mono text-muted-foreground">
                    {item.system}
                </Badge>
            </td>
            <td className="px-4 py-4 font-mono text-muted-foreground text-xs">{item.time}</td>
        </tr>
    )
}
