import WaterNotifier from "@/components/water-notifier";

export default function main() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-4 text-center">
        Hydration Tracker
      </h1>
      <div className="w-full max-w-4xl px-4">
        <WaterNotifier />
      </div>
    </main>
  );
}
