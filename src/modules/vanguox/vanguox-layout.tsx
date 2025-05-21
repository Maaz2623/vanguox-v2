import { SearchBar } from "@/components/search-bar";
import { Navbar } from "./_components/navbar";
import VanguoxPage from "./vanguox-page";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";

export default async function VanguoxLayout() {
  prefetch(trpc.stores.getStoresByUserId.queryOptions());

  return (
    <>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      <div className="px-3 py-3">
        <SearchBar />
        <VanguoxPage />
      </div>
    </>
  );
}
