'use client'

import { Sidebar } from "@/components/sidebar";
import { HomeDashboard } from "@/components/home-dashboard";
import { PaywallBlur } from "@/components/paywall-blur";
import { useSubscription } from "@/hooks/use-subscription";

export default function Home() {
  const { subscriptionStatus, loading: subscriptionLoading } = useSubscription();
  
  if (subscriptionLoading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p className="text-[color:var(--text-tertiary)] animate-pulse">Loading...</p>
        </div>
      </Sidebar>
    );
  }

  const showPaywall = subscriptionStatus === 'inactive';
  
  return (
    <PaywallBlur isActive={showPaywall}>
      <Sidebar>
        <HomeDashboard />
      </Sidebar>
    </PaywallBlur>
  );
}
