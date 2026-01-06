import { useState, useEffect } from "react"

export type TrendDataPoint = {
    timestamp: string // ISO string or distinct time label
    // HVAC
    supplyTemp?: number
    returnTemp?: number
    humidity?: number
    // BMS
    power?: number
    valvePos?: number
    fanSpeed?: number
    // EMS
    particles?: number
    pressure?: number
}

// Zone Profiles for Simulation Baseline
const ZONE_PROFILES: Record<string, { temp: number, power: number, particles: number, pressure: number }> = {
    "WH_COLD": { temp: 4, power: 120, particles: 200, pressure: 10 },
    "WH_FRZ": { temp: -20, power: 350, particles: 100, pressure: 5 },
    "ISO5": { temp: 20, power: 450, particles: 5, pressure: 45 },
    "GRADE_C": { temp: 21, power: 200, particles: 3500, pressure: 30 },
    "GRADE_D": { temp: 22, power: 150, particles: 100000, pressure: 15 },
    "DEFAULT": { temp: 23, power: 100, particles: 500000, pressure: 0 },
}

function getProfile(zoneId: string) {
    if (zoneId.includes("COLD")) return ZONE_PROFILES["WH_COLD"]
    if (zoneId.includes("FREEZER")) return ZONE_PROFILES["WH_FRZ"]
    if (zoneId.includes("ISO5")) return ZONE_PROFILES["ISO5"]
    if (zoneId.includes("C")) return ZONE_PROFILES["GRADE_C"]
    if (zoneId.includes("D") || zoneId.includes("GF")) return ZONE_PROFILES["GRADE_D"]
    return ZONE_PROFILES["DEFAULT"]
}

export type TimeRange = "1H" | "24H" | "7D" | "30D";

export function useTrendData(zoneId: string, system: "HVAC" | "BMS" | "EMS" | "ALL" = "ALL", range: TimeRange = "24H") {
    const [data, setData] = useState<TrendDataPoint[]>([])
    
    console.log(system)

    // Generate Initial Data based on Range
    useEffect(() => {
        const profile = getProfile(zoneId)
        const now = new Date()
        const initialData: TrendDataPoint[] = []

        let points = 96; // Default 24H (15m intervals)
        let intervalMs = 15 * 60 * 1000;
        // let cycleDurationMs = 24 * 60 * 60 * 1000; // 24h cycle for diurnal

        switch (range) {
            case "1H":
                points = 60; // 1 point per minute
                intervalMs = 60 * 1000;
                break;
            case "24H":
                points = 96; // 15 mins
                intervalMs = 15 * 60 * 1000;
                break;
            case "7D":
                points = 168; // 1 hour intervals (7 * 24)
                intervalMs = 60 * 60 * 1000;
                break;
            case "30D":
                points = 120; // 6 hour intervals (30 * 4)
                intervalMs = 6 * 60 * 60 * 1000;
                break;
        }

        // Generate points
        for (let i = 0; i < points; i++) {
            const time = new Date(now.getTime() - (points - i) * intervalMs)

            // Diurnal Cycle Logic (Sine Wave based on 24h day)
            // Need absolute hour of the day for the cycle to match reality (0-24)
            const absoluteHour = time.getHours() + time.getMinutes() / 60
            const cycle = Math.sin((absoluteHour - 6) * Math.PI / 12) // Peak at 12pm

            // Add longer term trend for 30D (e.g., slight drift)
            const longTermTrend = range === "30D" ? Math.sin(i / 20) * 0.5 : 0

            initialData.push({
                timestamp: time.toISOString(),
                // HVAC
                supplyTemp: Number((profile.temp + cycle * 2 + longTermTrend + (Math.random() - 0.5)).toFixed(1)),
                returnTemp: Number((profile.temp + 2 + cycle * 2 + longTermTrend + (Math.random() - 0.5)).toFixed(1)),
                humidity: Number((45 + cycle * 5 + (Math.random() - 0.5) * 2).toFixed(1)),
                // BMS
                power: Number((profile.power + cycle * 50 + Math.random() * 10).toFixed(0)),
                valvePos: Number((60 + cycle * 20 + Math.random() * 5).toFixed(0)),
                fanSpeed: Number((80 + cycle * 10).toFixed(0)),
                // EMS
                particles: Math.max(0, Number((profile.particles + (Math.random() - 0.5) * profile.particles * 0.2).toFixed(0))),
                pressure: Number((profile.pressure + (Math.random() - 0.5) * 2).toFixed(1)),
            })
        }
        setData(initialData)
    }, [zoneId, range])

    // "Live" Update Simulation (Every 3 seconds)
    // Only active for 1H or 24H view to show movement. 7D/30D updates are too slow to see live ticks usually.
    useEffect(() => {
        if (range === "7D" || range === "30D") return;

        const interval = setInterval(() => {
            setData(prev => {
                const last = prev[prev.length - 1]
                if (!last) return prev

                const profile = getProfile(zoneId)
                const now = new Date()

                // Small Random Walk
                const nextPoint: TrendDataPoint = {
                    timestamp: now.toISOString(),
                    supplyTemp: Number((last.supplyTemp! + (Math.random() - 0.5) * 0.2).toFixed(1)),
                    returnTemp: Number((last.returnTemp! + (Math.random() - 0.5) * 0.2).toFixed(1)),
                    humidity: Number((last.humidity! + (Math.random() - 0.5) * 0.5).toFixed(1)),
                    power: Number((last.power! + (Math.random() - 0.5) * 5).toFixed(0)),
                    valvePos: Number((Math.min(100, Math.max(0, last.valvePos! + (Math.random() - 0.5) * 2))).toFixed(0)),
                    fanSpeed: last.fanSpeed,
                    particles: Math.max(0, Number((profile.particles + (Math.random() - 0.5) * profile.particles * 0.1).toFixed(0))),
                    pressure: Number((profile.pressure + (Math.random() - 0.5) * 0.5).toFixed(1)),
                }

                // Keep window consistent size
                return [...prev.slice(1), nextPoint]
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [zoneId, range])

    return data
}
