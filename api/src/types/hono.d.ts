import type { User } from "../db/models/user";

declare module "hono" {
    interface ContextVariableMap {
        user: User;
        userId: id;
    }
}