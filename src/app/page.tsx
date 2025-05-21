"use server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";
import { ClientGreeting } from "./client-greeting";

const HomePage = async () => {
  const queryClient = getQueryClient();

  void (await queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      text: "Hello from TRPC",
    })
  ));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default HomePage;
