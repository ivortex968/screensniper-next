import SeatSelection from "@/components/SeatSelection";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-background pt-16" suppressHydrationWarning>
            <SeatSelection movieId={id} />
        </div>
    );
}
