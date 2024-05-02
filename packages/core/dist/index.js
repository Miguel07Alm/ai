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

// streams/index.ts
var streams_exports = {};
__export(streams_exports, {
  AIStream: () => AIStream,
  APICallError: () => import_provider8.APICallError,
  AWSBedrockAnthropicMessagesStream: () => AWSBedrockAnthropicMessagesStream,
  AWSBedrockAnthropicStream: () => AWSBedrockAnthropicStream,
  AWSBedrockCohereStream: () => AWSBedrockCohereStream,
  AWSBedrockLlama2Stream: () => AWSBedrockLlama2Stream,
  AWSBedrockStream: () => AWSBedrockStream,
  AnthropicStream: () => AnthropicStream,
  AssistantResponse: () => AssistantResponse,
  CohereStream: () => CohereStream,
  EmptyResponseBodyError: () => import_provider8.EmptyResponseBodyError,
  GenerateObjectResult: () => GenerateObjectResult,
  GenerateTextResult: () => GenerateTextResult,
  GoogleGenerativeAIStream: () => GoogleGenerativeAIStream,
  HuggingFaceStream: () => HuggingFaceStream,
  InkeepStream: () => InkeepStream,
  InvalidArgumentError: () => import_provider8.InvalidArgumentError,
  InvalidDataContentError: () => import_provider8.InvalidDataContentError,
  InvalidPromptError: () => import_provider8.InvalidPromptError,
  InvalidResponseDataError: () => import_provider8.InvalidResponseDataError,
  InvalidToolArgumentsError: () => import_provider8.InvalidToolArgumentsError,
  JSONParseError: () => import_provider8.JSONParseError,
  LangChainStream: () => LangChainStream,
  LoadAPIKeyError: () => import_provider8.LoadAPIKeyError,
  MistralStream: () => MistralStream,
  NoObjectGeneratedError: () => import_provider8.NoObjectGeneratedError,
  NoSuchToolError: () => import_provider8.NoSuchToolError,
  OpenAIStream: () => OpenAIStream,
  ReplicateStream: () => ReplicateStream,
  RetryError: () => import_provider8.RetryError,
  StreamData: () => StreamData,
  StreamObjectResult: () => StreamObjectResult,
  StreamTextResult: () => StreamTextResult,
  StreamingTextResponse: () => StreamingTextResponse,
  ToolCallParseError: () => import_provider8.ToolCallParseError,
  TypeValidationError: () => import_provider8.TypeValidationError,
  UnsupportedFunctionalityError: () => import_provider8.UnsupportedFunctionalityError,
  UnsupportedJSONSchemaError: () => import_provider8.UnsupportedJSONSchemaError,
  convertDataContentToBase64String: () => convertDataContentToBase64String,
  convertDataContentToUint8Array: () => convertDataContentToUint8Array,
  createCallbacksTransformer: () => createCallbacksTransformer,
  createChunkDecoder: () => createChunkDecoder,
  createEventStreamTransformer: () => createEventStreamTransformer,
  createStreamDataTransformer: () => createStreamDataTransformer,
  experimental_AssistantResponse: () => experimental_AssistantResponse,
  experimental_StreamData: () => experimental_StreamData,
  experimental_StreamingReactResponse: () => experimental_StreamingReactResponse,
  experimental_generateObject: () => experimental_generateObject,
  experimental_generateText: () => experimental_generateText,
  experimental_streamObject: () => experimental_streamObject,
  experimental_streamText: () => experimental_streamText,
  formatStreamPart: () => formatStreamPart,
  generateId: () => generateId,
  generateObject: () => generateObject,
  generateText: () => generateText,
  isStreamStringEqualToType: () => isStreamStringEqualToType,
  nanoid: () => generateId,
  parseStreamPart: () => parseStreamPart,
  readDataStream: () => readDataStream,
  readableFromAsyncIterable: () => readableFromAsyncIterable,
  streamObject: () => streamObject,
  streamText: () => streamText,
  streamToResponse: () => streamToResponse,
  tool: () => tool,
  trimStartOfStreamHelper: () => trimStartOfStreamHelper
});
module.exports = __toCommonJS(streams_exports);

// core/generate-object/generate-object.ts
var import_provider5 = require("@ai-sdk/provider");
var import_provider_utils3 = require("@ai-sdk/provider-utils");

// core/generate-text/token-usage.ts
function calculateTokenUsage(usage) {
  return {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.promptTokens + usage.completionTokens
  };
}

// core/util/detect-image-mimetype.ts
var mimeTypeSignatures = [
  { mimeType: "image/gif", bytes: [71, 73, 70] },
  { mimeType: "image/png", bytes: [137, 80, 78, 71] },
  { mimeType: "image/jpeg", bytes: [255, 216] },
  { mimeType: "image/webp", bytes: [82, 73, 70, 70] }
];
function detectImageMimeType(image) {
  for (const { bytes, mimeType } of mimeTypeSignatures) {
    if (image.length >= bytes.length && bytes.every((byte, index) => image[index] === byte)) {
      return mimeType;
    }
  }
  return void 0;
}

// core/prompt/data-content.ts
var import_provider = require("@ai-sdk/provider");
var import_provider_utils = require("@ai-sdk/provider-utils");
function convertDataContentToBase64String(content) {
  if (typeof content === "string") {
    return content;
  }
  if (content instanceof ArrayBuffer) {
    return (0, import_provider_utils.convertUint8ArrayToBase64)(new Uint8Array(content));
  }
  return (0, import_provider_utils.convertUint8ArrayToBase64)(content);
}
function convertDataContentToUint8Array(content) {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (typeof content === "string") {
    return (0, import_provider_utils.convertBase64ToUint8Array)(content);
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  throw new import_provider.InvalidDataContentError({ content });
}

// core/prompt/convert-to-language-model-prompt.ts
function convertToLanguageModelPrompt(prompt) {
  const languageModelMessages = [];
  if (prompt.system != null) {
    languageModelMessages.push({ role: "system", content: prompt.system });
  }
  switch (prompt.type) {
    case "prompt": {
      languageModelMessages.push({
        role: "user",
        content: [{ type: "text", text: prompt.prompt }]
      });
      break;
    }
    case "messages": {
      languageModelMessages.push(
        ...prompt.messages.map((message) => {
          switch (message.role) {
            case "user": {
              if (typeof message.content === "string") {
                return {
                  role: "user",
                  content: [{ type: "text", text: message.content }]
                };
              }
              return {
                role: "user",
                content: message.content.map(
                  (part) => {
                    var _a;
                    switch (part.type) {
                      case "text": {
                        return part;
                      }
                      case "image": {
                        if (part.image instanceof URL) {
                          return {
                            type: "image",
                            image: part.image,
                            mimeType: part.mimeType
                          };
                        }
                        const imageUint8 = convertDataContentToUint8Array(
                          part.image
                        );
                        return {
                          type: "image",
                          image: imageUint8,
                          mimeType: (_a = part.mimeType) != null ? _a : detectImageMimeType(imageUint8)
                        };
                      }
                    }
                  }
                )
              };
            }
            case "assistant": {
              if (typeof message.content === "string") {
                return {
                  role: "assistant",
                  content: [{ type: "text", text: message.content }]
                };
              }
              return { role: "assistant", content: message.content };
            }
            case "tool": {
              return message;
            }
          }
        })
      );
      break;
    }
    default: {
      const _exhaustiveCheck = prompt;
      throw new Error(`Unsupported prompt type: ${_exhaustiveCheck}`);
    }
  }
  return languageModelMessages;
}

// core/prompt/get-validated-prompt.ts
var import_provider2 = require("@ai-sdk/provider");
function getValidatedPrompt(prompt) {
  if (prompt.prompt == null && prompt.messages == null) {
    throw new import_provider2.InvalidPromptError({
      prompt,
      message: "prompt or messages must be defined"
    });
  }
  if (prompt.prompt != null && prompt.messages != null) {
    throw new import_provider2.InvalidPromptError({
      prompt,
      message: "prompt and messages cannot be defined at the same time"
    });
  }
  return prompt.prompt != null ? {
    type: "prompt",
    prompt: prompt.prompt,
    messages: void 0,
    system: prompt.system
  } : {
    type: "messages",
    prompt: void 0,
    messages: prompt.messages,
    // only possible case bc of checks above
    system: prompt.system
  };
}

// core/prompt/prepare-call-settings.ts
var import_provider3 = require("@ai-sdk/provider");
function prepareCallSettings({
  maxTokens,
  temperature,
  topP,
  presencePenalty,
  frequencyPenalty,
  seed,
  maxRetries
}) {
  if (maxTokens != null) {
    if (!Number.isInteger(maxTokens)) {
      throw new import_provider3.InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be an integer"
      });
    }
    if (maxTokens < 1) {
      throw new import_provider3.InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be >= 1"
      });
    }
  }
  if (temperature != null) {
    if (typeof temperature !== "number") {
      throw new import_provider3.InvalidArgumentError({
        parameter: "temperature",
        value: temperature,
        message: "temperature must be a number"
      });
    }
  }
  if (topP != null) {
    if (typeof topP !== "number") {
      throw new import_provider3.InvalidArgumentError({
        parameter: "topP",
        value: topP,
        message: "topP must be a number"
      });
    }
  }
  if (presencePenalty != null) {
    if (typeof presencePenalty !== "number") {
      throw new import_provider3.InvalidArgumentError({
        parameter: "presencePenalty",
        value: presencePenalty,
        message: "presencePenalty must be a number"
      });
    }
  }
  if (frequencyPenalty != null) {
    if (typeof frequencyPenalty !== "number") {
      throw new import_provider3.InvalidArgumentError({
        parameter: "frequencyPenalty",
        value: frequencyPenalty,
        message: "frequencyPenalty must be a number"
      });
    }
  }
  if (seed != null) {
    if (!Number.isInteger(seed)) {
      throw new import_provider3.InvalidArgumentError({
        parameter: "seed",
        value: seed,
        message: "seed must be an integer"
      });
    }
  }
  if (maxRetries != null) {
    if (!Number.isInteger(maxRetries)) {
      throw new import_provider3.InvalidArgumentError({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be an integer"
      });
    }
    if (maxRetries < 0) {
      throw new import_provider3.InvalidArgumentError({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be >= 0"
      });
    }
  }
  return {
    maxTokens,
    temperature: temperature != null ? temperature : 0,
    topP,
    presencePenalty,
    frequencyPenalty,
    seed,
    maxRetries: maxRetries != null ? maxRetries : 2
  };
}

// core/util/convert-zod-to-json-schema.ts
var import_zod_to_json_schema = __toESM(require("zod-to-json-schema"));
function convertZodToJSONSchema(zodSchema) {
  return (0, import_zod_to_json_schema.default)(zodSchema);
}

// core/util/retry-with-exponential-backoff.ts
var import_provider4 = require("@ai-sdk/provider");
var import_provider_utils2 = require("@ai-sdk/provider-utils");

// core/util/delay.ts
async function delay(delayInMs) {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

// core/util/retry-with-exponential-backoff.ts
var retryWithExponentialBackoff = ({
  maxRetries = 2,
  initialDelayInMs = 2e3,
  backoffFactor = 2
} = {}) => async (f) => _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs: initialDelayInMs,
  backoffFactor
});
async function _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs,
  backoffFactor
}, errors = []) {
  try {
    return await f();
  } catch (error) {
    if ((0, import_provider_utils2.isAbortError)(error)) {
      throw error;
    }
    if (maxRetries === 0) {
      throw error;
    }
    const errorMessage = (0, import_provider_utils2.getErrorMessage)(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber > maxRetries) {
      throw new import_provider4.RetryError({
        message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
        reason: "maxRetriesExceeded",
        errors: newErrors
      });
    }
    if (error instanceof Error && import_provider4.APICallError.isAPICallError(error) && error.isRetryable === true && tryNumber <= maxRetries) {
      await delay(delayInMs);
      return _retryWithExponentialBackoff(
        f,
        { maxRetries, delayInMs: backoffFactor * delayInMs, backoffFactor },
        newErrors
      );
    }
    if (tryNumber === 1) {
      throw error;
    }
    throw new import_provider4.RetryError({
      message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}

// core/generate-object/inject-json-schema-into-system.ts
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
function injectJsonSchemaIntoSystem({
  system,
  schema,
  schemaPrefix = DEFAULT_SCHEMA_PREFIX,
  schemaSuffix = DEFAULT_SCHEMA_SUFFIX
}) {
  return [
    system,
    system != null ? "" : null,
    // add a newline if system is not null
    schemaPrefix,
    JSON.stringify(schema),
    schemaSuffix
  ].filter((line) => line != null).join("\n");
}

// core/generate-object/generate-object.ts
async function generateObject({
  model,
  schema,
  mode,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  ...settings
}) {
  var _a, _b;
  const retry = retryWithExponentialBackoff({ maxRetries });
  const jsonSchema = convertZodToJSONSchema(schema);
  if (mode === "auto" || mode == null) {
    mode = model.defaultObjectGenerationMode;
  }
  let result;
  let finishReason;
  let usage;
  let warnings;
  let rawResponse;
  let logprobs;
  switch (mode) {
    case "json": {
      const validatedPrompt = getValidatedPrompt({
        system: injectJsonSchemaIntoSystem({ system, schema: jsonSchema }),
        prompt,
        messages
      });
      const generateResult = await retry(() => {
        return model.doGenerate({
          mode: { type: "object-json" },
          ...prepareCallSettings(settings),
          inputFormat: validatedPrompt.type,
          prompt: convertToLanguageModelPrompt(validatedPrompt),
          abortSignal
        });
      });
      if (generateResult.text === void 0) {
        throw new import_provider5.NoObjectGeneratedError();
      }
      result = generateResult.text;
      finishReason = generateResult.finishReason;
      usage = generateResult.usage;
      warnings = generateResult.warnings;
      rawResponse = generateResult.rawResponse;
      logprobs = generateResult.logprobs;
      break;
    }
    case "grammar": {
      const validatedPrompt = getValidatedPrompt({
        system: injectJsonSchemaIntoSystem({ system, schema: jsonSchema }),
        prompt,
        messages
      });
      const generateResult = await retry(
        () => model.doGenerate({
          mode: { type: "object-grammar", schema: jsonSchema },
          ...settings,
          inputFormat: validatedPrompt.type,
          prompt: convertToLanguageModelPrompt(validatedPrompt),
          abortSignal
        })
      );
      if (generateResult.text === void 0) {
        throw new import_provider5.NoObjectGeneratedError();
      }
      result = generateResult.text;
      finishReason = generateResult.finishReason;
      usage = generateResult.usage;
      warnings = generateResult.warnings;
      rawResponse = generateResult.rawResponse;
      logprobs = generateResult.logprobs;
      break;
    }
    case "tool": {
      const validatedPrompt = getValidatedPrompt({
        system,
        prompt,
        messages
      });
      const generateResult = await retry(
        () => model.doGenerate({
          mode: {
            type: "object-tool",
            tool: {
              type: "function",
              name: "json",
              description: "Respond with a JSON object.",
              parameters: jsonSchema
            }
          },
          ...settings,
          inputFormat: validatedPrompt.type,
          prompt: convertToLanguageModelPrompt(validatedPrompt),
          abortSignal
        })
      );
      const functionArgs = (_b = (_a = generateResult.toolCalls) == null ? void 0 : _a[0]) == null ? void 0 : _b.args;
      if (functionArgs === void 0) {
        throw new import_provider5.NoObjectGeneratedError();
      }
      result = functionArgs;
      finishReason = generateResult.finishReason;
      usage = generateResult.usage;
      warnings = generateResult.warnings;
      rawResponse = generateResult.rawResponse;
      logprobs = generateResult.logprobs;
      break;
    }
    case void 0: {
      throw new Error("Model does not have a default object generation mode.");
    }
    default: {
      const _exhaustiveCheck = mode;
      throw new Error(`Unsupported mode: ${_exhaustiveCheck}`);
    }
  }
  const parseResult = (0, import_provider_utils3.safeParseJSON)({ text: result, schema });
  if (!parseResult.success) {
    throw parseResult.error;
  }
  return new GenerateObjectResult({
    object: parseResult.value,
    finishReason,
    usage: calculateTokenUsage(usage),
    warnings,
    rawResponse,
    logprobs
  });
}
var GenerateObjectResult = class {
  constructor(options) {
    this.object = options.object;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.rawResponse = options.rawResponse;
    this.logprobs = options.logprobs;
  }
};
var experimental_generateObject = generateObject;

// core/util/async-iterable-stream.ts
function createAsyncIterableStream(source, transformer) {
  const transformedStream = source.pipeThrough(
    new TransformStream(transformer)
  );
  transformedStream[Symbol.asyncIterator] = () => {
    const reader = transformedStream.getReader();
    return {
      async next() {
        const { done, value } = await reader.read();
        return done ? { done: true, value: void 0 } : { done: false, value };
      }
    };
  };
  return transformedStream;
}

// core/util/is-deep-equal-data.ts
function isDeepEqualData(obj1, obj2) {
  if (obj1 === obj2)
    return true;
  if (obj1 == null || obj2 == null)
    return false;
  if (typeof obj1 !== "object" && typeof obj2 !== "object")
    return obj1 === obj2;
  if (obj1.constructor !== obj2.constructor)
    return false;
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length)
      return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false;
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false;
  }
  return true;
}

// core/util/parse-partial-json.ts
var import_secure_json_parse = __toESM(require("secure-json-parse"));

// core/util/fix-json.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// core/util/parse-partial-json.ts
function parsePartialJson(jsonText) {
  if (jsonText == null) {
    return void 0;
  }
  try {
    return import_secure_json_parse.default.parse(jsonText);
  } catch (ignored) {
    try {
      const fixedJsonText = fixJson(jsonText);
      return import_secure_json_parse.default.parse(fixedJsonText);
    } catch (ignored2) {
    }
  }
  return void 0;
}

// core/generate-object/stream-object.ts
async function streamObject({
  model,
  schema,
  mode,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  ...settings
}) {
  const retry = retryWithExponentialBackoff({ maxRetries });
  const jsonSchema = convertZodToJSONSchema(schema);
  if (mode === "auto" || mode == null) {
    mode = model.defaultObjectGenerationMode;
  }
  let callOptions;
  let transformer;
  switch (mode) {
    case "json": {
      const validatedPrompt = getValidatedPrompt({
        system: injectJsonSchemaIntoSystem({ system, schema: jsonSchema }),
        prompt,
        messages
      });
      callOptions = {
        mode: { type: "object-json" },
        ...prepareCallSettings(settings),
        inputFormat: validatedPrompt.type,
        prompt: convertToLanguageModelPrompt(validatedPrompt),
        abortSignal
      };
      transformer = {
        transform: (chunk, controller) => {
          switch (chunk.type) {
            case "text-delta":
              controller.enqueue(chunk.textDelta);
              break;
            case "finish":
            case "error":
              controller.enqueue(chunk);
              break;
          }
        }
      };
      break;
    }
    case "grammar": {
      const validatedPrompt = getValidatedPrompt({
        system: injectJsonSchemaIntoSystem({ system, schema: jsonSchema }),
        prompt,
        messages
      });
      callOptions = {
        mode: { type: "object-grammar", schema: jsonSchema },
        ...settings,
        inputFormat: validatedPrompt.type,
        prompt: convertToLanguageModelPrompt(validatedPrompt),
        abortSignal
      };
      transformer = {
        transform: (chunk, controller) => {
          switch (chunk.type) {
            case "text-delta":
              controller.enqueue(chunk.textDelta);
              break;
            case "finish":
            case "error":
              controller.enqueue(chunk);
              break;
          }
        }
      };
      break;
    }
    case "tool": {
      const validatedPrompt = getValidatedPrompt({
        system,
        prompt,
        messages
      });
      callOptions = {
        mode: {
          type: "object-tool",
          tool: {
            type: "function",
            name: "json",
            description: "Respond with a JSON object.",
            parameters: jsonSchema
          }
        },
        ...settings,
        inputFormat: validatedPrompt.type,
        prompt: convertToLanguageModelPrompt(validatedPrompt),
        abortSignal
      };
      transformer = {
        transform(chunk, controller) {
          switch (chunk.type) {
            case "tool-call-delta":
              controller.enqueue(chunk.argsTextDelta);
              break;
            case "finish":
            case "error":
              controller.enqueue(chunk);
              break;
          }
        }
      };
      break;
    }
    case void 0: {
      throw new Error("Model does not have a default object generation mode.");
    }
    default: {
      const _exhaustiveCheck = mode;
      throw new Error(`Unsupported mode: ${_exhaustiveCheck}`);
    }
  }
  const result = await retry(() => model.doStream(callOptions));
  return new StreamObjectResult({
    stream: result.stream.pipeThrough(new TransformStream(transformer)),
    warnings: result.warnings,
    rawResponse: result.rawResponse
  });
}
var StreamObjectResult = class {
  constructor({
    stream,
    warnings,
    rawResponse
  }) {
    this.originalStream = stream;
    this.warnings = warnings;
    this.rawResponse = rawResponse;
  }
  get partialObjectStream() {
    let accumulatedText = "";
    let latestObject = void 0;
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        if (typeof chunk === "string") {
          accumulatedText += chunk;
          const currentObject = parsePartialJson(
            accumulatedText
          );
          if (!isDeepEqualData(latestObject, currentObject)) {
            latestObject = currentObject;
            controller.enqueue(currentObject);
          }
        } else if (chunk.type === "error") {
          throw chunk.error;
        }
      }
    });
  }
  get fullStream() {
    let accumulatedText = "";
    let latestObject = void 0;
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        if (typeof chunk === "string") {
          accumulatedText += chunk;
          const currentObject = parsePartialJson(
            accumulatedText
          );
          if (!isDeepEqualData(latestObject, currentObject)) {
            latestObject = currentObject;
            controller.enqueue({ type: "object", object: currentObject });
          }
        } else {
          switch (chunk.type) {
            case "finish":
              controller.enqueue({
                ...chunk,
                usage: calculateTokenUsage(chunk.usage)
              });
              break;
            default:
              controller.enqueue(chunk);
              break;
          }
        }
      }
    });
  }
};
var experimental_streamObject = streamObject;

// core/generate-text/tool-call.ts
var import_provider6 = require("@ai-sdk/provider");
var import_provider_utils4 = require("@ai-sdk/provider-utils");
function parseToolCall({
  toolCall,
  tools
}) {
  const toolName = toolCall.toolName;
  if (tools == null) {
    throw new import_provider6.NoSuchToolError({ toolName: toolCall.toolName });
  }
  const tool2 = tools[toolName];
  if (tool2 == null) {
    throw new import_provider6.NoSuchToolError({
      toolName: toolCall.toolName,
      availableTools: Object.keys(tools)
    });
  }
  const parseResult = (0, import_provider_utils4.safeParseJSON)({
    text: toolCall.args,
    schema: tool2.parameters
  });
  if (parseResult.success === false) {
    throw new import_provider6.InvalidToolArgumentsError({
      toolName,
      toolArgs: toolCall.args,
      cause: parseResult.error
    });
  }
  return {
    type: "tool-call",
    toolCallId: toolCall.toolCallId,
    toolName,
    args: parseResult.value
  };
}

// core/generate-text/generate-text.ts
async function generateText({
  model,
  tools,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  ...settings
}) {
  var _a, _b;
  const retry = retryWithExponentialBackoff({ maxRetries });
  const validatedPrompt = getValidatedPrompt({ system, prompt, messages });
  const modelResponse = await retry(() => {
    return model.doGenerate({
      mode: {
        type: "regular",
        tools: tools == null ? void 0 : Object.entries(tools).map(([name, tool2]) => ({
          type: "function",
          name,
          description: tool2.description,
          parameters: convertZodToJSONSchema(tool2.parameters)
        }))
      },
      ...prepareCallSettings(settings),
      inputFormat: validatedPrompt.type,
      prompt: convertToLanguageModelPrompt(validatedPrompt),
      abortSignal
    });
  });
  const toolCalls = [];
  for (const modelToolCall of (_a = modelResponse.toolCalls) != null ? _a : []) {
    toolCalls.push(parseToolCall({ toolCall: modelToolCall, tools }));
  }
  const toolResults = tools == null ? [] : await executeTools({ toolCalls, tools });
  return new GenerateTextResult({
    // Always return a string so that the caller doesn't have to check for undefined.
    // If they need to check if the model did not return any text,
    // they can check the length of the string:
    text: (_b = modelResponse.text) != null ? _b : "",
    toolCalls,
    toolResults,
    finishReason: modelResponse.finishReason,
    usage: calculateTokenUsage(modelResponse.usage),
    warnings: modelResponse.warnings,
    rawResponse: modelResponse.rawResponse,
    logprobs: modelResponse.logprobs
  });
}
async function executeTools({
  toolCalls,
  tools
}) {
  const toolResults = await Promise.all(
    toolCalls.map(async (toolCall) => {
      const tool2 = tools[toolCall.toolName];
      if ((tool2 == null ? void 0 : tool2.execute) == null) {
        return void 0;
      }
      const result = await tool2.execute(toolCall.args);
      return {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
        result
      };
    })
  );
  return toolResults.filter(
    (result) => result != null
  );
}
var GenerateTextResult = class {
  constructor(options) {
    this.text = options.text;
    this.toolCalls = options.toolCalls;
    this.toolResults = options.toolResults;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.rawResponse = options.rawResponse;
    this.logprobs = options.logprobs;
  }
};
var experimental_generateText = generateText;

// core/generate-text/run-tools-transformation.ts
var import_provider7 = require("@ai-sdk/provider");

// shared/generate-id.ts
var import_non_secure = require("nanoid/non-secure");
var generateId = (0, import_non_secure.customAlphabet)(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

// core/generate-text/run-tools-transformation.ts
function runToolsTransformation({
  tools,
  generatorStream
}) {
  let canClose = false;
  const outstandingToolCalls = /* @__PURE__ */ new Set();
  let toolResultsStreamController = null;
  const toolResultsStream = new ReadableStream({
    start(controller) {
      toolResultsStreamController = controller;
    }
  });
  const forwardStream = new TransformStream({
    transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "text-delta":
        case "error": {
          controller.enqueue(chunk);
          break;
        }
        case "tool-call": {
          const toolName = chunk.toolName;
          if (tools == null) {
            toolResultsStreamController.enqueue({
              type: "error",
              error: new import_provider7.NoSuchToolError({ toolName: chunk.toolName })
            });
            break;
          }
          const tool2 = tools[toolName];
          if (tool2 == null) {
            toolResultsStreamController.enqueue({
              type: "error",
              error: new import_provider7.NoSuchToolError({
                toolName: chunk.toolName,
                availableTools: Object.keys(tools)
              })
            });
            break;
          }
          try {
            const toolCall = parseToolCall({
              toolCall: chunk,
              tools
            });
            controller.enqueue(toolCall);
            if (tool2.execute != null) {
              const toolExecutionId = generateId();
              outstandingToolCalls.add(toolExecutionId);
              tool2.execute(toolCall.args).then(
                (result) => {
                  toolResultsStreamController.enqueue({
                    ...toolCall,
                    type: "tool-result",
                    result
                  });
                  outstandingToolCalls.delete(toolExecutionId);
                  if (canClose && outstandingToolCalls.size === 0) {
                    toolResultsStreamController.close();
                  }
                },
                (error) => {
                  toolResultsStreamController.enqueue({
                    type: "error",
                    error
                  });
                  outstandingToolCalls.delete(toolExecutionId);
                  if (canClose && outstandingToolCalls.size === 0) {
                    toolResultsStreamController.close();
                  }
                }
              );
            }
          } catch (error) {
            toolResultsStreamController.enqueue({
              type: "error",
              error
            });
          }
          break;
        }
        case "finish": {
          controller.enqueue({
            type: "finish",
            finishReason: chunk.finishReason,
            logprobs: chunk.logprobs,
            usage: calculateTokenUsage(chunk.usage)
          });
          break;
        }
        case "tool-call-delta": {
          break;
        }
        default: {
          const _exhaustiveCheck = chunkType;
          throw new Error(`Unhandled chunk type: ${_exhaustiveCheck}`);
        }
      }
    },
    flush() {
      canClose = true;
      if (outstandingToolCalls.size === 0) {
        toolResultsStreamController.close();
      }
    }
  });
  return new ReadableStream({
    async start(controller) {
      return Promise.all([
        generatorStream.pipeThrough(forwardStream).pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
            }
          })
        ),
        toolResultsStream.pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
              controller.close();
            }
          })
        )
      ]);
    }
  });
}

// core/generate-text/stream-text.ts
async function streamText({
  model,
  tools,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  ...settings
}) {
  const retry = retryWithExponentialBackoff({ maxRetries });
  const validatedPrompt = getValidatedPrompt({ system, prompt, messages });
  const { stream, warnings, rawResponse } = await retry(
    () => model.doStream({
      mode: {
        type: "regular",
        tools: tools == null ? void 0 : Object.entries(tools).map(([name, tool2]) => ({
          type: "function",
          name,
          description: tool2.description,
          parameters: convertZodToJSONSchema(tool2.parameters)
        }))
      },
      ...prepareCallSettings(settings),
      inputFormat: validatedPrompt.type,
      prompt: convertToLanguageModelPrompt(validatedPrompt),
      abortSignal
    })
  );
  return new StreamTextResult({
    stream: runToolsTransformation({
      tools,
      generatorStream: stream
    }),
    warnings,
    rawResponse
  });
}
var StreamTextResult = class {
  constructor({
    stream,
    warnings,
    rawResponse
  }) {
    this.originalStream = stream;
    this.warnings = warnings;
    this.rawResponse = rawResponse;
  }
  /**
  A text stream that returns only the generated text deltas. You can use it
  as either an AsyncIterable or a ReadableStream. When an error occurs, the
  stream will throw the error.
     */
  get textStream() {
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          if (chunk.textDelta.length > 0) {
            controller.enqueue(chunk.textDelta);
          }
        } else if (chunk.type === "error") {
          throw chunk.error;
        }
      }
    });
  }
  /**
  A stream with all events, including text deltas, tool calls, tool results, and
  errors.
  You can use it as either an AsyncIterable or a ReadableStream. When an error occurs, the
  stream will throw the error.
     */
  get fullStream() {
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          if (chunk.textDelta.length > 0) {
            controller.enqueue(chunk);
          }
        } else {
          controller.enqueue(chunk);
        }
      }
    });
  }
  /**
  Converts the result to an `AIStream` object that is compatible with `StreamingTextResponse`.
  It can be used with the `useChat` and `useCompletion` hooks.
  
  @param callbacks 
  Stream callbacks that will be called when the stream emits events.
  
  @returns an `AIStream` object.
     */
  toAIStream(callbacks) {
    return this.textStream.pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
  }
  /**
  Writes stream data output to a Node.js response-like object.
  It sets a `Content-Type` header to `text/plain; charset=utf-8` and 
  writes each stream data part as a separate chunk.
  
  @param response A Node.js response-like object (ServerResponse).
  @param init Optional headers and status code.
     */
  pipeAIStreamToResponse(response, init) {
    var _a;
    response.writeHead((_a = init == null ? void 0 : init.status) != null ? _a : 200, {
      "Content-Type": "text/plain; charset=utf-8",
      ...init == null ? void 0 : init.headers
    });
    const reader = this.textStream.pipeThrough(createCallbacksTransformer(void 0)).pipeThrough(createStreamDataTransformer()).getReader();
    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;
          response.write(value);
        }
      } catch (error) {
        throw error;
      } finally {
        response.end();
      }
    };
    read();
  }
  /**
  Writes text delta output to a Node.js response-like object.
  It sets a `Content-Type` header to `text/plain; charset=utf-8` and 
  writes each text delta as a separate chunk.
  
  @param response A Node.js response-like object (ServerResponse).
  @param init Optional headers and status code.
     */
  pipeTextStreamToResponse(response, init) {
    var _a;
    response.writeHead((_a = init == null ? void 0 : init.status) != null ? _a : 200, {
      "Content-Type": "text/plain; charset=utf-8",
      ...init == null ? void 0 : init.headers
    });
    const reader = this.textStream.getReader();
    const read = async () => {
      const encoder = new TextEncoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done)
            break;
          response.write(encoder.encode(value));
        }
      } catch (error) {
        throw error;
      } finally {
        response.end();
      }
    };
    read();
  }
  /**
  Converts the result to a streamed response object with a stream data part stream.
  It can be used with the `useChat` and `useCompletion` hooks.
  
  @param init Optional headers.
  
  @return A response object.
     */
  toAIStreamResponse(init) {
    return new StreamingTextResponse(this.toAIStream(), init);
  }
  /**
  Creates a simple text stream response.
  Each text delta is encoded as UTF-8 and sent as a separate chunk.
  Non-text-delta events are ignored.
  
  @param init Optional headers and status code.
     */
  toTextStreamResponse(init) {
    var _a;
    const encoder = new TextEncoder();
    return new Response(
      this.textStream.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(encoder.encode(chunk));
          }
        })
      ),
      {
        status: (_a = init == null ? void 0 : init.status) != null ? _a : 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          ...init == null ? void 0 : init.headers
        }
      }
    );
  }
};
var experimental_streamText = streamText;

// core/tool/tool.ts
function tool(tool2) {
  return tool2;
}

// core/types/errors.ts
var import_provider8 = require("@ai-sdk/provider");

// shared/stream-parts.ts
var textStreamPart = {
  code: "0",
  name: "text",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"text" parts expect a string value.');
    }
    return { type: "text", value };
  }
};
var functionCallStreamPart = {
  code: "1",
  name: "function_call",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("function_call" in value) || typeof value.function_call !== "object" || value.function_call == null || !("name" in value.function_call) || !("arguments" in value.function_call) || typeof value.function_call.name !== "string" || typeof value.function_call.arguments !== "string") {
      throw new Error(
        '"function_call" parts expect an object with a "function_call" property.'
      );
    }
    return {
      type: "function_call",
      value
    };
  }
};
var dataStreamPart = {
  code: "2",
  name: "data",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"data" parts expect an array value.');
    }
    return { type: "data", value };
  }
};
var errorStreamPart = {
  code: "3",
  name: "error",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"error" parts expect a string value.');
    }
    return { type: "error", value };
  }
};
var assistantMessageStreamPart = {
  code: "4",
  name: "assistant_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("id" in value) || !("role" in value) || !("content" in value) || typeof value.id !== "string" || typeof value.role !== "string" || value.role !== "assistant" || !Array.isArray(value.content) || !value.content.every(
      (item) => item != null && typeof item === "object" && "type" in item && item.type === "text" && "text" in item && item.text != null && typeof item.text === "object" && "value" in item.text && typeof item.text.value === "string"
    )) {
      throw new Error(
        '"assistant_message" parts expect an object with an "id", "role", and "content" property.'
      );
    }
    return {
      type: "assistant_message",
      value
    };
  }
};
var assistantControlDataStreamPart = {
  code: "5",
  name: "assistant_control_data",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("threadId" in value) || !("messageId" in value) || typeof value.threadId !== "string" || typeof value.messageId !== "string") {
      throw new Error(
        '"assistant_control_data" parts expect an object with a "threadId" and "messageId" property.'
      );
    }
    return {
      type: "assistant_control_data",
      value: {
        threadId: value.threadId,
        messageId: value.messageId
      }
    };
  }
};
var dataMessageStreamPart = {
  code: "6",
  name: "data_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("role" in value) || !("data" in value) || typeof value.role !== "string" || value.role !== "data") {
      throw new Error(
        '"data_message" parts expect an object with a "role" and "data" property.'
      );
    }
    return {
      type: "data_message",
      value
    };
  }
};
var toolCallStreamPart = {
  code: "7",
  name: "tool_calls",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("tool_calls" in value) || typeof value.tool_calls !== "object" || value.tool_calls == null || !Array.isArray(value.tool_calls) || value.tool_calls.some(
      (tc) => tc == null || typeof tc !== "object" || !("id" in tc) || typeof tc.id !== "string" || !("type" in tc) || typeof tc.type !== "string" || !("function" in tc) || tc.function == null || typeof tc.function !== "object" || !("arguments" in tc.function) || typeof tc.function.name !== "string" || typeof tc.function.arguments !== "string"
    )) {
      throw new Error(
        '"tool_calls" parts expect an object with a ToolCallPayload.'
      );
    }
    return {
      type: "tool_calls",
      value
    };
  }
};
var messageAnnotationsStreamPart = {
  code: "8",
  name: "message_annotations",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"message_annotations" parts expect an array value.');
    }
    return { type: "message_annotations", value };
  }
};
var streamParts = [
  textStreamPart,
  functionCallStreamPart,
  dataStreamPart,
  errorStreamPart,
  assistantMessageStreamPart,
  assistantControlDataStreamPart,
  dataMessageStreamPart,
  toolCallStreamPart,
  messageAnnotationsStreamPart
];
var streamPartsByCode = {
  [textStreamPart.code]: textStreamPart,
  [functionCallStreamPart.code]: functionCallStreamPart,
  [dataStreamPart.code]: dataStreamPart,
  [errorStreamPart.code]: errorStreamPart,
  [assistantMessageStreamPart.code]: assistantMessageStreamPart,
  [assistantControlDataStreamPart.code]: assistantControlDataStreamPart,
  [dataMessageStreamPart.code]: dataMessageStreamPart,
  [toolCallStreamPart.code]: toolCallStreamPart,
  [messageAnnotationsStreamPart.code]: messageAnnotationsStreamPart
};
var StreamStringPrefixes = {
  [textStreamPart.name]: textStreamPart.code,
  [functionCallStreamPart.name]: functionCallStreamPart.code,
  [dataStreamPart.name]: dataStreamPart.code,
  [errorStreamPart.name]: errorStreamPart.code,
  [assistantMessageStreamPart.name]: assistantMessageStreamPart.code,
  [assistantControlDataStreamPart.name]: assistantControlDataStreamPart.code,
  [dataMessageStreamPart.name]: dataMessageStreamPart.code,
  [toolCallStreamPart.name]: toolCallStreamPart.code,
  [messageAnnotationsStreamPart.name]: messageAnnotationsStreamPart.code
};
var validCodes = streamParts.map((part) => part.code);
var parseStreamPart = (line) => {
  const firstSeparatorIndex = line.indexOf(":");
  if (firstSeparatorIndex === -1) {
    throw new Error("Failed to parse stream string. No separator found.");
  }
  const prefix = line.slice(0, firstSeparatorIndex);
  if (!validCodes.includes(prefix)) {
    throw new Error(`Failed to parse stream string. Invalid code ${prefix}.`);
  }
  const code = prefix;
  const textValue = line.slice(firstSeparatorIndex + 1);
  const jsonValue = JSON.parse(textValue);
  return streamPartsByCode[code].parse(jsonValue);
};
function formatStreamPart(type, value) {
  const streamPart = streamParts.find((part) => part.name === type);
  if (!streamPart) {
    throw new Error(`Invalid stream part type: ${type}`);
  }
  return `${streamPart.code}:${JSON.stringify(value)}
`;
}

// shared/read-data-stream.ts
var NEWLINE = "\n".charCodeAt(0);
function concatChunks(chunks, totalLength) {
  const concatenatedChunks = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset);
    offset += chunk.length;
  }
  chunks.length = 0;
  return concatenatedChunks;
}
async function* readDataStream(reader, {
  isAborted
} = {}) {
  const decoder = new TextDecoder();
  const chunks = [];
  let totalLength = 0;
  while (true) {
    const { value } = await reader.read();
    if (value) {
      chunks.push(value);
      totalLength += value.length;
      if (value[value.length - 1] !== NEWLINE) {
        continue;
      }
    }
    if (chunks.length === 0) {
      break;
    }
    const concatenatedChunks = concatChunks(chunks, totalLength);
    totalLength = 0;
    const streamParts2 = decoder.decode(concatenatedChunks, { stream: true }).split("\n").filter((line) => line !== "").map(parseStreamPart);
    for (const streamPart of streamParts2) {
      yield streamPart;
    }
    if (isAborted == null ? void 0 : isAborted()) {
      reader.cancel();
      break;
    }
  }
}

// shared/utils.ts
function createChunkDecoder(complex) {
  const decoder = new TextDecoder();
  if (!complex) {
    return function(chunk) {
      if (!chunk)
        return "";
      return decoder.decode(chunk, { stream: true });
    };
  }
  return function(chunk) {
    const decoded = decoder.decode(chunk, { stream: true }).split("\n").filter((line) => line !== "");
    return decoded.map(parseStreamPart).filter(Boolean);
  };
}
var isStreamStringEqualToType = (type, value) => value.startsWith(`${StreamStringPrefixes[type]}:`) && value.endsWith("\n");

// streams/ai-stream.ts
var import_eventsource_parser = require("eventsource-parser");
function createEventStreamTransformer(customParser) {
  const textDecoder = new TextDecoder();
  let eventSourceParser;
  return new TransformStream({
    async start(controller) {
      eventSourceParser = (0, import_eventsource_parser.createParser)(
        (event) => {
          if ("data" in event && event.type === "event" && event.data === "[DONE]" || // Replicate doesn't send [DONE] but does send a 'done' event
          // @see https://replicate.com/docs/streaming
          event.event === "done") {
            controller.terminate();
            return;
          }
          if ("data" in event) {
            const parsedMessage = customParser ? customParser(event.data, {
              event: event.event
            }) : event.data;
            if (parsedMessage)
              controller.enqueue(parsedMessage);
          }
        }
      );
    },
    transform(chunk) {
      eventSourceParser.feed(textDecoder.decode(chunk));
    }
  });
}
function createCallbacksTransformer(cb) {
  const textEncoder = new TextEncoder();
  let aggregatedResponse = "";
  const callbacks = cb || {};
  return new TransformStream({
    async start() {
      if (callbacks.onStart)
        await callbacks.onStart();
    },
    async transform(message, controller) {
      const content = typeof message === "string" ? message : message.content;
      controller.enqueue(textEncoder.encode(content));
      aggregatedResponse += content;
      if (callbacks.onToken)
        await callbacks.onToken(content);
      if (callbacks.onText && typeof message === "string") {
        await callbacks.onText(message);
      }
    },
    async flush() {
      const isOpenAICallbacks = isOfTypeOpenAIStreamCallbacks(callbacks);
      if (callbacks.onCompletion) {
        await callbacks.onCompletion(aggregatedResponse);
      }
      if (callbacks.onFinal && !isOpenAICallbacks) {
        await callbacks.onFinal(aggregatedResponse);
      }
    }
  });
}
function isOfTypeOpenAIStreamCallbacks(callbacks) {
  return "experimental_onFunctionCall" in callbacks;
}
function trimStartOfStreamHelper() {
  let isStreamStart = true;
  return (text) => {
    if (isStreamStart) {
      text = text.trimStart();
      if (text)
        isStreamStart = false;
    }
    return text;
  };
}
function AIStream(response, customParser, callbacks) {
  if (!response.ok) {
    if (response.body) {
      const reader = response.body.getReader();
      return new ReadableStream({
        async start(controller) {
          const { done, value } = await reader.read();
          if (!done) {
            const errorText = new TextDecoder().decode(value);
            controller.error(new Error(`Response error: ${errorText}`));
          }
        }
      });
    } else {
      return new ReadableStream({
        start(controller) {
          controller.error(new Error("Response error: No response body"));
        }
      });
    }
  }
  const responseBodyStream = response.body || createEmptyReadableStream();
  return responseBodyStream.pipeThrough(createEventStreamTransformer(customParser)).pipeThrough(createCallbacksTransformer(callbacks));
}
function createEmptyReadableStream() {
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
function readableFromAsyncIterable(iterable) {
  let it = iterable[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await it.next();
      if (done)
        controller.close();
      else
        controller.enqueue(value);
    },
    async cancel(reason) {
      var _a;
      await ((_a = it.return) == null ? void 0 : _a.call(it, reason));
    }
  });
}

// streams/stream-data.ts
var StreamData = class {
  constructor() {
    this.encoder = new TextEncoder();
    this.controller = null;
    // closing the stream is synchronous, but we want to return a promise
    // in case we're doing async work
    this.isClosedPromise = null;
    this.isClosedPromiseResolver = void 0;
    this.isClosed = false;
    // array to store appended data
    this.data = [];
    this.messageAnnotations = [];
    this.isClosedPromise = new Promise((resolve) => {
      this.isClosedPromiseResolver = resolve;
    });
    const self = this;
    this.stream = new TransformStream({
      start: async (controller) => {
        self.controller = controller;
      },
      transform: async (chunk, controller) => {
        if (self.data.length > 0) {
          const encodedData = self.encoder.encode(
            formatStreamPart("data", self.data)
          );
          self.data = [];
          controller.enqueue(encodedData);
        }
        if (self.messageAnnotations.length) {
          const encodedMessageAnnotations = self.encoder.encode(
            formatStreamPart("message_annotations", self.messageAnnotations)
          );
          self.messageAnnotations = [];
          controller.enqueue(encodedMessageAnnotations);
        }
        controller.enqueue(chunk);
      },
      async flush(controller) {
        const warningTimeout = process.env.NODE_ENV === "development" ? setTimeout(() => {
          console.warn(
            "The data stream is hanging. Did you forget to close it with `data.close()`?"
          );
        }, 3e3) : null;
        await self.isClosedPromise;
        if (warningTimeout !== null) {
          clearTimeout(warningTimeout);
        }
        if (self.data.length) {
          const encodedData = self.encoder.encode(
            formatStreamPart("data", self.data)
          );
          controller.enqueue(encodedData);
        }
        if (self.messageAnnotations.length) {
          const encodedData = self.encoder.encode(
            formatStreamPart("message_annotations", self.messageAnnotations)
          );
          controller.enqueue(encodedData);
        }
      }
    });
  }
  async close() {
    var _a;
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    if (!this.controller) {
      throw new Error("Stream controller is not initialized.");
    }
    (_a = this.isClosedPromiseResolver) == null ? void 0 : _a.call(this);
    this.isClosed = true;
  }
  append(value) {
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    this.data.push(value);
  }
  appendMessageAnnotation(value) {
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    this.messageAnnotations.push(value);
  }
};
function createStreamDataTransformer() {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new TransformStream({
    transform: async (chunk, controller) => {
      const message = decoder.decode(chunk);
      controller.enqueue(encoder.encode(formatStreamPart("text", message)));
    }
  });
}
var experimental_StreamData = class extends StreamData {
};

// streams/anthropic-stream.ts
function parseAnthropicStream() {
  let previous = "";
  return (data) => {
    const json = JSON.parse(data);
    if ("error" in json) {
      throw new Error(`${json.error.type}: ${json.error.message}`);
    }
    if (!("completion" in json)) {
      return;
    }
    const text = json.completion;
    if (!previous || text.length > previous.length && text.startsWith(previous)) {
      const delta = text.slice(previous.length);
      previous = text;
      return delta;
    }
    return text;
  };
}
async function* streamable(stream) {
  for await (const chunk of stream) {
    if ("completion" in chunk) {
      const text = chunk.completion;
      if (text)
        yield text;
    } else if ("delta" in chunk) {
      const { delta } = chunk;
      if ("text" in delta) {
        const text = delta.text;
        if (text)
          yield text;
      }
    }
  }
}
function AnthropicStream(res, cb) {
  if (Symbol.asyncIterator in res) {
    return readableFromAsyncIterable(streamable(res)).pipeThrough(createCallbacksTransformer(cb)).pipeThrough(createStreamDataTransformer());
  } else {
    return AIStream(res, parseAnthropicStream(), cb).pipeThrough(
      createStreamDataTransformer()
    );
  }
}

// streams/assistant-response.ts
function AssistantResponse({ threadId, messageId }, process2) {
  const stream = new ReadableStream({
    async start(controller) {
      var _a;
      const textEncoder = new TextEncoder();
      const sendMessage = (message) => {
        controller.enqueue(
          textEncoder.encode(formatStreamPart("assistant_message", message))
        );
      };
      const sendDataMessage = (message) => {
        controller.enqueue(
          textEncoder.encode(formatStreamPart("data_message", message))
        );
      };
      const sendError = (errorMessage) => {
        controller.enqueue(
          textEncoder.encode(formatStreamPart("error", errorMessage))
        );
      };
      const forwardStream = async (stream2) => {
        var _a2, _b;
        let result = void 0;
        for await (const value of stream2) {
          switch (value.event) {
            case "thread.message.created": {
              controller.enqueue(
                textEncoder.encode(
                  formatStreamPart("assistant_message", {
                    id: value.data.id,
                    role: "assistant",
                    content: [{ type: "text", text: { value: "" } }]
                  })
                )
              );
              break;
            }
            case "thread.message.delta": {
              const content = (_a2 = value.data.delta.content) == null ? void 0 : _a2[0];
              if ((content == null ? void 0 : content.type) === "text" && ((_b = content.text) == null ? void 0 : _b.value) != null) {
                controller.enqueue(
                  textEncoder.encode(
                    formatStreamPart("text", content.text.value)
                  )
                );
              }
              break;
            }
            case "thread.run.completed":
            case "thread.run.requires_action": {
              result = value.data;
              break;
            }
          }
        }
        return result;
      };
      controller.enqueue(
        textEncoder.encode(
          formatStreamPart("assistant_control_data", {
            threadId,
            messageId
          })
        )
      );
      try {
        await process2({
          threadId,
          messageId,
          sendMessage,
          sendDataMessage,
          forwardStream
        });
      } catch (error) {
        sendError((_a = error.message) != null ? _a : `${error}`);
      } finally {
        controller.close();
      }
    },
    pull(controller) {
    },
    cancel() {
    }
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
var experimental_AssistantResponse = AssistantResponse;

// streams/aws-bedrock-stream.ts
async function* asDeltaIterable(response, extractTextDeltaFromChunk) {
  var _a, _b;
  const decoder = new TextDecoder();
  for await (const chunk of (_a = response.body) != null ? _a : []) {
    const bytes = (_b = chunk.chunk) == null ? void 0 : _b.bytes;
    if (bytes != null) {
      const chunkText = decoder.decode(bytes);
      const chunkJSON = JSON.parse(chunkText);
      const delta = extractTextDeltaFromChunk(chunkJSON);
      if (delta != null) {
        yield delta;
      }
    }
  }
}
function AWSBedrockAnthropicMessagesStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => {
    var _a;
    return (_a = chunk.delta) == null ? void 0 : _a.text;
  });
}
function AWSBedrockAnthropicStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk.completion);
}
function AWSBedrockCohereStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk == null ? void 0 : chunk.text);
}
function AWSBedrockLlama2Stream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk.generation);
}
function AWSBedrockStream(response, callbacks, extractTextDeltaFromChunk) {
  return readableFromAsyncIterable(
    asDeltaIterable(response, extractTextDeltaFromChunk)
  ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/cohere-stream.ts
var utf8Decoder = new TextDecoder("utf-8");
async function processLines(lines, controller) {
  for (const line of lines) {
    const { text, is_finished } = JSON.parse(line);
    if (!is_finished) {
      controller.enqueue(text);
    }
  }
}
async function readAndProcessLines(reader, controller) {
  let segment = "";
  while (true) {
    const { value: chunk, done } = await reader.read();
    if (done) {
      break;
    }
    segment += utf8Decoder.decode(chunk, { stream: true });
    const linesArray = segment.split(/\r\n|\n|\r/g);
    segment = linesArray.pop() || "";
    await processLines(linesArray, controller);
  }
  if (segment) {
    const linesArray = [segment];
    await processLines(linesArray, controller);
  }
  controller.close();
}
function createParser2(res) {
  var _a;
  const reader = (_a = res.body) == null ? void 0 : _a.getReader();
  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }
      await readAndProcessLines(reader, controller);
    }
  });
}
async function* streamable2(stream) {
  for await (const chunk of stream) {
    if (chunk.eventType === "text-generation") {
      const text = chunk.text;
      if (text)
        yield text;
    }
  }
}
function CohereStream(reader, callbacks) {
  if (Symbol.asyncIterator in reader) {
    return readableFromAsyncIterable(streamable2(reader)).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
  } else {
    return createParser2(reader).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
  }
}

// streams/google-generative-ai-stream.ts
async function* streamable3(response) {
  var _a, _b, _c;
  for await (const chunk of response.stream) {
    const parts = (_c = (_b = (_a = chunk.candidates) == null ? void 0 : _a[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts;
    if (parts === void 0) {
      continue;
    }
    const firstPart = parts[0];
    if (typeof firstPart.text === "string") {
      yield firstPart.text;
    }
  }
}
function GoogleGenerativeAIStream(response, cb) {
  return readableFromAsyncIterable(streamable3(response)).pipeThrough(createCallbacksTransformer(cb)).pipeThrough(createStreamDataTransformer());
}

// streams/huggingface-stream.ts
function createParser3(res) {
  const trimStartOfStream = trimStartOfStreamHelper();
  return new ReadableStream({
    async pull(controller) {
      var _a, _b;
      const { value, done } = await res.next();
      if (done) {
        controller.close();
        return;
      }
      const text = trimStartOfStream((_b = (_a = value.token) == null ? void 0 : _a.text) != null ? _b : "");
      if (!text)
        return;
      if (value.generated_text != null && value.generated_text.length > 0) {
        return;
      }
      if (text === "</s>" || text === "<|endoftext|>" || text === "<|end|>") {
        return;
      }
      controller.enqueue(text);
    }
  });
}
function HuggingFaceStream(res, callbacks) {
  return createParser3(res).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/inkeep-stream.ts
function InkeepStream(res, callbacks) {
  if (!res.body) {
    throw new Error("Response body is null");
  }
  let chat_session_id = "";
  let records_cited;
  const inkeepEventParser = (data, options) => {
    var _a, _b;
    const { event } = options;
    if (event === "records_cited") {
      records_cited = JSON.parse(data);
      (_a = callbacks == null ? void 0 : callbacks.onRecordsCited) == null ? void 0 : _a.call(callbacks, records_cited);
    }
    if (event === "message_chunk") {
      const inkeepMessageChunk = JSON.parse(data);
      chat_session_id = (_b = inkeepMessageChunk.chat_session_id) != null ? _b : chat_session_id;
      return inkeepMessageChunk.content_chunk;
    }
    return;
  };
  let { onRecordsCited, ...passThroughCallbacks } = callbacks || {};
  passThroughCallbacks = {
    ...passThroughCallbacks,
    onFinal: (completion) => {
      var _a;
      const inkeepOnFinalMetadata = {
        chat_session_id,
        records_cited
      };
      (_a = callbacks == null ? void 0 : callbacks.onFinal) == null ? void 0 : _a.call(callbacks, completion, inkeepOnFinalMetadata);
    }
  };
  return AIStream(res, inkeepEventParser, passThroughCallbacks).pipeThrough(
    createStreamDataTransformer()
  );
}

// streams/langchain-stream.ts
function LangChainStream(callbacks) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const runs = /* @__PURE__ */ new Set();
  const handleError = async (e, runId) => {
    runs.delete(runId);
    await writer.ready;
    await writer.abort(e);
  };
  const handleStart = async (runId) => {
    runs.add(runId);
  };
  const handleEnd = async (runId) => {
    runs.delete(runId);
    if (runs.size === 0) {
      await writer.ready;
      await writer.close();
    }
  };
  return {
    stream: stream.readable.pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer()),
    writer,
    handlers: {
      handleLLMNewToken: async (token) => {
        await writer.ready;
        await writer.write(token);
      },
      handleLLMStart: async (_llm, _prompts, runId) => {
        handleStart(runId);
      },
      handleLLMEnd: async (_output, runId) => {
        await handleEnd(runId);
      },
      handleLLMError: async (e, runId) => {
        await handleError(e, runId);
      },
      handleChainStart: async (_chain, _inputs, runId) => {
        handleStart(runId);
      },
      handleChainEnd: async (_outputs, runId) => {
        await handleEnd(runId);
      },
      handleChainError: async (e, runId) => {
        await handleError(e, runId);
      },
      handleToolStart: async (_tool, _input, runId) => {
        handleStart(runId);
      },
      handleToolEnd: async (_output, runId) => {
        await handleEnd(runId);
      },
      handleToolError: async (e, runId) => {
        await handleError(e, runId);
      }
    }
  };
}

// streams/mistral-stream.ts
async function* streamable4(stream) {
  var _a, _b;
  for await (const chunk of stream) {
    const content = (_b = (_a = chunk.choices[0]) == null ? void 0 : _a.delta) == null ? void 0 : _b.content;
    if (content === void 0 || content === "") {
      continue;
    }
    yield content;
  }
}
function MistralStream(response, callbacks) {
  const stream = readableFromAsyncIterable(streamable4(response));
  return stream.pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/openai-stream.ts
function parseOpenAIStream() {
  const extract = chunkToText();
  return (data) => extract(JSON.parse(data));
}
async function* streamable5(stream) {
  const extract = chunkToText();
  for await (let chunk of stream) {
    if ("promptFilterResults" in chunk) {
      chunk = {
        id: chunk.id,
        created: chunk.created.getDate(),
        object: chunk.object,
        // not exposed by Azure API
        model: chunk.model,
        // not exposed by Azure API
        choices: chunk.choices.map((choice) => {
          var _a, _b, _c, _d, _e, _f, _g;
          return {
            delta: {
              content: (_a = choice.delta) == null ? void 0 : _a.content,
              function_call: (_b = choice.delta) == null ? void 0 : _b.functionCall,
              role: (_c = choice.delta) == null ? void 0 : _c.role,
              tool_calls: ((_e = (_d = choice.delta) == null ? void 0 : _d.toolCalls) == null ? void 0 : _e.length) ? (_g = (_f = choice.delta) == null ? void 0 : _f.toolCalls) == null ? void 0 : _g.map((toolCall, index) => ({
                index,
                id: toolCall.id,
                function: toolCall.function,
                type: toolCall.type
              })) : void 0
            },
            finish_reason: choice.finishReason,
            index: choice.index
          };
        })
      };
    }
    const text = extract(chunk);
    if (text)
      yield text;
  }
}
function chunkToText() {
  const trimStartOfStream = trimStartOfStreamHelper();
  let isFunctionStreamingIn;
  return (json) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    if (isChatCompletionChunk(json)) {
      const delta = (_a = json.choices[0]) == null ? void 0 : _a.delta;
      if ((_b = delta.function_call) == null ? void 0 : _b.name) {
        isFunctionStreamingIn = true;
        return {
          isText: false,
          content: `{"function_call": {"name": "${delta.function_call.name}", "arguments": "`
        };
      } else if ((_e = (_d = (_c = delta.tool_calls) == null ? void 0 : _c[0]) == null ? void 0 : _d.function) == null ? void 0 : _e.name) {
        isFunctionStreamingIn = true;
        const toolCall = delta.tool_calls[0];
        if (toolCall.index === 0) {
          return {
            isText: false,
            content: `{"tool_calls":[ {"id": "${toolCall.id}", "type": "function", "function": {"name": "${(_f = toolCall.function) == null ? void 0 : _f.name}", "arguments": "`
          };
        } else {
          return {
            isText: false,
            content: `"}}, {"id": "${toolCall.id}", "type": "function", "function": {"name": "${(_g = toolCall.function) == null ? void 0 : _g.name}", "arguments": "`
          };
        }
      } else if ((_h = delta.function_call) == null ? void 0 : _h.arguments) {
        return {
          isText: false,
          content: cleanupArguments((_i = delta.function_call) == null ? void 0 : _i.arguments)
        };
      } else if ((_l = (_k = (_j = delta.tool_calls) == null ? void 0 : _j[0]) == null ? void 0 : _k.function) == null ? void 0 : _l.arguments) {
        return {
          isText: false,
          content: cleanupArguments((_o = (_n = (_m = delta.tool_calls) == null ? void 0 : _m[0]) == null ? void 0 : _n.function) == null ? void 0 : _o.arguments)
        };
      } else if (isFunctionStreamingIn && (((_p = json.choices[0]) == null ? void 0 : _p.finish_reason) === "function_call" || ((_q = json.choices[0]) == null ? void 0 : _q.finish_reason) === "stop")) {
        isFunctionStreamingIn = false;
        return {
          isText: false,
          content: '"}}'
        };
      } else if (isFunctionStreamingIn && ((_r = json.choices[0]) == null ? void 0 : _r.finish_reason) === "tool_calls") {
        isFunctionStreamingIn = false;
        return {
          isText: false,
          content: '"}}]}'
        };
      }
    }
    const text = trimStartOfStream(
      isChatCompletionChunk(json) && json.choices[0].delta.content ? json.choices[0].delta.content : isCompletion(json) ? json.choices[0].text : ""
    );
    return text;
  };
  function cleanupArguments(argumentChunk) {
    let escapedPartialJson = argumentChunk.replace(/\\/g, "\\\\").replace(/\//g, "\\/").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f");
    return `${escapedPartialJson}`;
  }
}
var __internal__OpenAIFnMessagesSymbol = Symbol(
  "internal_openai_fn_messages"
);
function isChatCompletionChunk(data) {
  return "choices" in data && data.choices && data.choices[0] && "delta" in data.choices[0];
}
function isCompletion(data) {
  return "choices" in data && data.choices && data.choices[0] && "text" in data.choices[0];
}
function OpenAIStream(res, callbacks) {
  const cb = callbacks;
  let stream;
  if (Symbol.asyncIterator in res) {
    stream = readableFromAsyncIterable(streamable5(res)).pipeThrough(
      createCallbacksTransformer(
        (cb == null ? void 0 : cb.experimental_onFunctionCall) || (cb == null ? void 0 : cb.experimental_onToolCall) ? {
          ...cb,
          onFinal: void 0
        } : {
          ...cb
        }
      )
    );
  } else {
    stream = AIStream(
      res,
      parseOpenAIStream(),
      (cb == null ? void 0 : cb.experimental_onFunctionCall) || (cb == null ? void 0 : cb.experimental_onToolCall) ? {
        ...cb,
        onFinal: void 0
      } : {
        ...cb
      }
    );
  }
  if (cb && (cb.experimental_onFunctionCall || cb.experimental_onToolCall)) {
    const functionCallTransformer = createFunctionCallTransformer(cb);
    return stream.pipeThrough(functionCallTransformer);
  } else {
    return stream.pipeThrough(createStreamDataTransformer());
  }
}
function createFunctionCallTransformer(callbacks) {
  const textEncoder = new TextEncoder();
  let isFirstChunk = true;
  let aggregatedResponse = "";
  let aggregatedFinalCompletionResponse = "";
  let isFunctionStreamingIn = false;
  let functionCallMessages = callbacks[__internal__OpenAIFnMessagesSymbol] || [];
  const decode = createChunkDecoder();
  return new TransformStream({
    async transform(chunk, controller) {
      const message = decode(chunk);
      aggregatedFinalCompletionResponse += message;
      const shouldHandleAsFunction = isFirstChunk && (message.startsWith('{"function_call":') || message.startsWith('{"tool_calls":'));
      if (shouldHandleAsFunction) {
        isFunctionStreamingIn = true;
        aggregatedResponse += message;
        isFirstChunk = false;
        return;
      }
      if (!isFunctionStreamingIn) {
        controller.enqueue(
          textEncoder.encode(formatStreamPart("text", message))
        );
        return;
      } else {
        aggregatedResponse += message;
      }
    },
    async flush(controller) {
      try {
        if (!isFirstChunk && isFunctionStreamingIn && (callbacks.experimental_onFunctionCall || callbacks.experimental_onToolCall)) {
          isFunctionStreamingIn = false;
          const payload = JSON.parse(aggregatedResponse);
          let newFunctionCallMessages = [
            ...functionCallMessages
          ];
          let functionResponse = void 0;
          if (callbacks.experimental_onFunctionCall) {
            if (payload.function_call === void 0) {
              console.warn(
                "experimental_onFunctionCall should not be defined when using tools"
              );
            }
            const argumentsPayload = JSON.parse(
              payload.function_call.arguments
            );
            functionResponse = await callbacks.experimental_onFunctionCall(
              {
                name: payload.function_call.name,
                arguments: argumentsPayload
              },
              (result) => {
                newFunctionCallMessages = [
                  ...functionCallMessages,
                  {
                    role: "assistant",
                    content: "",
                    function_call: payload.function_call
                  },
                  {
                    role: "function",
                    name: payload.function_call.name,
                    content: JSON.stringify(result)
                  }
                ];
                return newFunctionCallMessages;
              }
            );
          }
          if (callbacks.experimental_onToolCall) {
            const toolCalls = {
              tools: []
            };
            for (const tool2 of payload.tool_calls) {
              toolCalls.tools.push({
                id: tool2.id,
                type: "function",
                func: {
                  name: tool2.function.name,
                  arguments: JSON.parse(tool2.function.arguments)
                }
              });
            }
            let responseIndex = 0;
            try {
              functionResponse = await callbacks.experimental_onToolCall(
                toolCalls,
                (result) => {
                  if (result) {
                    const { tool_call_id, function_name, tool_call_result } = result;
                    newFunctionCallMessages = [
                      ...newFunctionCallMessages,
                      // Only append the assistant message if it's the first response
                      ...responseIndex === 0 ? [
                        {
                          role: "assistant",
                          content: "",
                          tool_calls: payload.tool_calls.map(
                            (tc) => ({
                              id: tc.id,
                              type: "function",
                              function: {
                                name: tc.function.name,
                                // we send the arguments an object to the user, but as the API expects a string, we need to stringify it
                                arguments: JSON.stringify(
                                  tc.function.arguments
                                )
                              }
                            })
                          )
                        }
                      ] : [],
                      // Append the function call result message
                      {
                        role: "tool",
                        tool_call_id,
                        name: function_name,
                        content: JSON.stringify(tool_call_result)
                      }
                    ];
                    responseIndex++;
                  }
                  return newFunctionCallMessages;
                }
              );
            } catch (e) {
              console.error("Error calling experimental_onToolCall:", e);
            }
          }
          if (!functionResponse) {
            controller.enqueue(
              textEncoder.encode(
                formatStreamPart(
                  payload.function_call ? "function_call" : "tool_calls",
                  // parse to prevent double-encoding:
                  JSON.parse(aggregatedResponse)
                )
              )
            );
            return;
          } else if (typeof functionResponse === "string") {
            controller.enqueue(
              textEncoder.encode(formatStreamPart("text", functionResponse))
            );
            aggregatedFinalCompletionResponse = functionResponse;
            return;
          }
          const filteredCallbacks = {
            ...callbacks,
            onStart: void 0
          };
          callbacks.onFinal = void 0;
          const openAIStream = OpenAIStream(functionResponse, {
            ...filteredCallbacks,
            [__internal__OpenAIFnMessagesSymbol]: newFunctionCallMessages
          });
          const reader = openAIStream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            controller.enqueue(value);
          }
        }
      } finally {
        if (callbacks.onFinal && aggregatedFinalCompletionResponse) {
          await callbacks.onFinal(aggregatedFinalCompletionResponse);
        }
      }
    }
  });
}

// streams/replicate-stream.ts
async function ReplicateStream(res, cb, options) {
  var _a;
  const url = (_a = res.urls) == null ? void 0 : _a.stream;
  if (!url) {
    if (res.error)
      throw new Error(res.error);
    else
      throw new Error("Missing stream URL in Replicate response");
  }
  const eventStream = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      ...options == null ? void 0 : options.headers
    }
  });
  return AIStream(eventStream, void 0, cb).pipeThrough(
    createStreamDataTransformer()
  );
}

// shared/parse-complex-response.ts
function assignAnnotationsToMessage(message, annotations) {
  if (!message || !annotations || !annotations.length)
    return message;
  return { ...message, annotations: [...annotations] };
}
async function parseComplexResponse({
  reader,
  abortControllerRef,
  update,
  onFinish,
  generateId: generateId2 = generateId,
  getCurrentDate = () => /* @__PURE__ */ new Date()
}) {
  const createdAt = getCurrentDate();
  const prefixMap = {
    data: []
  };
  let message_annotations = void 0;
  for await (const { type, value } of readDataStream(reader, {
    isAborted: () => (abortControllerRef == null ? void 0 : abortControllerRef.current) === null
  })) {
    if (type === "text") {
      if (prefixMap["text"]) {
        prefixMap["text"] = {
          ...prefixMap["text"],
          content: (prefixMap["text"].content || "") + value
        };
      } else {
        prefixMap["text"] = {
          id: generateId2(),
          role: "assistant",
          content: value,
          createdAt
        };
      }
    }
    let functionCallMessage = null;
    if (type === "function_call") {
      prefixMap["function_call"] = {
        id: generateId2(),
        role: "assistant",
        content: "",
        function_call: value.function_call,
        name: value.function_call.name,
        createdAt
      };
      functionCallMessage = prefixMap["function_call"];
    }
    let toolCallMessage = null;
    if (type === "tool_calls") {
      prefixMap["tool_calls"] = {
        id: generateId2(),
        role: "assistant",
        content: "",
        tool_calls: value.tool_calls,
        createdAt
      };
      toolCallMessage = prefixMap["tool_calls"];
    }
    if (type === "data") {
      prefixMap["data"].push(...value);
    }
    let responseMessage = prefixMap["text"];
    if (type === "message_annotations") {
      if (!message_annotations) {
        message_annotations = [...value];
      } else {
        message_annotations.push(...value);
      }
      functionCallMessage = assignAnnotationsToMessage(
        prefixMap["function_call"],
        message_annotations
      );
      toolCallMessage = assignAnnotationsToMessage(
        prefixMap["tool_calls"],
        message_annotations
      );
      responseMessage = assignAnnotationsToMessage(
        prefixMap["text"],
        message_annotations
      );
    }
    if (message_annotations == null ? void 0 : message_annotations.length) {
      const messagePrefixKeys = [
        "text",
        "function_call",
        "tool_calls"
      ];
      messagePrefixKeys.forEach((key) => {
        if (prefixMap[key]) {
          prefixMap[key].annotations = [...message_annotations];
        }
      });
    }
    const merged = [functionCallMessage, toolCallMessage, responseMessage].filter(Boolean).map((message) => ({
      ...assignAnnotationsToMessage(message, message_annotations)
    }));
    update(merged, [...prefixMap["data"]]);
  }
  onFinish == null ? void 0 : onFinish(prefixMap);
  return {
    messages: [
      prefixMap.text,
      prefixMap.function_call,
      prefixMap.tool_calls
    ].filter(Boolean),
    data: prefixMap.data
  };
}

// streams/streaming-react-response.ts
var experimental_StreamingReactResponse = class {
  constructor(res, options) {
    var _a, _b;
    let resolveFunc = () => {
    };
    let next = new Promise((resolve) => {
      resolveFunc = resolve;
    });
    const processedStream = (options == null ? void 0 : options.data) != null ? res.pipeThrough((_a = options == null ? void 0 : options.data) == null ? void 0 : _a.stream) : res;
    let lastPayload = void 0;
    parseComplexResponse({
      reader: processedStream.getReader(),
      update: (merged, data) => {
        var _a2, _b2, _c;
        const content = (_b2 = (_a2 = merged[0]) == null ? void 0 : _a2.content) != null ? _b2 : "";
        const ui = ((_c = options == null ? void 0 : options.ui) == null ? void 0 : _c.call(options, { content, data })) || content;
        const payload = { ui, content };
        const resolvePrevious = resolveFunc;
        const nextRow = new Promise((resolve) => {
          resolveFunc = resolve;
        });
        resolvePrevious({
          next: nextRow,
          ...payload
        });
        lastPayload = payload;
      },
      generateId: (_b = options == null ? void 0 : options.generateId) != null ? _b : generateId,
      onFinish: () => {
        if (lastPayload !== void 0) {
          resolveFunc({
            next: null,
            ...lastPayload
          });
        }
      }
    });
    return next;
  }
};

// streams/streaming-text-response.ts
var StreamingTextResponse = class extends Response {
  constructor(res, init, data) {
    let processedStream = res;
    if (data) {
      processedStream = res.pipeThrough(data.stream);
    }
    super(processedStream, {
      ...init,
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...init == null ? void 0 : init.headers
      }
    });
  }
};
function streamToResponse(res, response, init) {
  response.writeHead((init == null ? void 0 : init.status) || 200, {
    "Content-Type": "text/plain; charset=utf-8",
    ...init == null ? void 0 : init.headers
  });
  const reader = res.getReader();
  function read() {
    reader.read().then(({ done, value }) => {
      if (done) {
        response.end();
        return;
      }
      response.write(value);
      read();
    });
  }
  read();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIStream,
  APICallError,
  AWSBedrockAnthropicMessagesStream,
  AWSBedrockAnthropicStream,
  AWSBedrockCohereStream,
  AWSBedrockLlama2Stream,
  AWSBedrockStream,
  AnthropicStream,
  AssistantResponse,
  CohereStream,
  EmptyResponseBodyError,
  GenerateObjectResult,
  GenerateTextResult,
  GoogleGenerativeAIStream,
  HuggingFaceStream,
  InkeepStream,
  InvalidArgumentError,
  InvalidDataContentError,
  InvalidPromptError,
  InvalidResponseDataError,
  InvalidToolArgumentsError,
  JSONParseError,
  LangChainStream,
  LoadAPIKeyError,
  MistralStream,
  NoObjectGeneratedError,
  NoSuchToolError,
  OpenAIStream,
  ReplicateStream,
  RetryError,
  StreamData,
  StreamObjectResult,
  StreamTextResult,
  StreamingTextResponse,
  ToolCallParseError,
  TypeValidationError,
  UnsupportedFunctionalityError,
  UnsupportedJSONSchemaError,
  convertDataContentToBase64String,
  convertDataContentToUint8Array,
  createCallbacksTransformer,
  createChunkDecoder,
  createEventStreamTransformer,
  createStreamDataTransformer,
  experimental_AssistantResponse,
  experimental_StreamData,
  experimental_StreamingReactResponse,
  experimental_generateObject,
  experimental_generateText,
  experimental_streamObject,
  experimental_streamText,
  formatStreamPart,
  generateId,
  generateObject,
  generateText,
  isStreamStringEqualToType,
  nanoid,
  parseStreamPart,
  readDataStream,
  readableFromAsyncIterable,
  streamObject,
  streamText,
  streamToResponse,
  tool,
  trimStartOfStreamHelper
});
//# sourceMappingURL=index.js.map