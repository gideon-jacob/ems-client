import { create } from 'zustand'
import { FACILITY_STRUCTURE } from '@/config/facility-data'

// Optimization Types
interface OptimizationState {
    activeSOP: string | null
    optimizationMode: "STANDARD" | "ECO" | "GMP_CRITICAL"
    selectedEntity: string
    selectedDomains: string[]
    thresholds: {
        tempMin: number
        tempMax: number
        humidityMin: number
        humidityMax: number
        pressureMin: number
    }
}

// Alarm Types
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

// Initial Mock Alarms
const INITIAL_ALARMS: AlarmItem[] = [
    {
        id: '1',
        severity: 'Critical',
        description: 'High Temp Alert > 95°F',
        subtext: 'Threshold exceeded for 10m',
        source: 'Server Room B',
        system: 'HVAC',
        time: '10:42 AM',
        duration: '18m',
        status: 'Active'
    },
    {
        id: '2',
        severity: 'Warning',
        description: 'Filter Maintenance Req',
        subtext: 'Air flow restricted below 80%',
        source: 'AHU-04 (Roof)',
        system: 'HVAC',
        time: '09:15 AM',
        duration: '1h 45m',
        status: 'Ack\'d'
    },
    {
        id: '3',
        severity: 'Critical',
        description: 'CO2 Level High',
        subtext: 'Sensor reading > 1200ppm',
        source: 'Conf Room 3',
        system: 'BMS',
        time: 'Yesterday',
        duration: '24h+',
        status: 'Active'
    },
    {
        id: '4',
        severity: 'Info',
        description: 'Access Door Open',
        subtext: 'Door held open > 5m',
        source: 'Loading Dock B',
        system: 'EMS',
        time: '08:30 AM',
        duration: 'Closed',
        status: 'Resolved'
    },
    {
        id: '5',
        severity: 'Warning',
        description: 'Pressure Drop Detected',
        subtext: 'PSI variation > 15%',
        source: 'Water Pump 2',
        system: 'BMS',
        time: '2 days ago',
        duration: '45m',
        status: 'Active'
    },
    {
        id: '6',
        severity: 'Info',
        description: 'Routine Diagnostics',
        subtext: 'Weekly system health check',
        source: 'Elevator Bank 1',
        system: 'BMS',
        time: '3 days ago',
        duration: '12m',
        status: 'Ack\'d'
    },
    {
        id: '7',
        severity: 'Critical',
        description: 'Main Power Sag',
        subtext: 'Voltage drop on Phase B',
        source: 'Main Breaker',
        system: 'EMS',
        time: '10:45 AM',
        duration: '2m',
        status: 'Active'
    }
]

interface DashboardState extends OptimizationState {
    activeTab: string
    setActiveTab: (tab: string) => void
    isSidebarOpen: boolean
    toggleSidebar: () => void

    // Operations Selection State
    opsBlock: string
    opsFloor: string
    opsSystem: string
    setOpsSelection: (block: string, floor: string, system: string) => void

    // Digital Twin / Equipment State
    equipmentState: {
        systemStatus: "Online" | "Offline" | "Maintenance"
        efficiency: number
        metrics: {
            supplyTemp: number
            returnTemp: number
            humidity: number
            pressure: number
            co2Level: number
            airflow: number
        }
        controls: {
            fanMode: "Auto" | "On" | "Off"
            tempSetpoint: number
            coolingValve: number // 0-100
            damperPos: number // 0-100
        }
    }
    updateEquipmentState: (updates: Partial<DashboardState['equipmentState']>) => void
    updateEquipmentMetrics: (metrics: Partial<DashboardState['equipmentState']['metrics']>) => void
    updateEquipmentControls: (controls: Partial<DashboardState['equipmentState']['controls']>) => void

    // Optimization Actions
    applyOptimizationConfig: (config: Partial<OptimizationState>) => void
    resetOptimization: () => void

    // Alarm Management State
    alarms: AlarmItem[]
    addAlarm: (alarm: AlarmItem) => void
    updateAlarmStatus: (id: string, status: AlarmItem['status']) => void
    clearAlarms: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Dashboard Defaults
    activeTab: 'overview',
    isSidebarOpen: true,

    // Operations Selection Defaults (Default to Prod Block, GF, First AHU)
    opsBlock: FACILITY_STRUCTURE[0].id,
    opsFloor: FACILITY_STRUCTURE[0].floors[0].id,
    opsSystem: FACILITY_STRUCTURE[0].floors[0].systems[0],

    setOpsSelection: (block, floor, system) => set({ opsBlock: block, opsFloor: floor, opsSystem: system }),

    // Digital Twin Defaults
    equipmentState: {
        systemStatus: "Online",
        efficiency: 94,
        metrics: {
            supplyTemp: 21.2,
            returnTemp: 22.4,
            humidity: 45.5,
            pressure: 15.2,
            co2Level: 420,
            airflow: 12500
        },
        controls: {
            fanMode: "Auto",
            tempSetpoint: 21.0,
            coolingValve: 45,
            damperPos: 45
        }
    },

    updateEquipmentState: (updates) => set((state) => ({
        equipmentState: { ...state.equipmentState, ...updates }
    })),

    updateEquipmentMetrics: (metrics) => set((state) => ({
        equipmentState: {
            ...state.equipmentState,
            metrics: { ...state.equipmentState.metrics, ...metrics }
        }
    })),

    updateEquipmentControls: (controls) => set((state) => ({
        equipmentState: {
            ...state.equipmentState,
            controls: { ...state.equipmentState.controls, ...controls }
        }
    })),

    // Optimization Defaults
    activeSOP: null,
    optimizationMode: "STANDARD",
    selectedEntity: "",
    selectedDomains: [],
    thresholds: {
        tempMin: 18,
        tempMax: 24,
        humidityMin: 40,
        humidityMax: 60,
        pressureMin: 10
    },

    // Alarm Management Defaults
    alarms: INITIAL_ALARMS,

    addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),

    updateAlarmStatus: (id, status) => set((state) => ({
        alarms: state.alarms.map(a => a.id === id ? { ...a, status } : a)
    })),

    clearAlarms: () => set({ alarms: [] }),

    // Actions
    setActiveTab: (tab) => set({ activeTab: tab }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    applyOptimizationConfig: (config) => set((state) => ({
        ...state,
        ...config,
        // Auto-generate thresholds based on mode if not provided
        thresholds: config.optimizationMode === "GMP_CRITICAL"
            ? { tempMin: 20, tempMax: 22, humidityMin: 45, humidityMax: 55, pressureMin: 15 } // Stricter
            : { tempMin: 18, tempMax: 24, humidityMin: 40, humidityMax: 60, pressureMin: 10 } // Standard/Eco
    })),

    resetOptimization: () => set({
        activeSOP: null,
        optimizationMode: "STANDARD",
        selectedEntity: "",
        selectedDomains: [],
        thresholds: { tempMin: 18, tempMax: 24, humidityMin: 40, humidityMax: 60, pressureMin: 10 }
    })
}))
