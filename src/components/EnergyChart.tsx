import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { motion } from "framer-motion"

// Mock data matching the curve in the design
const data = [
    { time: '00:00', actual: 30, predicted: 35 },
    { time: '02:00', actual: 45, predicted: 40 },
    { time: '04:00', actual: 60, predicted: 55 },
    { time: '06:00', actual: 75, predicted: 65 },
    { time: '08:00', actual: 80, predicted: 70 },
    { time: '10:00', actual: 70, predicted: 65 },
    { time: '12:00', actual: 55, predicted: 60 },
    { time: '14:00', actual: 50, predicted: 55 },
    { time: '16:00', actual: 52, predicted: 58 },
    { time: '18:00', actual: 70, predicted: 65 },
    { time: '20:00', actual: 85, predicted: 80 },
    { time: '22:00', actual: 65, predicted: 70 },
    { time: 'Now', actual: 45, predicted: 50 },
];

export function EnergyChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-4 lg:col-span-3"
        >
            <Card className="bg-[#1d2135] border-white/5 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-white text-lg">Energy Consumption</CardTitle>
                        <CardDescription className="text-muted-foreground">Actual vs Predicted Load (24h)</CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-white/20" />
                            <span className="text-muted-foreground">Predicted</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1d2135',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                {/* Predicted Line (Dashed/Grey-ish) - approximated with opacity */}
                                <Area
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent"
                                    isAnimationActive={false}
                                />
                                {/* Actual Line (Solid Blue) */}
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fill="url(#colorActual)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
