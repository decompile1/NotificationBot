import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
    "w-fit inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:relative [&>svg]:right-1",
    {
        variants: {
            variant: {
                default: "border-border bg-primary/10 text-primary-foreground",
                secondary: "border-border bg-secondary text-secondary-foreground",
                flat: "border-border bg-foreground/40 text-white",
                destructive: "border-border bg-destructive text-destructive-foreground",
                outline: "text-foreground"
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                xs: "px-1.5 h-3.5 text-xxs",
                sm: "px-2 py-0.5 text-xs",
                lg: "px-6 py-2 text-base"
            },
            radius: {
                default: "rounded-md",
                rounded: "rounded-full",
                square: "rounded-none"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            radius: "default"
        }
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, radius, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant, size, radius }), className)} {...props} />;
}

export { Badge, badgeVariants };