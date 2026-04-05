import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import ReduceMotion from "@/components/ui/reducemotion";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiV1BotreviewsGetResponse } from "@/typings";
import { toFixedArrayLength } from "@/utils/fixed-array";

export default async function Reviews() {
    const botReviews = await fetch(`${process.env.NEXT_PUBLIC_API}/bot-reviews`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as ApiV1BotreviewsGetResponse[] | null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toFixedArrayLength(botReviews || [], 6).slice(0, 6).map((guild, index) => (
                <Card
                    key={guild.name}
                    className={`text-center relative ${
                        index === 0 || index === 5 ? "h-[400px]" : "h-[300px]"
                    }`}
                >
                    <span className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                        <ReduceMotion
                            alt="server"
                            className="rounded-xl bg-foreground"
                            url={(guild.icon || "/discord.webp")?.split(".").slice(0, -1).join(".")}
                            size={128}
                        />
                    </span>
                    <CardHeader className="mt-16">
                        <CardTitle>{guild.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{guild.review}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}