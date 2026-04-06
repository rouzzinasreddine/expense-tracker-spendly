import AppShell from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesLoading() {
  return (
    <AppShell title="Categories">
      <div className="space-y-12 pb-12">
        {/* Pulse Metric */}
        <section className="bg-[#171c23] rounded-2xl p-8 border border-[#464554]/15">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Skeleton variant="text" className="w-32 mb-4" />
              <Skeleton variant="row" className="h-16 w-64" />
            </div>
            <div className="flex gap-12 border-l border-slate-800/60 pl-12">
              <Skeleton variant="text" className="h-12 w-24" />
              <Skeleton variant="text" className="h-12 w-24" />
            </div>
          </div>
        </section>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
          <Skeleton variant="card" className="h-48" />
        </div>

        {/* Secondary insights */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton variant="chart" className="h-[300px]" />
          <Skeleton variant="chart" className="h-[300px]" />
        </section>
      </div>
    </AppShell>
  );
}
