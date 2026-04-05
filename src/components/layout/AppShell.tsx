import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0e141a]">
      <Sidebar />
      <div className="pl-64 min-h-screen flex flex-col">
        <TopBar title={title} />
        <main className="flex-1 px-8 py-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
