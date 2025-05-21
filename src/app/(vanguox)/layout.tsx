import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Navbar } from "./_components/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

export default async function VanguoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.stores.getUserStores.queryOptions());

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>loading...</div>}>
          <Navbar />
        </Suspense>
      </HydrationBoundary>
      {children}
    </div>
  );
}
