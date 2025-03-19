"use client";
import { HeroProvider } from "./HeroProvider";
import { QueryProvider } from "./QueryProvider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroProvider>
      <QueryProvider>{children}</QueryProvider>
    </HeroProvider>
  );
};
