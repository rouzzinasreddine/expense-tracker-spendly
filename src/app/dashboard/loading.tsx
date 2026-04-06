import AppShell from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-44" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl h-[400px] flex flex-col">
            <Skeleton variant="text" className="w-1/3 mb-4" />
            <Skeleton variant="chart" className="flex-1" />
          </div>
          <div className="lg:col-span-1 bg-[#1b2027] p-6 rounded-2xl border border-[#464554]/10 h-[400px] flex flex-col gap-2">
             <Skeleton variant="text" className="w-1/2 mb-4" />
             <Skeleton variant="row" className="h-[60px]" />
             <Skeleton variant="row" className="h-[60px]" />
             <Skeleton variant="row" className="h-[60px]" />
             <Skeleton variant="row" className="h-[60px]" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
