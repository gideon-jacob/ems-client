import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: React.ReactNode
    trend?: string
    trendUp?: boolean
    icon: LucideIcon
    subtext?: string
    iconColor?: string
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, subtext, iconColor = "text-primary" }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-[#1d2135] border-white/5 hover:border-white/10 transition-colors shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white mb-1 flex items-baseline gap-2">
                        {value}
                    </div>
                    {trend && (
                        <p className={`text-xs ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center font-medium`}>
                            {trend}
                        </p>
                    )}
                    {subtext && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {subtext}
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
