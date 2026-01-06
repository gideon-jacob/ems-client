import { Search, SlidersHorizontal, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlarmsFilterBarProps {
    systemFilter: string
    setSystemFilter: (filter: string) => void
}

export function AlarmsFilterBar({ systemFilter, setSystemFilter }: AlarmsFilterBarProps) {
    const tabs = [
        { id: 'ALL', label: 'All Systems' },
        { id: 'HVAC', label: 'HVAC' },
        { id: 'BMS', label: 'BMS' },
        { id: 'EMS', label: 'EMS' },
    ]

    return (
        <div className="space-y-4 mb-6">
            {/* Top Row: Search and Bulk Action */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#1d2135] p-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 flex-1 w-full md:w-auto px-2">
                    <div className="relative flex-1 md:max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search alarms, ID, or source..."
                            className="w-full bg-[#111421] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <FilterDropdown label="Severity: All" />
                        <FilterDropdown label="Status: Active" />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5">
                        <Calendar className="h-4 w-4" />
                    </Button>

                </div>
            </div>

            {/* Bottom Row: System Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#1d2135]/50 p-1 rounded-lg w-fit border border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSystemFilter(tab.id)}
                        className={`text-sm font-medium px-4 py-1.5 rounded-md transition-all ${systemFilter === tab.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-muted-foreground hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

function FilterDropdown({ label }: { label: string }) {
    return (
        <button className="hidden sm:flex items-center gap-2 bg-[#111421] border border-white/10 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-white hover:border-white/20 transition-colors">
            {label}
            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    )
}
