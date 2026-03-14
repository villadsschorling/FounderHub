'use client'

import { Sidebar } from "@/components/sidebar";
import { MemberDirectory } from "@/components/member-directory";
import { PaywallBlur } from "@/components/paywall-blur";
import { useSubscription } from "@/hooks/use-subscription";

export default function Directory() {
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
        <MemberDirectory />
      </Sidebar>
    </PaywallBlur>
  );
}
