"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 text-muted-foreground inline-flex h-12 items-center justify-center rounded-2xl p-1.5 shadow-inner",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base layout & Typography
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-500 cursor-pointer outline-none select-none",
        // Inactive Colors
        "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",

        // --- Hover State ---
        "hover:bg-white/40 dark:hover:bg-white/10",

        // --- Focus State ---
        "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",

        // --- Active (Selected) State ---
        "data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600",
        "data-[state=active]:text-white",
        "data-[state=active]:shadow-[0_4px_20px_-2px_rgba(79,70,229,0.5)]",
        "data-[state=active]:scale-[1.02]",

        // --- Click (Pressed) State ---
        "active:scale-95 active:duration-100",

        // Icons
        "[&_svg]:size-4 transition-transform duration-300",
        "data-[state=active]:[&_svg]:scale-110 data-[state=active]:[&_svg]:text-white",

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
