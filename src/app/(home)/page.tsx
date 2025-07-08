import { auth } from "@/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";
import React from "react";

const HomePage = async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = data?.user.id;

  return <HomeView userId={userId} />;
};

export default HomePage;
