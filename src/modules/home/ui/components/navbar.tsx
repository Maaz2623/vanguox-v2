"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Navbar = () => {
  const { data } = authClient.useSession();

  return (
    <nav
      className={cn(
        "flex px-8 justify-between items-center py-4 h-16",
        data && "px-4"
      )}
    >
      <div className="flex gap-x-2">
        <Image src={`/logo.svg`} width={35} height={35} alt={`logo`} />
        <span className="text-xl font-semibold">Vanguox</span>
      </div>
      <div className="pr-4 flex gap-x-4">
        <ThemeToggle />
        {data && data.user.image && <UserButton image={data.user.image} />}
      </div>
    </nav>
  );
};
