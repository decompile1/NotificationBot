"use client";

import { useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Props {
    icon?: React.ReactNode;
    text: string;
    title?: string;
    className?: string;
    items?: {
        icon?: React.ReactNode;
        name: string;
        description?: string;
        text: string;
    }[];
    needsWait?: boolean;
}

export function CopyToClipboardButton({
    icon,
    text,
    title,
    className,
    items
}: Props) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [saved, setSaved] = useState(false);

    const handleCopy = (t: string) => {
        navigator.clipboard.writeText(t);
        setSaved(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className={`inline-flex items-center ${className ?? ""}`}>
            {/* Main Copy Button */}
            <Button
                variant={saved ? "secondary" : "default"}
                onClick={() => handleCopy(text)}
                className="rounded-r-none flex-1 justify-start"
                size="sm"
            >
                {icon && <span className="mr-2">{icon}</span>}
                {saved ? "Copied to clipboard" : title || "Copy to clipboard"}
            </Button>

            {/* Dropdown if items exist */}
            {items && items.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={saved ? "secondary" : "default"}
                            size="sm"
                            className="rounded-l-none px-2"
                            aria-label="More copy options"
                        >
                            <HiChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64">
                        {title && (
                            <>
                                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuGroup>
                            {items.map((item, i) => (
                                <DropdownMenuItem
                                    key={i}
                                    onSelect={() => handleCopy(item.text)}
                                    className="flex flex-col items-start gap-1 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        {item.icon && <span>{item.icon}</span>}
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {item.description && (
                                        <span className="text-xs text-muted-foreground">
                                            {item.description}
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}