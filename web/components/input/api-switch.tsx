import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loading-icons";

import type { ApiError } from "@/typings";
import { cn } from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    className?: string;

    name: string;
    badge?: string;
    disabled?: boolean;
    description?: string;
    isTickbox?: boolean;

    url?: string;
    dataName?: string;
    defaultState: boolean;

    onSave?: (state: boolean) => void;
}

export default function Switch({
    className,

    name,
    badge,
    description,
    disabled,
    isTickbox = false,

    url,
    dataName,
    defaultState,

    onSave
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [value, setValue] = useState<boolean>(defaultState);

    useEffect(() => {
        setValue(defaultState);
    }, [defaultState]);

    function update(now: boolean) {
        setState(State.Loading);
        setError(null);

        setValue(now);

        if (!url) {
            if (!onSave) {
                setValue(!now);
                throw new Error("Warning: <Switch.onSave> must be defined when not using <Switch.url>.");
            }

            setState(State.Idle);
            onSave(value);
            return;
        }

        if (!dataName) {
            setValue(!now);
            throw new Error("Warning: <Switch.dataName> must be defined when using <Switch.url>.");
        }

        fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                dataName.includes(".") ? { [dataName.split(".")[0]]: { [dataName.split(".")[1]]: now } } : { [dataName]: now }
            )
        })
            .then(async (res) => {
                const response = await res.json();
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        onSave?.(now);

                        setState(State.Success);
                        setTimeout(() => setState(State.Idle), 1_000 * 8);
                        break;
                    }
                    default: {
                        setValue(!now);

                        setState(State.Idle);
                        setError((response as unknown as ApiError).message);
                        break;
                    }
                }
            })
            .catch(() => {
                setValue(!now);

                setState(State.Idle);
                setError("Error while saving");
            });
    }

    return (
        <div className={cn("relative", description && "mb-2", className)}>
            <div className={cn("flex items-center gap-2", !isTickbox && "mb-6")}>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "sm:text-lg font-medium dark:text-neutral-400 text-neutral-600",
                            value && "dark:text-neutral-300 text-neutral-700"
                        )}
                    >
                        {name}
                    </span>

                    {badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                            {badge}
                        </span>
                    )}

                    {state === State.Loading && (
                        <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                    )}
                </div>

                <SwitchPrimitive.Root
                    className={cn(
                        "ml-auto inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                        value
                            ? "bg-green-500 dark:bg-green-600"
                            : "bg-neutral-300 dark:bg-neutral-700",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    checked={value}
                    onCheckedChange={update}
                    disabled={disabled}
                    aria-label={name}
                >
                    <SwitchPrimitive.Thumb
                        className="block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[18px]"
                    />
                </SwitchPrimitive.Root>
            </div>

            <div className="absolute top-6 mt-0.5">
                {description && <div className="text-neutral-500 text-sm">{description}</div>}

                {error && <div className="ml-auto text-red-500 text-sm">{error}</div>}
            </div>
        </div>
    );
}