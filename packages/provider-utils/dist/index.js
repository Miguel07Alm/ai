"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  convertBase64ToUint8Array: () => convertBase64ToUint8Array,
  convertUint8ArrayToBase64: () => convertUint8ArrayToBase64,
  createEventSourceResponseHandler: () => createEventSourceResponseHandler,
  createJsonErrorResponseHandler: () => createJsonErrorResponseHandler,
  createJsonResponseHandler: () => createJsonResponseHandler,
  generateId: () => generateId,
  getErrorMessage: () => getErrorMessage,
  isParseableJson: () => isParseableJson,
  loadApiKey: () => loadApiKey,
  parseJSON: () => parseJSON,
  postJsonToApi: () => postJsonToApi,
  postToApi: () => postToApi,
  safeParseJSON: () => safeParseJSON,
  safeValidateTypes: () => safeValidateTypes,
  scale: () => scale,
  validateTypes: () => validateTypes
});
module.exports = __toCommonJS(src_exports);

// src/generate-id.ts
var import_non_secure = require("nanoid/non-secure");
var generateId = (0, import_non_secure.customAlphabet)(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

// src/get-error-message.ts
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/load-api-key.ts
var import_provider = require("@ai-sdk/provider");
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new import_provider.LoadAPIKeyError({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new import_provider.LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new import_provider.LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new import_provider.LoadAPIKeyError({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}

// src/parse-json.ts
var import_provider3 = require("@ai-sdk/provider");
var import_secure_json_parse = __toESM(require("secure-json-parse"));

// src/validate-types.ts
var import_provider2 = require("@ai-sdk/provider");
function validateTypes({
  value,
  schema
}) {
  try {
    return schema.parse(value);
  } catch (error) {
    throw new import_provider2.TypeValidationError({ value, cause: error });
  }
}
function safeValidateTypes({
  value,
  schema
}) {
  try {
    const validationResult = schema.safeParse(value);
    if (validationResult.success) {
      return {
        success: true,
        value: validationResult.data
      };
    }
    return {
      success: false,
      error: new import_provider2.TypeValidationError({
        value,
        cause: validationResult.error
      })
    };
  } catch (error) {
    return {
      success: false,
      error: import_provider2.TypeValidationError.isTypeValidationError(error) ? error : new import_provider2.TypeValidationError({ value, cause: error })
    };
  }
}

// src/parse-json.ts
function parseJSON({
  text,
  schema
}) {
  try {
    const value = import_secure_json_parse.default.parse(text);
    if (schema == null) {
      return value;
    }
    return validateTypes({ value, schema });
  } catch (error) {
    if (import_provider3.JSONParseError.isJSONParseError(error) || import_provider3.TypeValidationError.isTypeValidationError(error)) {
      throw error;
    }
    throw new import_provider3.JSONParseError({ text, cause: error });
  }
}
function safeParseJSON({
  text,
  schema
}) {
  try {
    const value = import_secure_json_parse.default.parse(text);
    if (schema == null) {
      return {
        success: true,
        value
      };
    }
    return safeValidateTypes({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: import_provider3.JSONParseError.isJSONParseError(error) ? error : new import_provider3.JSONParseError({ text, cause: error })
    };
  }
}
function isParseableJson(input) {
  try {
    import_secure_json_parse.default.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}

// src/post-to-api.ts
var import_provider4 = require("@ai-sdk/provider");
var postJsonToApi = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal
}) => postToApi({
  url,
  headers: {
    ...headers,
    "Content-Type": "application/json"
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal
});
var postToApi = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal
}) => {
  try {
    const definedHeaders = Object.fromEntries(
      Object.entries(headers).filter(([_key, value]) => value != null)
    );
    const response = await fetch(url, {
      method: "POST",
      headers: definedHeaders,
      body: body.content,
      signal: abortSignal
    });
    if (!response.ok) {
      try {
        throw await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError" || import_provider4.APICallError.isAPICallError(error)) {
            throw error;
          }
        }
        throw new import_provider4.APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          requestBodyValues: body.values
        });
      }
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError" || import_provider4.APICallError.isAPICallError(error)) {
          throw error;
        }
      }
      throw new import_provider4.APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
    }
    if (error instanceof TypeError && error.message === "fetch failed") {
      const cause = error.cause;
      if (cause != null) {
        throw new import_provider4.APICallError({
          message: `Cannot connect to API: ${cause.message}`,
          cause,
          url,
          requestBodyValues: body.values,
          isRetryable: true
          // retry when network error
        });
      }
    }
    throw error;
  }
};

// src/response-handler.ts
var import_provider5 = require("@ai-sdk/provider");
var import_stream = require("eventsource-parser/stream");
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  if (responseBody.trim() === "") {
    return new import_provider5.APICallError({
      message: response.statusText,
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      isRetryable: isRetryable == null ? void 0 : isRetryable(response)
    });
  }
  try {
    const parsedError = parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return new import_provider5.APICallError({
      message: errorToMessage(parsedError),
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      data: parsedError,
      isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
    });
  } catch (parseError) {
    return new import_provider5.APICallError({
      message: response.statusText,
      url,
      requestBodyValues,
      statusCode: response.status,
      responseBody,
      isRetryable: isRetryable == null ? void 0 : isRetryable(response)
    });
  }
};
var createEventSourceResponseHandler = (chunkSchema) => async ({ response }) => {
  if (response.body == null) {
    throw new import_provider5.NoResponseBodyError();
  }
  return response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new import_stream.EventSourceParserStream()).pipeThrough(
    new TransformStream({
      transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(
          safeParseJSON({
            text: data,
            schema: chunkSchema
          })
        );
      }
    })
  );
};
var createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = safeParseJSON({
    text: responseBody,
    schema: responseSchema
  });
  if (!parsedResult.success) {
    throw new import_provider5.APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return parsedResult.value;
};

// src/scale.ts
function scale({
  inputMin = 0,
  inputMax = 1,
  outputMin,
  outputMax,
  value
}) {
  if (value === void 0) {
    return void 0;
  }
  const inputRange = inputMax - inputMin;
  const outputRange = outputMax - outputMin;
  return (value - inputMin) * outputRange / inputRange + outputMin;
}

// src/uint8-utils.ts
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = globalThis.atob(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return globalThis.btoa(latin1string);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64,
  createEventSourceResponseHandler,
  createJsonErrorResponseHandler,
  createJsonResponseHandler,
  generateId,
  getErrorMessage,
  isParseableJson,
  loadApiKey,
  parseJSON,
  postJsonToApi,
  postToApi,
  safeParseJSON,
  safeValidateTypes,
  scale,
  validateTypes
});
//# sourceMappingURL=index.js.map