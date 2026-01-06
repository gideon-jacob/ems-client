import { AlertTriangle } from "lucide-react"

export function AlertBanner() {
    return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4 mb-6">
            <div className="bg-red-500/20 p-2 rounded-lg shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
                <h4 className="text-red-500 font-semibold mb-1">Attention Required</h4>
                <p className="text-red-400/80 text-sm">
                    2 critical alerts in North Wing regarding HVAC pressure.
                </p>
            </div>
        </div>
    )
}
