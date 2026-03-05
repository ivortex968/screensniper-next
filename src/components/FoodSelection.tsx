"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, X, UtensilsCrossed, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface FnBItem {
    id: string
    name: string
    price: number
    category: "SNACKS" | "BEVERAGES" | "COMBOS"
    image: string
    description: string
}

const FNB_ITEMS: FnBItem[] = [
    {
        id: "popcorn-l",
        name: "Large Caramel Popcorn",
        price: 350,
        category: "SNACKS",
        image: "https://images.unsplash.com/photo-1578496491152-641570d8a594?q=80&w=400&auto=format&fit=crop",
        description: "Classic sweet caramel popcorn, large tub."
    },
    {
        id: "nachos",
        name: "Cheese Nachos",
        price: 280,
        category: "SNACKS",
        image: "https://images.unsplash.com/photo-1513456887758-c3013895ebc5?q=80&w=400&auto=format&fit=crop",
        description: "Crispy nachos with premium cheese dip."
    },
    {
        id: "pepsi-l",
        name: "Large Pepsi",
        price: 180,
        category: "BEVERAGES",
        image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=400&auto=format&fit=crop",
        description: "Chilled 600ml Pepsi."
    },
    {
        id: "combo-1",
        name: "Classic Combo",
        price: 450,
        category: "COMBOS",
        image: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?q=80&w=400&auto=format&fit=crop",
        description: "Medium Popcorn + 2 Medium Cokes."
    }
]

interface FoodSelectionProps {
    onClose: () => void
    onConfirm: (selectedItems: Record<string, number>) => void
    initialSelected?: Record<string, number>
}

export default function FoodSelection({ onClose, onConfirm, initialSelected = {} }: FoodSelectionProps) {
    const [counts, setCounts] = useState<Record<string, number>>(initialSelected)

    const updateCount = (id: string, delta: number) => {
        setCounts(prev => {
            const current = prev[id] || 0
            const next = Math.max(0, current + delta)
            if (next === 0) {
                const { [id]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [id]: next }
        })
    }

    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0)
    const totalPrice = Object.entries(counts).reduce((acc, [id, count]) => {
        const item = FNB_ITEMS.find(i => i.id === id)
        return acc + (item?.price || 0) * count
    }, 0)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl bg-background border border-border/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            suppressHydrationWarning
        >
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-secondary/30 backdrop-blur-md" suppressHydrationWarning>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Add Food & Drinks</h2>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Skip the counter queue</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar" suppressHydrationWarning>
                {FNB_ITEMS.map((item) => (
                    <Card key={item.id} className="group overflow-hidden border-border/30 hover:border-primary/30 transition-all duration-300 bg-card/50" suppressHydrationWarning>
                        <div className="flex p-3 gap-4">
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {item.category === "COMBOS" && (
                                    <div className="absolute top-1 left-1 bg-yellow-500/90 text-[10px] font-black px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                                        <Zap className="w-2.5 h-2.5" /> COMBO
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1" suppressHydrationWarning>
                                <div suppressHydrationWarning>
                                    <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                                </div>
                                <div className="flex items-center justify-between" suppressHydrationWarning>
                                    <span className="font-black text-sm text-primary">₹{item.price}</span>
                                    <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-1.5 py-0.5" suppressHydrationWarning>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updateCount(item.id, -1)}
                                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-background transition-colors text-muted-foreground disabled:opacity-30 disabled:pointer-events-none"
                                            disabled={!counts[item.id]}
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </motion.button>
                                        <span className="text-xs font-black min-w-[20px] text-center">{counts[item.id] || 0}</span>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => updateCount(item.id, 1)}
                                            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="p-6 bg-secondary/20 border-t border-border/40 backdrop-blur-xl" suppressHydrationWarning>
                <div className="flex items-center justify-between gap-6" suppressHydrationWarning>
                    <div className="flex flex-col" suppressHydrationWarning>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Items Selected</span>
                        <div className="flex items-baseline gap-2" suppressHydrationWarning>
                            <span className="text-2xl font-black">₹{totalPrice}</span>
                            <span className="text-xs text-muted-foreground font-medium">{totalSelected} items</span>
                        </div>
                    </div>
                    <div className="flex gap-3" suppressHydrationWarning>
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold" onClick={() => onConfirm({})}>
                            Skip
                        </Button>
                        <Button className="h-12 px-8 rounded-xl font-extrabold shadow-xl shadow-primary/20" onClick={() => onConfirm(counts)}>
                            Proceed
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
