"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/utils/cn";

type Variant = "default" | "underline";

function Tabs({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { variant?: "default" | "underline"; }) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn(
                "flex flex-col gap-2",
                variant === "underline" && "relative w-full",
                className
            )}
            {...props}
        />
    );
}


function TabsList({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: Variant; }) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "inline-flex items-center justify-start overflow-x-auto",
                variant === "default" &&
          "bg-muted text-muted-foreground h-9 w-fit rounded-lg p-[3px]",
                variant === "underline" &&
          "w-full border-b border-border p-0 bg-transparent",
                className
            )}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { variant?: Variant; }) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                variant === "default" &&
          "text-primary dark:text-primary-foreground h-[calc(100%-1px)] flex-1 gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm focus-visible:ring-[3px] focus-visible:outline-1 data-[state=active]:bg-background dark:data-[state=active]:text-primary dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:shadow-sm",
                variant === "underline" &&
          "relative px-4 pb-3 pt-2 text-primary-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary",
                className
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

export { Tabs, TabsContent, TabsList, TabsTrigger };