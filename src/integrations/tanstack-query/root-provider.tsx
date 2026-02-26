import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient
  }
}

/* ========================================================================

======================================================================== */
// ////////////////////////////////////////////////////////////////////////
//
// ⚠️ Note: The TanstackQuery.Provider is NOT being used anywhere.
// There's no QueryClientProvider wrapping the app in the root component, etc.
// If you're coming from typical React/Vite apps! The traditional pattern would be:
//
//   <QueryClientProvider client={queryClient}>
//     <RouterProvider router={router} />
//   </QueryClientProvider>
//
// But TanStack Start abstracts this away through its SSR integration layer. The TanstackQuery.Provider
// in root-provider.tsx appears to be leftover code from a traditional setup that wasn't needed once
// the SSR integration was implemented.
//
// ////////////////////////////////////////////////////////////////////////

export function Provider({
  children,
  queryClient
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
