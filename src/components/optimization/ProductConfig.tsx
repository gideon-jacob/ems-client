import { useState, useEffect } from "react"
import { Plus, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Data Mapping based on User Request
const DOMAIN_PRODUCTS: Record<string, string[]> = {
    "Oncology": ["Ibrance", "Xtandi", "Padcev", "Adcetris", "Elrexfio", "Doxorubicin"],
    "Anti-infective": ["Meropenem (Merrem IV)", "Zosyn", "Eraxis", "Vancomycin", "Cefepime", "Paxlovid"],
    "Gene Therapy": ["Beqvez", "Giroctocogene fit.", "Duchenne Candidate", "VTX-801 (Wilson)"],
    "Internal Medicine": ["Eliquis", "Vyndaqel", "Medrol", "Genotropin", "Enbrel"],
    "mRNA Technology": ["Comirnaty (COVID-19)", "Prevnar 20"],
    "Microbiology": ["Sterility Test Kit", "Endotoxin Test", "Bioburden Assay"]
}

interface ProductConfigProps {
    selectedDomains: string[]
}

export function ProductConfig({ selectedDomains }: ProductConfigProps) {
    // Flatten available products based on selected domains
    const [availableProducts, setAvailableProducts] = useState<string[]>([])
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])

    // Custom Additions
    const [newProduct, setNewProduct] = useState("")
    const [sop, setSop] = useState("")
    const [activeSops, setActiveSops] = useState<{ product: string, sop: string }[]>([])

    // Update available products when specific domains change
    useEffect(() => {
        const products = new Set<string>()
        selectedDomains.forEach(domain => {
            if (DOMAIN_PRODUCTS[domain]) {
                DOMAIN_PRODUCTS[domain].forEach(p => products.add(p))
            }
        })
        setAvailableProducts(Array.from(products))
    }, [selectedDomains])

    const toggleProduct = (product: string) => {
        if (selectedProducts.includes(product)) {
            setSelectedProducts(selectedProducts.filter(p => p !== product))
        } else {
            setSelectedProducts([...selectedProducts, product])
        }
    }

    const handleAddProduct = () => {
        if (newProduct && !selectedProducts.includes(newProduct)) {
            setSelectedProducts([...selectedProducts, newProduct])
            // Also add to available to show it's there
            setAvailableProducts([...availableProducts, newProduct])
            setNewProduct("")
        }
    }

    const handleAddSop = () => {
        if (sop && selectedProducts.length > 0) {
            // Apply SOP to all currently selected items that don't have one? 
            // Or just add a generic SOP entry. 
            // Let's attach it to the LAST selected item for now or create a standalone entry.
            // User request: "Add Products ans sop"
            const lastProduct = selectedProducts[selectedProducts.length - 1]
            if (lastProduct) {
                setActiveSops([...activeSops, { product: lastProduct, sop }])
                setSop("")
            }
        }
    }

    if (selectedDomains.length === 0) return null

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    <span className="scale-75">Rx</span>
                </div>
                <h2 className="text-lg font-bold text-white">Drug & Product Configuration</h2>
            </div>

            <div className="bg-[#111421] border border-white/10 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                    Select products manufactured in this facility to load chemical handling profiles and environmental constraints.
                </p>

                {/* Available Products Grid */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {availableProducts.map(product => (
                        <button
                            key={product}
                            onClick={() => toggleProduct(product)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                                selectedProducts.includes(product)
                                    ? "bg-purple-500/20 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {product}
                        </button>
                    ))}
                    {availableProducts.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">Select a domain above to see products...</span>
                    )}
                </div>

                {/* Custom Input Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white ml-1">Add Custom Product</label>
                        <div className="flex gap-2">
                            <Input
                                value={newProduct}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct(e.target.value)}
                                placeholder="e.g. New Compound X"
                                className="bg-[#1d2135] border-white/10 h-9 text-xs"
                            />
                            <Button size="sm" onClick={handleAddProduct} variant="secondary" className="h-9 px-3">
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white ml-1">Assign SOP to Selection</label>
                        <div className="flex gap-2">
                            <Input
                                value={sop}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSop(e.target.value)}
                                placeholder="e.g. SOP-MFG-001"
                                className="bg-[#1d2135] border-white/10 h-9 text-xs"
                            />
                            <Button size="sm" onClick={handleAddSop} disabled={selectedProducts.length === 0} className="h-9 bg-purple-600 hover:bg-purple-500">
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active SOPs Display */}
                {activeSops.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {activeSops.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="bg-[#1a2333] border-purple-500/30 text-purple-200 gap-2 pl-2 pr-1 py-1">
                                <span className="text-[10px] uppercase text-muted-foreground">{item.product}:</span>
                                {item.sop}
                                <button onClick={() => setActiveSops(activeSops.filter((_, i) => i !== idx))} className="ml-1 hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
