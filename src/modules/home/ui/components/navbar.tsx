"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav
      className={cn("flex px-8 justify-between pr-8 items-center py-4 h-16")}
    >
      <div className="flex gap-x-2">
        <Image src={`/logo.svg`} width={35} height={35} alt={`logo`} />
        <span className="text-xl font-semibold">Vanguox</span>
      </div>
    </nav>
  );
};
