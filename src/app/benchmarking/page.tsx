'use client'

import { Sidebar } from "@/components/sidebar";
import { BenchmarkDashboard } from "@/components/benchmark-dashboard";

export default function BenchmarkingPage() {
  return (
    <Sidebar>
      <BenchmarkDashboard />
    </Sidebar>
  );
}
