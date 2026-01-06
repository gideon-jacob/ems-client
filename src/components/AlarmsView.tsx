import { useState, useMemo } from "react"
import { AlarmStats } from "./alarms/AlarmStats"
import { AlarmsFilterBar } from "./alarms/AlarmsFilterBar"
import { AlarmList } from "./alarms/AlarmList"
import { useDashboardStore } from "@/store/useDashboardStore"

export function AlarmsView() {
    const [systemFilter, setSystemFilter] = useState('ALL')
    const { alarms } = useDashboardStore()

    const filteredAlarms = useMemo(() => {
        if (systemFilter === 'ALL') return alarms
        return alarms.filter(alarm => alarm.system === systemFilter)
    }, [systemFilter, alarms])

    return (
        <div className="p-8 h-full flex flex-col bg-background">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Alarms Management</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Real-time incident monitoring and response system.
                    </p>
                </div>

                <div className="bg-[#1d2135] border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Connection</span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>

            <AlarmStats />

            <div className="flex-1 flex flex-col min-h-0">
                <AlarmsFilterBar systemFilter={systemFilter} setSystemFilter={setSystemFilter} />
                <AlarmList alarms={filteredAlarms} />
            </div>
        </div>
    )
}
