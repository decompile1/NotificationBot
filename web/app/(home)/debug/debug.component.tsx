import { cn } from "@/utils/cn";

interface Item {
    name: string;
    value: string;
}

export default function Panel({
    name,
    items,
    action,
    children
}: {
    name: string;
    items: Item[];
    action?: (item: Item) => React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-medium text-neutral-200">{name}</h2>

            <div className="mt-2 flex flex-col gap-3 divide-y-1 divide-foreground">

                {items.map((item) => (
                    <Row
                        name={item.name}
                        value={item.value}
                        key={item.name}
                    >
                        {action && action(item)}
                    </Row>
                ))}

            </div>

            {children}
        </div>
    );
}

export function Row({
    name,
    value,
    children
}: {
    name: string;
    value: string;
    children: React.ReactNode;
}) {
    return (
        <div className="pt-2 flex gap-4 items-center justify-between" >
            <div>
                <h3 className="text-lg font-medium text-neutral-200">{name}</h3>

                <div className={cn(
                    "break-all",
                    name === "sessiontoken" && "blur hover:blur-0 transition duration-50"
                )}>
                    {value}
                </div>
            </div>

            {children}
        </div>
    );
}