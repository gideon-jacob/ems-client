import { Button } from "@/components/ui/button"
import { FileText, Sliders, Clock } from "lucide-react"

export function ActionButtons() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Button variant="outline" className="h-14 bg-[#1d2135] border-white/5 text-white hover:bg-white/5 hover:text-primary justify-start px-6">
                <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                Generate Report
            </Button>
            <Button variant="outline" className="h-14 bg-[#1d2135] border-white/5 text-white hover:bg-white/5 hover:text-primary justify-start px-6">
                <Sliders className="mr-3 h-5 w-5 text-muted-foreground" />
                Adjust Setpoints
            </Button>
            <Button variant="outline" className="h-14 bg-[#1d2135] border-white/5 text-white hover:bg-white/5 hover:text-primary justify-start px-6">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                Schedule Maintenance
            </Button>
        </div>
    )
}
