export const HttpErrorCode = {
    // 4xx — Client Errors
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Conflict: 409,
    TooManyRequests: 429,
    ParameterRequired: 400,

    // 5xx — Server Errors
    InternalServerError: 500,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    ServerError: 500,
    GuildFetchError: 500,

    // Custom Application-Level 4xx (use 422–499 range)
    MissingParameter: 422, // Unprocessable Entity
    InvalidSessionToken: 440, // Common convention for session timeout
    MissingAccess: 403, // Forbidden - no access
    InvalidCaptcha: 498, // Nonstandard but used by Google APIs
    NoConfigFound: 424, // Failed Dependency
    ChannelNotFound: 404, // Not Found
    MaxGuildsReached: 409 // Conflict
} as const;

export const HttpErrorMessage = {
    // 4xx
    BadRequest: "Bad Request",
    Unauthorized: "Invalid or missing authorization credentials",
    Forbidden: "You do not have permission to perform this action",
    NotFound: "The requested resource could not be found",
    Conflict: "Request conflicts with current state of the resource",
    TooManyRequests: "Too many requests — please try again later",
    ParameterRequired: "A required parameter is missing in the request.",

    // 5xx
    InternalServerError: "Internal server error — please try again later",
    BadGateway: "Invalid response received from upstream server",
    ServiceUnavailable: "Service temporarily unavailable — please retry later",
    GatewayTimeout: "Upstream server timed out responding to the request",
    ServerError: "Something went wrong, try again later",
    GuildFetchError: "Failed to fetch guild details, guildId required",

    // Custom / Application-Level
    MissingParameter: "A required parameter is missing or invalid",
    InvalidSessionToken: "Session expired or invalid — please log in again",
    MissingAccess: "Missing access or not logged in",
    InvalidCaptcha: "Invalid CAPTCHA response — please try again",
    NoConfigFound: "No configuration found for this resource",
    ChannelNotFound: "Discord channel not found or not configured",
    MaxGuildsReached: "Maximum number of configurations for this guild reached"
} satisfies Record<keyof typeof HttpErrorCode, string>;

export type HttpErrorEntry = typeof HttpErrorMessage[keyof typeof HttpErrorMessage];