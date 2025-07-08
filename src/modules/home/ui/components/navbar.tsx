"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className={cn("flex justify-between items-center py-4 h-14")}>
      <div className="flex gap-x-2">
        <Image src={`/logo.svg`} width={35} height={35} alt={`logo`} />
        <span className="text-xl font-semibold">Vanguox</span>
      </div>
      <div className="pr-4">
        <ThemeToggle />
      </div>
    </nav>
  );
};
