import { getSubdomain } from "@/helpers/get-subdomain";
import VanguoxLayout from "@/modules/vanguox/vanguox-layout";
import { headers } from "next/headers";
import React from "react";

const MainPage = async () => {
  const host = (await headers()).get("host");

  const subdomain = await getSubdomain(host as string);

  if (subdomain) {
    console.log(subdomain);
  } else {
    console.log("No subdomain");
  }

  return (
    <div>
      <VanguoxLayout />
    </div>
  );
};

export default MainPage;
