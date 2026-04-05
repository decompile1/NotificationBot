/* eslint-disable @typescript-eslint/no-explicit-any */
import { type z, ZodError } from "zod";

import type { HttpErrorEntry } from "@/src/constants/http-error";
import { HttpErrorCode, HttpErrorMessage } from "@/src/constants/http-error";

export function httpError(message: HttpErrorEntry = HttpErrorMessage.ServerError, customMessage?: string | ZodError) {
    const code = getErrorCodeByMessage(message);

    return Response.json( // return or throw: either one works
        {
            code,
            message: customMessage instanceof ZodError
                ? parseZodError(customMessage)
                : (customMessage || message)
        },
        {
            status: code > 599
                ? 400
                : code
        }
    );
}

const httpErrorMessages = Object.entries(HttpErrorMessage);

function getErrorCodeByMessage(message: HttpErrorEntry) {
    const entry = httpErrorMessages.find(([, val]) => val === message)!;
    return HttpErrorCode[entry[0] as keyof typeof HttpErrorCode];
}

type ZodIssueFormats =
  | z.core.$ZodIssueInvalidType
  | z.core.$ZodIssueTooBig
  | z.core.$ZodIssueTooSmall
  | z.core.$ZodIssueInvalidStringFormat
  | z.core.$ZodIssueNotMultipleOf
  | z.core.$ZodIssueUnrecognizedKeys
  | z.core.$ZodIssueInvalidValue
  | z.core.$ZodIssueInvalidUnion
  | z.core.$ZodIssueInvalidKey
  | z.core.$ZodIssueInvalidElement
  | z.core.$ZodIssueCustom;

function parseZodError(error: ZodError<any>) {
    const errors: string[] = [];

    const formatSchemaPath = (path: (string | number | symbol)[]) =>
        path.length ? path.map((p) => (typeof p === "symbol" ? p.toString() : p.toString())).join(".") : "Schema";

    const firstLetterToLowerCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

    const makeSureItsString = (value: unknown) => (typeof value === "string" ? value : JSON.stringify(value));

    for (const issue of error.issues as ZodIssueFormats[]) {
        let msg: string;

        switch (issue.code) {
            case "invalid_type":
            case "invalid_format":
                msg = `${formatSchemaPath(issue.path)} must be a ${makeSureItsString((issue as z.core.$ZodIssueInvalidType).expected)}`;
                break;

            case "too_big":
            case "too_small":
            case "not_multiple_of":
            case "unrecognized_keys":
            case "invalid_value":
            case "invalid_union":
            case "invalid_key":
            case "invalid_element":
            case "custom":
                msg = `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message ?? "")}`;
                break;

            default:
                msg = `Schema has an unknown error (JSON: ${JSON.stringify(issue)})`;
        }

        errors.push(msg + ".");
    }

    return errors.join(" ").trim();
}