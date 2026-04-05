export const HttpErrorCode = {
    // 4xx
    BadRequest: 400,
    InvalidAuthorization: 401,
    coderequired: 401,
    NotFound: 404,
    NoConfigFound: 404,
    ChannelNotFound: 400,

    // 5xx
    ServerError: 500,
    GuildFetchError: 500,

    // custom using 4xx
    InvalidCaptcha: 403,

    // unknown object - 10xxx
    UnknownAccount: 10_001,

    // validation issue - 50xxx
    InvalidSessionToken: 50_001,
    MissingAccess: 50_001
} as const;

export const HttpErrorMessage = {
    // 4xx
    BadRequest: "Bad Request",
    InvalidAuthorization: "Invalid Authorization",
    coderequired: "A 'code' query parameter must be present in the URL.",
    NotFound: "This route cannot be found or method is not in use",
    NoConfigFound: "No configuration found for this resource",
    ChannelNotFound: "Discord channel not found or set",

    // 5xx
    ServerError: "Something went wrong, try again later",
    GuildFetchError: "Failed to fetch guild details, guildId required",

    // custom using 4xx
    InvalidCaptcha: "Complete the CAPTCHA and try again",

    // unknown object - 10xxx
    UnknownAccount: "Unknown account",

    // validation issue - 50xxx
    InvalidSessionToken: "invalid or missing session token",
    MissingAccess: "Missing access or not logged in"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorMessage[keyof typeof HttpErrorMessage];