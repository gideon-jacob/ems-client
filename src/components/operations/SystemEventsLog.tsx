export function SystemEventsLog() {
    return (
        <div className="bg-[#1d2135] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Events Log</h3>
                <button className="text-xs text-primary hover:text-primary/80 transition-colors">View All History</button>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#111421] text-xs uppercase text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Event</th>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <EventRow
                            time="10:42:05 AM"
                            event="Supply Fan Speed Changed"
                            source="System"
                            status="Info"
                            statusColor="bg-blue-500/20 text-blue-400"
                        />
                        <EventRow
                            time="10:15:22 AM"
                            event="Filter Differential Pressure High"
                            source="Sensor F-02"
                            status="Warning"
                            statusColor="bg-yellow-500/20 text-yellow-400"
                        />
                        <EventRow
                            time="09:30:00 AM"
                            event="Scheduled Start"
                            source="Scheduler"
                            status="Success"
                            statusColor="bg-green-500/20 text-green-400"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function EventRow({ time, event, source, status, statusColor }: { time: string, event: string, source: string, status: string, statusColor: string }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-4 py-3 text-mono text-muted-foreground font-mono text-xs">{time}</td>
            <td className="px-4 py-3 text-white font-medium">{event}</td>
            <td className="px-4 py-3 text-muted-foreground">{source}</td>
            <td className="px-4 py-3 text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${statusColor} border border-white/5 uppercase tracking-wide`}>
                    {status}
                </span>
            </td>
        </tr>
    )
}
