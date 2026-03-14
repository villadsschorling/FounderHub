"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function useSubscription() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if this is the owner (you) - email check for grandfather rule
      const isOwner = user.email === 'Founderhub26@gmail.com';
      
      if (isOwner) {
        // Owner always has full access
        setSubscriptionStatus('active');
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, created_at')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Grandfather rule: users created before today get active status
        const profileCreatedAt = new Date(profile.created_at);
        const today = new Date();
        const isGrandfathered = profileCreatedAt < today;
        
        if (isGrandfathered) {
          setSubscriptionStatus('active');
        } else {
          setSubscriptionStatus(profile.subscription_status || 'inactive');
        }
      }
      setLoading(false);
    }

    checkSubscription();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { subscriptionStatus, loading };
}