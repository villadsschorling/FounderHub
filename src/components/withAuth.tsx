'use client'

import { useEffect } from 'react'

/**
 * withAuth - Temporarily disabled for clean build without Supabase
 * Reverts to a simple pass-through HOC as requested to remove login logic.
 */
export function withAuth(Component: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    // Auth logic removed as requested for the clean look and no-docker setup
    return <Component {...props} />
  }
}
