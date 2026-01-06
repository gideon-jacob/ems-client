import { useState } from "react"
import {
    Save,
    User,
    Settings,
    Users,
    Link,
    Bell,
    Lock,
    Plus,
    Shield,
    Key,
    Mail,
    Smartphone,
    ChevronDown,
    ChevronUp,
    Activity,
    Info,
    CheckCircle2,
    Share2,
    RefreshCw,
    Settings2,
    Box,
    Cloud,
    AlertTriangle,
    ChevronRight,
    Check,
    Repeat,
    Server
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"



interface Integration {
    id: string
    name: string
    description: string
    status: 'connected' | 'disconnected'
    lastSync?: string
    logo: string
}

interface RoleDefinition {
    id: string
    title: string
    usersCount: number
    description: string
    permissions: string[]
    icon: any
    color: string
}



const INITIAL_INTEGRATIONS: Integration[] = [
    { id: '1', name: 'Honeywell HVAC', description: 'API v3.2', status: 'connected', lastSync: '5m ago', logo: 'H' },
    { id: '2', name: 'Siemens Lighting', description: 'Authorization required', status: 'disconnected', logo: 'S' },
    { id: '3', name: 'Johnson Controls', description: 'BMS Integration', status: 'connected', lastSync: '1h ago', logo: 'JC' },
]

const DEFINED_ROLES: RoleDefinition[] = [
    {
        id: 'admin',
        title: 'System Administrator',
        usersCount: 3,
        description: 'Full privileges across the entire EMS stack.',
        permissions: [
            'Proposed Control Network configuration',
            'Integration settings & API management',
            'Audit trail log management (Delete restricted)'
        ],
        icon: Shield,
        color: 'text-blue-400 bg-blue-400/10'
    },
    {
        id: 'qa',
        title: 'Quality Assurance (QA) / Auditor',
        usersCount: 5,
        description: 'View-only access to all records and audit trails.',
        permissions: ['View all records', 'Export reports', 'Approve/Reject deviations'],
        icon: CheckCircle2,
        color: 'text-purple-400 bg-purple-400/10'
    },
    {
        id: 'engineer',
        title: 'Facilities Engineer',
        usersCount: 8,
        description: 'Operational control over equipment and setpoints.',
        permissions: ['Modify setpoints', 'Acknowledge alarms', 'Maintenance mode control'],
        icon: User,
        color: 'text-orange-400 bg-orange-400/10'
    },
    {
        id: 'operator',
        title: 'Operator',
        usersCount: 24,
        description: 'Basic monitoring and daily interactions.',
        permissions: ['View Dashboard', 'Log basic events'],
        icon: Activity,
        color: 'text-emerald-400 bg-emerald-400/10'
    }
]

export function SettingsView() {
    const [activeTab, setActiveTab] = useState("users")

    // General Settings State
    const [siteName, setSiteName] = useState("Main Campus - Building A")
    const [timezone, setTimezone] = useState("(GMT-05:00) Eastern Time (US & Canada)")
    const [language, setLanguage] = useState("English (US)")
    const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
    const [darkMode, setDarkMode] = useState(true)

    // Users State
    const [expandedRole, setExpandedRole] = useState<string | null>('admin')

    // Integrations State
    const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null)
    const [integrations] = useState<Integration[]>(INITIAL_INTEGRATIONS)
    const [automationEnabled, setAutomationEnabled] = useState(true)

    // Notifications State
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [criticalOnly, setCriticalOnly] = useState(false)
    const [dailyDigest, setDailyDigest] = useState(true)

    // Security State
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false) // Mapped to MFA
    const [digitalSignatures, setDigitalSignatures] = useState(true) // New
    const [sessionTimeout, setSessionTimeout] = useState("15") // Updated default
    const [ipWhitelist, setIpWhitelist] = useState("")

    // Handlers




    const handleSave = () => {
        // In real app, this would save to backend
        alert('Settings saved successfully!')
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8">
                        <Card className="bg-[#111421] border-white/10 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white">General Preferences</h2>
                                    <p className="text-muted-foreground text-sm mt-1">Basic configuration for the dashboard environment.</p>
                                </div>
                                <Settings className="h-5 w-5 text-muted-foreground opacity-50" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Site Name</label>
                                    <Input
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                        className="bg-[#0B0E14] border-white/10 h-11 text-white focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                                    <CustomSelect value={timezone} onChange={setTimezone} options={[
                                        "(GMT-05:00) Eastern Time (US & Canada)",
                                        "(GMT+00:00) UTC",
                                        "(GMT+05:30) IST"
                                    ]} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Language</label>
                                    <CustomSelect value={language} onChange={setLanguage} options={[
                                        "English (US)", "English (UK)", "Spanish", "French"
                                    ]} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Date Format</label>
                                    <CustomSelect value={dateFormat} onChange={setDateFormat} options={[
                                        "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"
                                    ]} />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between bg-[#0B0E14]/30 -mx-8 px-8 py-4">
                                <div>
                                    <div className="text-white font-medium">Dark Mode Default</div>
                                    <div className="text-xs text-muted-foreground">Force dark mode for all new users</div>
                                </div>
                                <CustomSwitch checked={darkMode} onChange={setDarkMode} />
                            </div>
                        </Card>
                    </div>
                )

            case 'users':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">User Management Configuration</h2>
                            <p className="text-muted-foreground">Configure role-based access control (RBAC), security protocols, and audit trails for the EMS system. Ensure compliance with 21 CFR Part 11.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Defined User Roles */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="bg-[#111421] border-white/10 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-blue-400" />
                                            <h3 className="text-lg font-bold text-white">Defined User Roles</h3>
                                        </div>
                                        <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Custom Role
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {DEFINED_ROLES.map((role) => {
                                            const isExpanded = expandedRole === role.id
                                            const Icon = role.icon
                                            return (
                                                <div
                                                    key={role.id}
                                                    className={cn(
                                                        "bg-[#0B0E14] border rounded-lg transition-all duration-200 overflow-hidden",
                                                        isExpanded ? "border-blue-500/30 ring-1 ring-blue-500/20" : "border-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    <div
                                                        className="p-4 flex items-center justify-between cursor-pointer"
                                                        onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", role.color)}>
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-sm">{role.title}</div>
                                                                <div className="text-xs text-muted-foreground">{role.usersCount} Users Assigned</div>
                                                            </div>
                                                        </div>
                                                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="px-4 pb-4 pt-0 pl-[4.5rem]">
                                                            <div className="h-px w-full bg-white/5 mb-4" />
                                                            <p className="text-sm text-gray-400 mb-4">{role.description}</p>
                                                            <div className="space-y-2">
                                                                {role.permissions.map((perm, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                                        {perm}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column: Security & Tracking */}
                            <div className="space-y-6">
                                {/* Security Policy */}
                                <Card className="bg-[#111421] border-white/10 p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Lock className="h-5 w-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">Security Policy</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-medium text-sm">Multi-Factor Authentication</div>
                                                <div className="text-xs text-muted-foreground max-w-[200px]">Mandatory for accessing Confidential environmental data.</div>
                                            </div>
                                            <CustomSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="text-white font-medium text-sm">Digital Signatures</div>
                                                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] px-1 py-0 h-4">21 CFR Part 11</Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground max-w-[200px]">Required for setpoint changes or mode optimizations.</div>
                                            </div>
                                            <CustomSwitch checked={digitalSignatures} onChange={setDigitalSignatures} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-muted-foreground">Session Timeout (Minutes)</label>
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={sessionTimeout}
                                                    onChange={(e) => setSessionTimeout(e.target.value)}
                                                    className="bg-[#0B0E14] border-white/10 h-10 text-white w-20 text-center font-mono"
                                                />
                                                <Button variant="outline" className="flex-1 border-white/10 text-xs text-muted-foreground hover:text-white h-10 bg-[#0B0E14]">
                                                    Auto-logout
                                                </Button>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">Prevents unauthorized access at cleanroom terminals.</div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Tracking Automation */}
                                <Card className="bg-[#111421] border-white/10 p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Activity className="h-5 w-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">Tracking Automation</h3>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 mb-6">
                                        <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-200">
                                            <span className="font-bold">Change Log Active:</span> Every modification logs Timestamp, User ID, and Reason.
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Alert Escalation Routing</label>
                                        <CustomSelect
                                            value="Supervisor & QA Manager"
                                            onChange={() => { }}
                                            options={["Supervisor & QA Manager", "Facilities Only", "Site Admin"]}
                                        />
                                        <div className="text-[10px] text-muted-foreground">Route critical OOS notifications automatically.</div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )

            case 'integrations':
                if (selectedIntegrationId) {
                    const activeIntegration = integrations.find(i => i.id === selectedIntegrationId)
                    return (
                        <div className="space-y-6">
                            {/* Breadcrumb Header */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('integrations')}>Settings</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="hover:text-white cursor-pointer" onClick={() => setSelectedIntegrationId(null)}>Integrations</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-white font-medium">{activeIntegration?.name}</span>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Integrations Setup</h2>
                                    <p className="text-muted-foreground">Synchronize {activeIntegration?.name} and EMS systems with cloud failover and pipeline monitoring. Configure resilience logic and operational modes.</p>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    System Active
                                </Badge>
                            </div>

                            {/* Section 1: Physical-to-Digital Mapping */}
                            <Card className="bg-[#111421] border-white/10 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Share2 className="h-5 w-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">1. Physical-to-Digital Mapping</h3>
                                    </div>
                                    <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-3 w-3 text-yellow-500" />
                                            <span className="text-xs text-white font-medium">Data Classification</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CustomSwitch checked={false} onChange={() => { }} />
                                            <span className="text-xs text-muted-foreground tracking-wider font-bold">CONFIDENTIAL</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm mb-6">Map physical network nodes to API endpoints and classify data streams.</p>

                                {/* Network Node Sync Table */}
                                <div className="rounded-lg border border-white/10 overflow-hidden mb-6">
                                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-bold text-muted-foreground tracking-wider uppercase">
                                        Network Node Sync
                                    </div>
                                    <div className="p-4 grid gap-4">
                                        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                                            <div className="col-span-3">Network Node Source</div>
                                            <div className="col-span-4">Mapped API Endpoint</div>
                                            <div className="col-span-2">Type</div>
                                            <div className="col-span-3">Pipeline Status</div>
                                        </div>

                                        <NodeSyncRow
                                            source="Doc 115-90-001 (Source 1)"
                                            endpoint="/api/v1/sensors/temp-01"
                                            type="Sensor"
                                            status="Connected"
                                        />
                                        <NodeSyncRow
                                            source="Doc 115-90-002 (Source 2)"
                                            endpoint="/api/v1/controllers/ahu-main"
                                            type="AHU Controller"
                                            status="Connected"
                                            typeColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        />
                                        <NodeSyncRow
                                            source="Doc 115-90-003 (Source 3)"
                                            endpoint="/api/v1/valves/flow-rate"
                                            type="Flow Valve"
                                            status="Syncing..."
                                            statusColor="text-yellow-400"
                                            icon={Repeat}
                                            typeColor="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Config Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-white/10 rounded-lg p-4 bg-[#0B0E14]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Activity className="h-4 w-4 text-blue-400" />
                                            <span className="text-sm font-bold text-white">Chilled Water Line Config</span>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Primary Flow Sensor ID</label>
                                            <Input defaultValue="CW-FLOW-09A" className="bg-[#111421] border-white/10 h-9 text-sm text-white font-mono" />
                                        </div>
                                    </div>
                                    <div className="border border-white/10 rounded-lg p-4 bg-[#0B0E14]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Server className="h-4 w-4 text-blue-400" />
                                            <span className="text-sm font-bold text-white">AHU Air-Exchange Config</span>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Controller Target API</label>
                                            <Input defaultValue="https://hvac-internal/api/ahu-04" className="bg-[#111421] border-white/10 h-9 text-sm text-white font-mono" />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Section 2: Automation */}
                                <Card className="bg-[#111421] border-white/10 p-6 lg:col-span-1 h-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <RefreshCw className="h-5 w-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">2. Automation</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-6">Configure failover and heartbeat logic.</p>

                                    <div className="space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-white font-medium text-sm mb-1">Automated Cloud Backup</div>
                                                <div className="text-[10px] text-muted-foreground leading-relaxed">
                                                    Enables 'Store-and-Forward' for Sources 15-19. Data is cached locally during outages.
                                                </div>
                                            </div>
                                            <CustomSwitch checked={automationEnabled} onChange={setAutomationEnabled} />
                                        </div>

                                        <div className="h-px bg-white/5 w-full" />

                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Activity className="h-4 w-4 text-blue-400" />
                                                <div className="text-white font-medium text-sm">Heartbeat Monitoring</div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mb-3">Set polling interval for proactive failure detection.</p>
                                            <div className="relative">
                                                <Input defaultValue="60" className="bg-[#0B0E14] border-white/10 h-10 text-white pr-12 font-mono" />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">SEC</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Section 3: Mode-Based Optimization */}
                                <Card className="bg-[#111421] border-white/10 p-6 lg:col-span-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings2 className="h-5 w-5 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">3. Mode-Based Optimization</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-6">Pharma-specific operational logic and overrides.</p>

                                    {/* Tabs */}
                                    <div className="grid grid-cols-2 p-1 bg-[#0B0E14] rounded-lg mb-6 border border-white/5">
                                        <button className="flex items-center justify-center gap-2 py-2 rounded-md bg-[#1F2937] text-white text-xs font-bold shadow-sm">
                                            <Box className="h-3 w-3" />
                                            Production Mode
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-2 rounded-md text-muted-foreground text-xs font-medium hover:text-white transition-colors">
                                            <Cloud className="h-3 w-3" />
                                            At-Rest / Optimization
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Production Constraints</h4>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Data Polling Frequency</span>
                                                    <span className="text-blue-400 font-bold">High (5s)</span>
                                                </div>
                                                <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-[80%] rounded-full" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Max Air-Exchange Rate</span>
                                                    <span className="text-blue-400 font-bold">100%</span>
                                                </div>
                                                <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-full rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info className="h-4 w-4 text-blue-400" />
                                                    <span className="text-xs font-bold text-white">Mode Impact</span>
                                                </div>
                                                <p className="text-[10px] text-blue-200 leading-relaxed mb-2">
                                                    Production Mode prioritizes data granularity and safety compliance over energy efficiency.
                                                </p>
                                                <p className="text-[10px] text-blue-200 leading-relaxed">
                                                    System will override local setbacks to maintain GMP compliance.
                                                </p>
                                            </div>

                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-3 items-start">
                                                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="text-xs font-bold text-yellow-500 mb-1">CLIENT APPROVAL REQUIRED</div>
                                                    <p className="text-[10px] text-yellow-200/70 leading-relaxed">
                                                        Any integration-level changes (e.g., adding Siemens or Honeywell nodes) will trigger an automated request for CLIENT APPROVAL workflow before becoming active.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 pt-6">
                                <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => setSelectedIntegrationId(null)}>Cancel</Button>
                                <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-semibold">
                                    <Save className="h-4 w-4" />
                                    Save Configuration
                                </Button>
                            </div>
                        </div>
                    )
                }
                return (
                    <Card className="bg-[#111421] border-white/10 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">System Integrations</h2>
                                <p className="text-muted-foreground text-sm mt-1">Manage connections to third-party hardware.</p>
                            </div>
                            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Integration
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {integrations.map(int => (
                                <div key={int.id} className="bg-[#0B0E14] border border-white/10 rounded-xl p-6 group hover:border-white/20 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xs",
                                            int.status === 'connected' ? "bg-white text-gray-800" : "bg-gray-700 text-gray-400"
                                        )}>
                                            {int.logo}
                                        </div>
                                        <Badge className={cn(
                                            int.status === 'connected'
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                        )}>
                                            {int.status === 'connected' ? 'Connected' : 'Disconnected'}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{int.name}</h3>
                                    <p className="text-xs text-muted-foreground mb-6">
                                        {int.description} {int.lastSync && `• Last sync ${int.lastSync}`}
                                    </p>
                                    <Button
                                        className={cn(
                                            "h-8 px-4 text-xs font-medium w-full",
                                            int.status === 'connected'
                                                ? "bg-blue-600 hover:bg-blue-500 text-white"
                                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                        )}
                                        onClick={() => setSelectedIntegrationId(int.id)}
                                    >
                                        Configure
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )

            case 'notifications':
                return (
                    <Card className="bg-[#111421] border-white/10 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
                                <p className="text-muted-foreground text-sm mt-1">Configure how and when you receive alerts.</p>
                            </div>
                            <Bell className="h-5 w-5 text-muted-foreground opacity-50" />
                        </div>

                        <div className="space-y-6">
                            <SettingRow
                                icon={Mail}
                                title="Email Alerts"
                                description="Receive alarm notifications via email"
                                checked={emailAlerts}
                                onChange={setEmailAlerts}
                            />
                            <SettingRow
                                icon={Smartphone}
                                title="Push Notifications"
                                description="Enable browser push notifications"
                                checked={pushNotifications}
                                onChange={setPushNotifications}
                            />
                            <SettingRow
                                icon={Bell}
                                title="Critical Alerts Only"
                                description="Only notify for critical severity alarms"
                                checked={criticalOnly}
                                onChange={setCriticalOnly}
                            />
                            <SettingRow
                                icon={Mail}
                                title="Daily Digest"
                                description="Receive a daily summary email at 8:00 AM"
                                checked={dailyDigest}
                                onChange={setDailyDigest}
                            />
                        </div>
                    </Card>
                )

            case 'security':
                return (
                    <Card className="bg-[#111421] border-white/10 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Security Settings</h2>
                                <p className="text-muted-foreground text-sm mt-1">Manage authentication and access control.</p>
                            </div>
                            <Shield className="h-5 w-5 text-muted-foreground opacity-50" />
                        </div>

                        <div className="space-y-8">
                            <SettingRow
                                icon={Key}
                                title="Two-Factor Authentication"
                                description="Require 2FA for all user logins"
                                checked={twoFactorEnabled}
                                onChange={setTwoFactorEnabled}
                            />

                            <div className="pt-6 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Session Timeout (minutes)</label>
                                        <Input
                                            type="number"
                                            value={sessionTimeout}
                                            onChange={(e) => setSessionTimeout(e.target.value)}
                                            className="bg-[#0B0E14] border-white/10 h-11 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">IP Whitelist (comma-separated)</label>
                                        <Input
                                            value={ipWhitelist}
                                            onChange={(e) => setIpWhitelist(e.target.value)}
                                            placeholder="e.g., 192.168.1.1, 10.0.0.0/24"
                                            className="bg-[#0B0E14] border-white/10 h-11 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h3 className="text-white font-medium mb-4">Password Policy</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <PolicyBadge label="Min 8 chars" active />
                                    <PolicyBadge label="Uppercase" active />
                                    <PolicyBadge label="Number" active />
                                    <PolicyBadge label="Special char" active={false} />
                                </div>
                            </div>
                        </div>
                    </Card>
                )

            default:
                return null
        }
    }

    return (
        <div className="flex h-full flex-col bg-background/50 overflow-hidden">
            {/* Page Header */}
            <header className="flex items-center justify-between border-b border-white/5 p-6 shrink-0 bg-[#0B0E14]">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Configure application preferences, users, and integrations
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-right">
                        <div className="h-10 w-10 rounded-full bg-orange-400/20 border border-orange-400/30 flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-400" />
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-bold text-white">Administrator</div>
                            <div className="text-xs text-muted-foreground">admin@building.com</div>
                        </div>
                    </div>

                    <Button
                        className="bg-blue-600 hover:bg-blue-500 text-white gap-2 font-semibold"
                        onClick={handleSave}
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 p-4 border-r border-white/5 bg-[#0B0E14]/50 hidden md:block">
                    <nav className="space-y-1">
                        <NavButton id="general" label="General" icon={Settings} activeTab={activeTab} onClick={setActiveTab} />
                        <NavButton id="users" label="User Management" icon={Users} activeTab={activeTab} onClick={setActiveTab} />
                        <NavButton id="integrations" label="Integrations" icon={Link} activeTab={activeTab} onClick={setActiveTab} />
                        <NavButton id="notifications" label="Notifications" icon={Bell} activeTab={activeTab} onClick={setActiveTab} />
                        <NavButton id="security" label="Security" icon={Lock} activeTab={activeTab} onClick={setActiveTab} />
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gradient-to-br from-background to-[#111421]">
                    {renderContent()}
                    <div className="h-20" />
                </main>
            </div>
        </div>
    )
}

// Helper Components
function NavButton({ id, label, icon: Icon, activeTab, onClick }: { id: string, label: string, icon: any, activeTab: string, onClick: (id: string) => void }) {
    const isActive = activeTab === id
    return (
        <button
            onClick={() => onClick(id)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
            )}
        >
            <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-muted-foreground")} />
            {label}
        </button>
    )
}

function CustomSelect({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) {
    return (
        <div className="relative">
            <select
                className="w-full h-11 bg-[#0B0E14] border border-white/10 rounded-md px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
        </div>
    )
}

function CustomSwitch({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn("w-11 h-6 rounded-full p-0.5 transition-colors", checked ? 'bg-blue-600' : 'bg-gray-600')}
        >
            <div className={cn("h-5 w-5 bg-white rounded-full shadow-md transform transition-transform", checked ? 'translate-x-5' : 'translate-x-0')} />
        </button>
    )
}

function SettingRow({ icon: Icon, title, description, checked, onChange }: { icon: any, title: string, description: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <div className="text-white font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                </div>
            </div>
            <CustomSwitch checked={checked} onChange={onChange} />
        </div>
    )
}

function PolicyBadge({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={cn(
            "px-3 py-2 rounded-lg text-xs font-medium text-center border",
            active
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/5 text-muted-foreground border-white/10"
        )}>
            {label}
        </div>
    )
}

function NodeSyncRow({ source, endpoint, type, status, typeColor, statusColor, icon: StatusIcon = Check }: any) {
    return (
        <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-[#0B0E14] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
            <div className="col-span-3">
                <div className="text-xs font-mono text-white group-hover:text-blue-400 transition-colors">{source}</div>
            </div>
            <div className="col-span-4">
                <div className="flex items-center gap-2 bg-[#111421] border border-white/10 px-2 py-1 rounded text-xs text-blue-200 font-mono">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {endpoint}
                </div>
            </div>
            <div className="col-span-2">
                <Badge className={cn("text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 h-6", typeColor)}>
                    {type}
                </Badge>
            </div>
            <div className="col-span-3 flex items-center gap-2">
                <StatusIcon className={cn("h-3 w-3 text-emerald-500", statusColor)} />
                <span className={cn("text-xs font-medium text-emerald-500", statusColor)}>{status}</span>
            </div>
        </div>
    )
}
