import { motion } from 'framer-motion'
import {
    Bell,
    Settings,
    Building2,
    Zap,
    BarChart3,
    Workflow,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/store/useDashboardStore'

import { OperationsView } from './OperationsView'
import { AlarmsView } from './AlarmsView'
import { OptimizationView } from './OptimizationView'
import { TrendsView } from './trends/TrendsView'
import { SettingsView } from './SettingsView'

import { EMSSystemView } from './EMSSystemView'

// Defining menu items based on the design
const navItems = [
    { id: 'ems', label: 'EMS System', icon: Zap },
    { id: 'operations', label: 'Operations', icon: Building2 },
    { id: 'alarms', label: 'Alarms', icon: Bell },
    { id: 'optimization', label: 'Optimization', icon: Workflow },
    { id: 'trends', label: 'Trends', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
]

export function DashboardLayout() {
    const {
        activeTab,
        setActiveTab,
        isSidebarOpen,
        toggleSidebar
    } = useDashboardStore()

    const renderContent = () => {
        console.log("Rendering content for tab:", activeTab)
        switch (activeTab) {
            case 'ems':
            default:
                return <EMSSystemView />
            case 'operations':
                return <OperationsView />
            case 'alarms':
                return <AlarmsView />
            case 'optimization':
                return <OptimizationView />
            case 'trends':
                return <TrendsView />
            case 'settings':
                return <SettingsView />
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="group bg-[#0B0E14] border-r border-white/5 flex flex-col relative z-20 transition-all duration-300"
            >
                {/* Logo Area */}
                <div className={cn("flex items-center justify-between mb-2 transition-all duration-300", isSidebarOpen ? "p-6" : "p-4 justify-center")}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Custom Logo for Team Samadhana */}
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 relative group-hover:scale-105 transition-transform duration-300">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse" />
                        </div>

                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-bold text-[10px] text-blue-400 tracking-[0.2em] leading-tight uppercase">TEAM</span>
                                <span className="font-bold text-lg text-white leading-none tracking-tight">SAMADHANA</span>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className={cn("h-6 w-6 text-muted-foreground hover:text-white shrink-0", !isSidebarOpen && "hidden group-hover:block absolute top-2 right-2")}
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 overflow-hidden">
                    {navItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full justify-start h-12 px-4 rounded-lg transition-all duration-200",
                                activeTab === item.id
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                            title={!isSidebarOpen ? item.label : undefined}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0", isSidebarOpen && "mr-3")} />
                            {isSidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                        </Button>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/5 mt-auto">
                    <div className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer", !isSidebarOpen && "justify-center")}>
                        <div className="h-10 w-10 rounded-full bg-orange-200 overflow-hidden shrink-0 border-2 border-white/10">
                            {/* Placeholder for avatar */}
                            <div className="w-full h-full bg-orange-300" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-semibold text-white truncate">Alex Morgan</span>
                                <span className="text-xs text-muted-foreground truncate">Admin</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
                {renderContent()}
            </div>
        </div>
    )
}
