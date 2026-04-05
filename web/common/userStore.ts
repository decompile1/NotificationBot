import { create } from "zustand";

import type { ApiV1UsersMeGetResponse } from "@/typings";

export interface User {
    HELLO_AND_WELCOME_TO_THE_DEV_TOOLS__PLEASE_GO_AWAY?: true;

    email?: string | null;
    id: string;
    username: string;
    displayName?: string | null;
    avatarHash: string | null;

    __fetched: boolean;

    extended: ApiV1UsersMeGetResponse | undefined;
}

export const userStore = create<User | undefined>(() => ({
    sessiontoken: "",

    id: "",
    username: "",
    avatarHash: "null",

    __fetched: false,
    extended: undefined
}));