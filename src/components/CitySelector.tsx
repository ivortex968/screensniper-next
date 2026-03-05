"use client"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const POPULAR_CITIES = [
    "Mumbai", "Delhi-NCR", "Bengaluru", "Hyderabad", "Chandigarh", "Ahmedabad", "Chennai", "Pune", "Kolkata", "Kochi"
]

export function CitySelector() {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCity, setSelectedCity] = useState("Mumbai")

    const filteredCities = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectCity = (city: string) => {
        setSelectedCity(city)
        setOpen(false)
        setSearchQuery("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-primary/10 rounded-full px-4 border border-transparent hover:border-primary/20 transition-all">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{selectedCity}</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden rounded-2xl">
                <DialogHeader className="pb-4 border-b border-border/40">
                    <DialogTitle className="text-xl font-bold">Choose your Location</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for your city..."
                            className="pl-9 h-12 bg-secondary/50 border-border/50 focus-visible:ring-primary rounded-xl"
                        />
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Popular Cities</h4>
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleSelectCity(city)}
                                        className={`px-3 py-2 text-sm text-center rounded-lg transition-all border ${selectedCity === city
                                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                                : "bg-card border-border/40 hover:border-primary/50 hover:bg-primary/5 text-foreground"
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-4 text-sm text-muted-foreground">
                                    No cities found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
