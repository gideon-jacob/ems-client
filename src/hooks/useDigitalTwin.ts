import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';

export function useDigitalTwin() {
    const {
        equipmentState,
        updateEquipmentMetrics,
        opsSystem
    } = useDashboardStore();

    // Use refs for values that change frequently to avoid dependency cycles in intervals
    const stateRef = useRef(equipmentState);

    // Sync ref with store
    useEffect(() => {
        stateRef.current = equipmentState;
    }, [equipmentState]);

    useEffect(() => {
        // Simulation Tick (Every 2 seconds)
        const interval = setInterval(() => {
            const current = stateRef.current;
            const { metrics, controls } = current;

            let newSupplyTemp = metrics.supplyTemp;
            let newPressure = metrics.pressure;
            let newHumidity = metrics.humidity;
            let newCo2 = metrics.co2Level;

            // Logic 1: Supply Temp fluctuates based on Cooling Valve
            // If valve is > 50%, temp drops. If < 50%, temp rises.
            // Target is generally setpoint (e.g., 21C)
            const targetTemp = controls.tempSetpoint;
            const coolingPower = controls.coolingValve / 100;

            // Simple thermal model: 
            // If cooling is high, drive temp down towards 16C. 
            // If cooling is low, drive temp up towards 26C.
            const ambientTemp = 26;
            const coilCapacity = 10; // Max cooling delta
            const theoreticalTemp = ambientTemp - (coolingPower * coilCapacity);

            // Move towards theoretical temp slowly (thermal inertia)
            const tempDiff = theoreticalTemp - newSupplyTemp;
            newSupplyTemp += tempDiff * 0.1;

            // Add small jitter
            newSupplyTemp += (Math.random() - 0.5) * 0.1;

            // Logic 2: Pressure drops if Fan is Off
            if (controls.fanMode === "Off") {
                newPressure = Math.max(0, newPressure - 1); // Rapid drop
            } else {
                // Target pressure 15 Pa
                const targetPressure = 15;
                newPressure += (targetPressure - newPressure) * 0.2;
                newPressure += (Math.random() - 0.5) * 0.5; // Flutter
            }

            // Logic 3: Humidity & CO2 Random Walk
            newHumidity += (Math.random() - 0.5) * 0.5;
            newHumidity = Math.max(30, Math.min(70, newHumidity)); // Clamp

            newCo2 += Math.floor((Math.random() - 0.5) * 10);
            newCo2 = Math.max(350, Math.min(1000, newCo2));

            updateEquipmentMetrics({
                supplyTemp: Number(newSupplyTemp.toFixed(1)),
                pressure: Number(newPressure.toFixed(1)),
                humidity: Number(newHumidity.toFixed(1)),
                co2Level: Math.round(newCo2)
            });

        }, 2000);

        return () => clearInterval(interval);
    }, [updateEquipmentMetrics, opsSystem]); // Re-start sim if system changes (optional)

    return null; // This hook doesn't render anything
}
