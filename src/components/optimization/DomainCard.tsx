import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DomainCardProps {
    label: string
    isSelected: boolean
    onClick: () => void
    isCustom?: boolean
    onCustomChange?: (val: string) => void
    customValue?: string
}

export function DomainCard({ label, isSelected, onClick, isCustom, onCustomChange, customValue }: DomainCardProps) {
    if (isCustom) {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-text",
                    "bg-[#1d2135] border-white/5 hover:border-white/10"
                )}
            >
                <div className="w-full flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Type custom domain..."
                        value={customValue}
                        onChange={(e) => onCustomChange?.(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-white placeholder:text-muted-foreground w-full text-sm font-medium"
                    />
                    <span className="text-muted-foreground text-lg font-light">+</span>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group select-none",
                isSelected
                    ? "bg-[#1d2135] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-[#1d2135] border-white/5 hover:border-white/10 hover:bg-[#232840]"
            )}
        >
            <div className={cn(
                "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                isSelected ? "bg-blue-500 border-blue-500" : "border-white/20 bg-transparent group-hover:border-white/40"
            )}>
                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
            </div>
            <span className={cn("text-sm font-medium", isSelected ? "text-white" : "text-muted-foreground group-hover:text-white")}>
                {label}
            </span>
        </div>
    )
}
