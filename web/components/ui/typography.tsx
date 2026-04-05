import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { cn } from "@/utils/cn";

export function Anchor({ className, prefetch, target, children, ...props }: React.ComponentPropsWithRef<typeof Link>) {
    const t = target || (props.href.toString().startsWith("/") ? undefined : "_blank");
    return (
        <Link
            className={cn("text-red-400 hover:underline", className)}
            prefetch={prefetch || !props.href.toString().startsWith("/login")}
            target={t}
            {...props}
        >
            {children} {t === "_blank" && <HiExternalLink className="inline" />}
        </Link>
    );
}

export function Code({ className, children, ...props }: { children: React.ReactNode; } & React.HTMLAttributes<HTMLElement>) {
    return (
        <code className={cn("font-mono bg-red-900 text-primary-foreground py-0.5 px-1.5 rounded-sm select-all", className)} {...props}>
            {children}
        </code>
    );
}

export function Ol({ className, children, ...props }: { children: React.ReactNode; } & React.HTMLAttributes<HTMLUListElement>) {
    return (
        <ol className={cn("ml-5 list-decimal [&>li]:mt-2", className)} {...props}>
            {children}
        </ol>
    );
}