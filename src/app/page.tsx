import { Sidebar } from "@/components/sidebar";
import { BenchmarkDashboard } from "@/components/benchmark-dashboard";

export default function Home() {
  return (
    <Sidebar>
      <BenchmarkDashboard />
    </Sidebar>
  );
}

