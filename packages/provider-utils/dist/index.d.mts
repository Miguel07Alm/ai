import { JSONParseError, TypeValidationError, APICallError } from '@ai-sdk/provider';
import * as zod from 'zod';
import { ZodSchema } from 'zod';

/**
Extracts the headers from a response object and returns them as a key-value object.

@param response - The response object to extract headers from.
@returns The headers as a key-value object.
*/
declare function extractResponseHeaders(response: Response): Record<string, string>;

/**
 * Generates a 7-character random string to use for IDs. Not secure.
 */
declare const generateId: (size?: number | undefined) => string;

declare function getErrorMessage(error: unknown | undefined): string;

declare function isAbortError(error: unknown): error is DOMException;

declare function loadApiKey({ apiKey, environmentVariableName, apiKeyParameterName, description, }: {
    apiKey: string | undefined;
    environmentVariableName: string;
    apiKeyParameterName?: string;
    description: string;
}): string;

/**
 * Parses a JSON string into an unknown object.
 *
 * @param text - The JSON string to parse.
 * @returns {unknown} - The parsed JSON object.
 */
declare function parseJSON({ text }: {
    text: string;
}): unknown;
/**
 * Parses a JSON string into a strongly-typed object using the provided schema.
 *
 * @template T - The type of the object to parse the JSON into.
 * @param {string} text - The JSON string to parse.
 * @param {Schema<T>} schema - The schema to use for parsing the JSON.
 * @returns {T} - The parsed object.
 */
declare function parseJSON<T>({ text, schema, }: {
    text: string;
    schema: ZodSchema<T>;
}): T;
type ParseResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    error: JSONParseError | TypeValidationError;
};
/**
 * Safely parses a JSON string and returns the result as an object of type `unknown`.
 *
 * @param text - The JSON string to parse.
 * @returns {object} Either an object with `success: true` and the parsed data, or an object with `success: false` and the error that occurred.
 */
declare function safeParseJSON({ text }: {
    text: string;
}): ParseResult<unknown>;
/**
 * Safely parses a JSON string into a strongly-typed object, using a provided schema to validate the object.
 *
 * @template T - The type of the object to parse the JSON into.
 * @param {string} text - The JSON string to parse.
 * @param {Schema<T>} schema - The schema to use for parsing the JSON.
 * @returns An object with either a `success` flag and the parsed and typed data, or a `success` flag and an error object.
 */
declare function safeParseJSON<T>({ text, schema, }: {
    text: string;
    schema: ZodSchema<T>;
}): ParseResult<T>;
declare function isParseableJson(input: string): boolean;

type ResponseHandler<RETURN_TYPE> = (options: {
    url: string;
    requestBodyValues: unknown;
    response: Response;
}) => PromiseLike<{
    value: RETURN_TYPE;
    responseHeaders?: Record<string, string>;
}>;
declare const createJsonErrorResponseHandler: <T>({ errorSchema, errorToMessage, isRetryable, }: {
    errorSchema: ZodSchema<T, zod.ZodTypeDef, T>;
    errorToMessage: (error: T) => string;
    isRetryable?: ((response: Response, error?: T | undefined) => boolean) | undefined;
}) => ResponseHandler<APICallError>;
declare const createEventSourceResponseHandler: <T>(chunkSchema: ZodSchema<T, zod.ZodTypeDef, T>) => ResponseHandler<ReadableStream<ParseResult<T>>>;
declare const createJsonResponseHandler: <T>(responseSchema: ZodSchema<T, zod.ZodTypeDef, T>) => ResponseHandler<T>;

declare const postJsonToApi: <T>({ url, headers, body, failedResponseHandler, successfulResponseHandler, abortSignal, }: {
    url: string;
    headers?: Record<string, string | undefined> | undefined;
    body: unknown;
    failedResponseHandler: ResponseHandler<APICallError>;
    successfulResponseHandler: ResponseHandler<T>;
    abortSignal?: AbortSignal | undefined;
}) => Promise<{
    value: T;
    responseHeaders?: Record<string, string> | undefined;
}>;
declare const postToApi: <T>({ url, headers, body, successfulResponseHandler, failedResponseHandler, abortSignal, }: {
    url: string;
    headers?: Record<string, string | undefined> | undefined;
    body: {
        content: string | FormData | Uint8Array;
        values: unknown;
    };
    failedResponseHandler: ResponseHandler<Error>;
    successfulResponseHandler: ResponseHandler<T>;
    abortSignal?: AbortSignal | undefined;
}) => Promise<{
    value: T;
    responseHeaders?: Record<string, string> | undefined;
}>;

declare function convertBase64ToUint8Array(base64String: string): Uint8Array;
declare function convertUint8ArrayToBase64(array: Uint8Array): string;

/**
 * Validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} options.value - The object to validate.
 * @param {Schema<T>} options.schema - The schema to use for validating the JSON.
 * @returns {T} - The typed object.
 */
declare function validateTypes<T>({ value, schema, }: {
    value: unknown;
    schema: ZodSchema<T>;
}): T;
/**
 * Safely validates the types of an unknown object using a schema and
 * return a strongly-typed object.
 *
 * @template T - The type of the object to validate.
 * @param {string} options.value - The JSON object to validate.
 * @param {Schema<T>} options.schema - The schema to use for validating the JSON.
 * @returns An object with either a `success` flag and the parsed and typed data, or a `success` flag and an error object.
 */
declare function safeValidateTypes<T>({ value, schema, }: {
    value: unknown;
    schema: ZodSchema<T>;
}): {
    success: true;
    value: T;
} | {
    success: false;
    error: TypeValidationError;
};

declare function withoutTrailingSlash(url: string | undefined): string | undefined;

export { type ParseResult, type ResponseHandler, convertBase64ToUint8Array, convertUint8ArrayToBase64, createEventSourceResponseHandler, createJsonErrorResponseHandler, createJsonResponseHandler, extractResponseHeaders, generateId, getErrorMessage, isAbortError, isParseableJson, loadApiKey, parseJSON, postJsonToApi, postToApi, safeParseJSON, safeValidateTypes, validateTypes, withoutTrailingSlash };