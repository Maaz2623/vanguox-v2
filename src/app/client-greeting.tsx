"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ClientGreeting = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.hello.queryOptions({
      text: "maaz",
    })
  );

  return <div>{data.greeting}</div>;
};
