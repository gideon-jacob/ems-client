import { useState, useEffect } from "react"
import { Factory, Info, Save, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DomainCard } from "./optimization/DomainCard"
import { ProductConfig } from "./optimization/ProductConfig"
import { RoomGradeConfig } from "./optimization/RoomGradeConfig"
import { FacilityMap } from "./optimization/FacilityMap"
import { useDashboardStore } from "@/store/useDashboardStore"

const DOMAINS = [
    "Microbiology",
    "Oncology",
    "Gene Therapy",
    "mRNA Technology",
    "Anti-infective",
    "Internal Medicine",
    "Stem Cell Therapy"
]

export function OptimizationView() {
    const {
        selectedEntity: storeEntity,
        selectedDomains: storeDomains,
        applyOptimizationConfig,
        setActiveTab
    } = useDashboardStore()

    const [selectedDomains, setSelectedDomains] = useState<string[]>(storeDomains.length > 0 ? storeDomains : ["Oncology", "Anti-infective"])
    const [customDomain, setCustomDomain] = useState("")
    const [entity, setEntity] = useState(storeEntity)
    const [isOptimizing, setIsOptimizing] = useState(false)

    useEffect(() => {
        if (storeDomains.length > 0) setSelectedDomains(storeDomains)
        if (storeEntity) setEntity(storeEntity)
    }, [storeDomains, storeEntity])

    const toggleDomain = (domain: string) => {
        if (selectedDomains.includes(domain)) {
            setSelectedDomains(selectedDomains.filter(d => d !== domain))
        } else {
            setSelectedDomains([...selectedDomains, domain])
        }
    }

    const handleOptimize = () => {
        setIsOptimizing(true)

        // Determine Mode based on selection
        const isCritical = selectedDomains.some(d => ["Oncology", "Gene Therapy", "Stem Cell Therapy"].includes(d))
        const mode = isCritical ? "GMP_CRITICAL" : "STANDARD"
        const sopId = `SOP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`

        // Simulate processing delay
        setTimeout(() => {
            applyOptimizationConfig({
                activeSOP: sopId,
                optimizationMode: mode,
                selectedEntity: entity || "Global Pharma Inc.",
                selectedDomains: selectedDomains
            })

            // Redirect to Operations
            setActiveTab("operations")
            setIsOptimizing(false)
        }, 1500)
    }

    return (
        <div className="max-w-4xl mx-auto p-8 h-full overflow-auto">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Industry & Domain Configuration</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Select your industry and operational domains to calibrate HVAC BMS algorithms for GMP compliance.
                    These settings directly influence automated optimization parameters.
                </p>
            </div>

            {/* Section 1: Entity */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <Factory className="text-blue-500 h-5 w-5" />
                    <h2 className="text-lg font-bold text-white">Pharmaceutical Entity</h2>
                </div>
                <div className="bg-[#111421] border border-white/10 rounded-xl p-6">
                    <div className="relative">
                        <select
                            value={entity}
                            onChange={(e) => setEntity(e.target.value)}
                            className="w-full bg-[#1d2135] border border-white/10 rounded-lg h-12 px-4 text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        >
                            <option value="">Select Company (e.g., Pfizer, J&J)</option>
                            <option value="Pfizer Inc.">Pfizer Inc.</option>
                            <option value="Johnson & Johnson">Johnson & Johnson</option>
                            <option value="Novartis AG">Novartis AG</option>
                            <option value="Roche Holding AG">Roche Holding AG</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 ml-1">
                        Selecting your entity loads specific corporate compliance standards.
                    </p>
                </div>
            </div>

            {/* Section 2: Domains */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                        <span className="scale-75">Beaker</span>
                    </div>
                    <h2 className="text-lg font-bold text-white">Biological & Medical Domains</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DOMAINS.map((domain) => (
                        <DomainCard
                            key={domain}
                            label={domain}
                            isSelected={selectedDomains.includes(domain)}
                            onClick={() => toggleDomain(domain)}
                        />
                    ))}
                    <DomainCard
                        label="Custom"
                        isSelected={false}
                        onClick={() => { }}
                        isCustom
                        customValue={customDomain}
                        onCustomChange={setCustomDomain}
                    />
                </div>
            </div>

            {/* Section 3: Products (New) */}
            <ProductConfig selectedDomains={selectedDomains} />

            {/* Section 4: Room & Grades (New) */}
            <RoomGradeConfig />

            {/* Section 5: Facility Map (New) */}
            <FacilityMap />

            {/* Section 6: Info Alert */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 mb-10">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-sm font-bold text-white mb-1">Optimization Impact</h3>
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                        Your selections above will be used to automatically optimize the HVAC system via BMS based on
                        specific ISO-14644-1 and GMP compliance operational requirements. Please ensure accuracy before saving.
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 border-t border-white/5 pt-6">
                <Button variant="outline" className="bg-transparent border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white px-8">
                    Cancel
                </Button>
                <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="bg-blue-600 hover:bg-blue-500 text-white gap-2 px-6"
                >
                    {isOptimizing ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Applying Config...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Optimize HVAC Controls
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
