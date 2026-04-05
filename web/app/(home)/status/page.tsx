import Notice from "@/components/notice";

import { getStatus } from "./api";
import { Cluster } from "./cluster.component";
import { Side } from "./serverinfo.component";

export const revalidate = 0;

export default async function Home() {
    const status = await getStatus();
    const error = !status || "message" in status;

    return (<>
        <div className="md:flex gap-4 mb-5 mt-15">
            {error
                ? <Notice message="Failed to fetch cluster status" />
                : <div className="space-y-2 w-full md:w-3/4">
                    {status.map((cluster) => (
                        <Cluster
                            key={"cluster-" + cluster.id}
                            {...cluster}
                        />
                    ))}
                </div>
            }

            {!error && (
                <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                    <Side status={status} />
                </div>
            )}
        </div>
    </>);
}