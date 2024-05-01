// rsc/ai-state.tsx
import { AsyncLocalStorage } from "async_hooks";
import * as jsondiffpatch from "jsondiffpatch";

// rsc/utils.tsx
import { Suspense } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function createResolvablePromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
}
var R = [
  async ({
    c,
    // current
    n
    // next
  }) => {
    const chunk = await n;
    if (chunk.done) {
      return chunk.value;
    }
    if (chunk.append) {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        c,
        /* @__PURE__ */ jsx(Suspense, { fallback: chunk.value, children: /* @__PURE__ */ jsx(R, { c: chunk.value, n: chunk.next }) })
      ] });
    }
    return /* @__PURE__ */ jsx(Suspense, { fallback: chunk.value, children: /* @__PURE__ */ jsx(R, { c: chunk.value, n: chunk.next }) });
  }
][0];
function createSuspensedChunk(initialValue) {
  const { promise, resolve, reject } = createResolvablePromise();
  return {
    row: /* @__PURE__ */ jsx(Suspense, { fallback: initialValue, children: /* @__PURE__ */ jsx(R, { c: initialValue, n: promise }) }),
    resolve,
    reject
  };
}
var isFunction = (x) => typeof x === "function";
var consumeStream = async (stream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done)
      break;
  }
};

// rsc/ai-state.tsx
var asyncAIStateStorage = new AsyncLocalStorage();
function getAIStateStoreOrThrow(message) {
  const store = asyncAIStateStorage.getStore();
  if (!store) {
    throw new Error(message);
  }
  return store;
}
function withAIState({ state, options }, fn) {
  return asyncAIStateStorage.run(
    {
      currentState: state,
      originalState: state,
      sealed: false,
      options
    },
    fn
  );
}
function getAIStateDeltaPromise() {
  const store = getAIStateStoreOrThrow("Internal error occurred.");
  return store.mutationDeltaPromise;
}
function sealMutableAIState() {
  const store = getAIStateStoreOrThrow("Internal error occurred.");
  store.sealed = true;
}
function getAIState(...args) {
  const store = getAIStateStoreOrThrow(
    "`getAIState` must be called within an AI Action."
  );
  if (args.length > 0) {
    const key = args[0];
    if (typeof store.currentState !== "object") {
      throw new Error(
        `You can't get the "${String(
          key
        )}" field from the AI state because it's not an object.`
      );
    }
    return store.currentState[key];
  }
  return store.currentState;
}
function getMutableAIState(...args) {
  const store = getAIStateStoreOrThrow(
    "`getMutableAIState` must be called within an AI Action."
  );
  if (store.sealed) {
    throw new Error(
      "`getMutableAIState` must be called before returning from an AI Action. Please move it to the top level of the Action's function body."
    );
  }
  if (!store.mutationDeltaPromise) {
    const { promise, resolve } = createResolvablePromise();
    store.mutationDeltaPromise = promise;
    store.mutationDeltaResolve = resolve;
  }
  function doUpdate(newState, done) {
    var _a, _b;
    if (args.length > 0) {
      if (typeof store.currentState !== "object") {
        const key = args[0];
        throw new Error(
          `You can't modify the "${String(
            key
          )}" field of the AI state because it's not an object.`
        );
      }
    }
    if (isFunction(newState)) {
      if (args.length > 0) {
        store.currentState[args[0]] = newState(store.currentState[args[0]]);
      } else {
        store.currentState = newState(store.currentState);
      }
    } else {
      if (args.length > 0) {
        store.currentState[args[0]] = newState;
      } else {
        store.currentState = newState;
      }
    }
    (_b = (_a = store.options).onSetAIState) == null ? void 0 : _b.call(_a, {
      key: args.length > 0 ? args[0] : void 0,
      state: store.currentState,
      done
    });
  }
  const mutableState = {
    get: () => {
      if (args.length > 0) {
        const key = args[0];
        if (typeof store.currentState !== "object") {
          throw new Error(
            `You can't get the "${String(
              key
            )}" field from the AI state because it's not an object.`
          );
        }
        return store.currentState[key];
      }
      return store.currentState;
    },
    update: function update(newAIState) {
      doUpdate(newAIState, false);
    },
    done: function done(...doneArgs) {
      if (doneArgs.length > 0) {
        doUpdate(doneArgs[0], true);
      }
      const delta = jsondiffpatch.diff(store.originalState, store.currentState);
      store.mutationDeltaResolve(delta);
    }
  };
  return mutableState;
}

// rsc/streamable.tsx
import zodToJsonSchema2 from "zod-to-json-schema";

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
import { InvalidDataContentError } from "@ai-sdk/provider";
import {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64
} from "@ai-sdk/provider-utils";
function convertDataContentToUint8Array(content) {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (typeof content === "string") {
    return convertBase64ToUint8Array(content);
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  throw new InvalidDataContentError({ content });
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
import { InvalidPromptError } from "@ai-sdk/provider";
function getValidatedPrompt(prompt) {
  if (prompt.prompt == null && prompt.messages == null) {
    throw new InvalidPromptError({
      prompt,
      message: "prompt or messages must be defined"
    });
  }
  if (prompt.prompt != null && prompt.messages != null) {
    throw new InvalidPromptError({
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
import { InvalidArgumentError } from "@ai-sdk/provider";
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
      throw new InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be an integer"
      });
    }
    if (maxTokens < 1) {
      throw new InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be >= 1"
      });
    }
  }
  if (temperature != null) {
    if (typeof temperature !== "number") {
      throw new InvalidArgumentError({
        parameter: "temperature",
        value: temperature,
        message: "temperature must be a number"
      });
    }
  }
  if (topP != null) {
    if (typeof topP !== "number") {
      throw new InvalidArgumentError({
        parameter: "topP",
        value: topP,
        message: "topP must be a number"
      });
    }
  }
  if (presencePenalty != null) {
    if (typeof presencePenalty !== "number") {
      throw new InvalidArgumentError({
        parameter: "presencePenalty",
        value: presencePenalty,
        message: "presencePenalty must be a number"
      });
    }
  }
  if (frequencyPenalty != null) {
    if (typeof frequencyPenalty !== "number") {
      throw new InvalidArgumentError({
        parameter: "frequencyPenalty",
        value: frequencyPenalty,
        message: "frequencyPenalty must be a number"
      });
    }
  }
  if (seed != null) {
    if (!Number.isInteger(seed)) {
      throw new InvalidArgumentError({
        parameter: "seed",
        value: seed,
        message: "seed must be an integer"
      });
    }
  }
  if (maxRetries != null) {
    if (!Number.isInteger(maxRetries)) {
      throw new InvalidArgumentError({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be an integer"
      });
    }
    if (maxRetries < 0) {
      throw new InvalidArgumentError({
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
import zodToJsonSchema from "zod-to-json-schema";
function convertZodToJSONSchema(zodSchema) {
  return zodToJsonSchema(zodSchema);
}

// core/util/retry-with-exponential-backoff.ts
import { APICallError, RetryError } from "@ai-sdk/provider";
import { getErrorMessage, isAbortError } from "@ai-sdk/provider-utils";

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
    if (isAbortError(error)) {
      throw error;
    }
    if (maxRetries === 0) {
      throw error;
    }
    const errorMessage = getErrorMessage(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber > maxRetries) {
      throw new RetryError({
        message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
        reason: "maxRetriesExceeded",
        errors: newErrors
      });
    }
    if (error instanceof Error && APICallError.isAPICallError(error) && error.isRetryable === true && tryNumber <= maxRetries) {
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
    throw new RetryError({
      message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}

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

// streams/ai-stream.ts
import {
  createParser
} from "eventsource-parser";
function createEventStreamTransformer(customParser) {
  const textDecoder = new TextDecoder();
  let eventSourceParser;
  return new TransformStream({
    async start(controller) {
      eventSourceParser = createParser(
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

// streams/openai-stream.ts
function parseOpenAIStream() {
  const extract = chunkToText();
  return (data) => extract(JSON.parse(data));
}
async function* streamable(stream) {
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
    stream = readableFromAsyncIterable(streamable(res)).pipeThrough(
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
            for (const tool of payload.tool_calls) {
              toolCalls.tools.push({
                id: tool.id,
                type: "function",
                func: {
                  name: tool.function.name,
                  arguments: JSON.parse(tool.function.arguments)
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

// rsc/constants.ts
var STREAMABLE_VALUE_TYPE = Symbol.for("ui.streamable.value");
var DEV_DEFAULT_STREAMABLE_WARNING_TIME = 15 * 1e3;

// rsc/streamable.tsx
function createStreamableUI(initialValue) {
  let currentValue = initialValue;
  let closed = false;
  let { row, resolve, reject } = createSuspensedChunk(initialValue);
  function assertStream(method) {
    if (closed) {
      throw new Error(method + ": UI stream is already closed.");
    }
  }
  let warningTimeout;
  function warnUnclosedStream() {
    if (process.env.NODE_ENV === "development") {
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      warningTimeout = setTimeout(() => {
        console.warn(
          "The streamable UI has been slow to update. This may be a bug or a performance issue or you forgot to call `.done()`."
        );
      }, DEV_DEFAULT_STREAMABLE_WARNING_TIME);
    }
  }
  warnUnclosedStream();
  return {
    /**
     * The value of the streamable UI. This can be returned from a Server Action and received by the client.
     */
    value: row,
    /**
     * This method updates the current UI node. It takes a new UI node and replaces the old one.
     */
    update(value) {
      assertStream(".update()");
      if (value === currentValue) {
        warnUnclosedStream();
        return;
      }
      const resolvable = createResolvablePromise();
      currentValue = value;
      resolve({ value: currentValue, done: false, next: resolvable.promise });
      resolve = resolvable.resolve;
      reject = resolvable.reject;
      warnUnclosedStream();
    },
    /**
     * This method is used to append a new UI node to the end of the old one.
     * Once appended a new UI node, the previous UI node cannot be updated anymore.
     *
     * @example
     * ```jsx
     * const ui = createStreamableUI(<div>hello</div>)
     * ui.append(<div>world</div>)
     *
     * // The UI node will be:
     * // <>
     * //   <div>hello</div>
     * //   <div>world</div>
     * // </>
     * ```
     */
    append(value) {
      assertStream(".append()");
      const resolvable = createResolvablePromise();
      currentValue = value;
      resolve({ value, done: false, append: true, next: resolvable.promise });
      resolve = resolvable.resolve;
      reject = resolvable.reject;
      warnUnclosedStream();
    },
    /**
     * This method is used to signal that there is an error in the UI stream.
     * It will be thrown on the client side and caught by the nearest error boundary component.
     */
    error(error) {
      assertStream(".error()");
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      closed = true;
      reject(error);
    },
    /**
     * This method marks the UI node as finalized. You can either call it without any parameters or with a new UI node as the final state.
     * Once called, the UI node cannot be updated or appended anymore.
     *
     * This method is always **required** to be called, otherwise the response will be stuck in a loading state.
     */
    done(...args) {
      assertStream(".done()");
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      closed = true;
      if (args.length) {
        resolve({ value: args[0], done: true });
        return;
      }
      resolve({ value: currentValue, done: true });
    }
  };
}
var STREAMABLE_VALUE_INTERNAL_LOCK = Symbol("streamable.value.lock");
function createStreamableValue(initialValue) {
  const isReadableStream = initialValue instanceof ReadableStream || typeof initialValue === "object" && initialValue !== null && "getReader" in initialValue && typeof initialValue.getReader === "function" && "locked" in initialValue && typeof initialValue.locked === "boolean";
  if (!isReadableStream) {
    return createStreamableValueImpl(initialValue);
  }
  const streamableValue = createStreamableValueImpl();
  streamableValue[STREAMABLE_VALUE_INTERNAL_LOCK] = true;
  (async () => {
    try {
      const reader = initialValue.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        streamableValue[STREAMABLE_VALUE_INTERNAL_LOCK] = false;
        if (typeof value === "string") {
          streamableValue.append(value);
        } else {
          streamableValue.update(value);
        }
        streamableValue[STREAMABLE_VALUE_INTERNAL_LOCK] = true;
      }
      streamableValue[STREAMABLE_VALUE_INTERNAL_LOCK] = false;
      streamableValue.done();
    } catch (e) {
      streamableValue[STREAMABLE_VALUE_INTERNAL_LOCK] = false;
      streamableValue.error(e);
    }
  })();
  return streamableValue;
}
function createStreamableValueImpl(initialValue) {
  let closed = false;
  let locked = false;
  let resolvable = createResolvablePromise();
  let currentValue = initialValue;
  let currentError;
  let currentPromise = resolvable.promise;
  let currentPatchValue;
  function assertStream(method) {
    if (closed) {
      throw new Error(method + ": Value stream is already closed.");
    }
    if (locked) {
      throw new Error(
        method + ": Value stream is locked and cannot be updated."
      );
    }
  }
  let warningTimeout;
  function warnUnclosedStream() {
    if (process.env.NODE_ENV === "development") {
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      warningTimeout = setTimeout(() => {
        console.warn(
          "The streamable UI has been slow to update. This may be a bug or a performance issue or you forgot to call `.done()`."
        );
      }, DEV_DEFAULT_STREAMABLE_WARNING_TIME);
    }
  }
  warnUnclosedStream();
  function createWrapped(initialChunk) {
    let init;
    if (currentError !== void 0) {
      init = { error: currentError };
    } else {
      if (currentPatchValue && !initialChunk) {
        init = { diff: currentPatchValue };
      } else {
        init = { curr: currentValue };
      }
    }
    if (currentPromise) {
      init.next = currentPromise;
    }
    if (initialChunk) {
      init.type = STREAMABLE_VALUE_TYPE;
    }
    return init;
  }
  function updateValueStates(value) {
    currentPatchValue = void 0;
    if (typeof value === "string") {
      if (typeof currentValue === "string") {
        if (value.startsWith(currentValue)) {
          currentPatchValue = [0, value.slice(currentValue.length)];
        }
      }
    }
    currentValue = value;
  }
  return {
    /**
     * @internal This is an internal lock to prevent the value from being
     * updated by the user.
     */
    set [STREAMABLE_VALUE_INTERNAL_LOCK](state) {
      locked = state;
    },
    /**
     * The value of the streamable. This can be returned from a Server Action and
     * received by the client. To read the streamed values, use the
     * `readStreamableValue` or `useStreamableValue` APIs.
     */
    get value() {
      return createWrapped(true);
    },
    /**
     * This method updates the current value with a new one.
     */
    update(value) {
      assertStream(".update()");
      const resolvePrevious = resolvable.resolve;
      resolvable = createResolvablePromise();
      updateValueStates(value);
      currentPromise = resolvable.promise;
      resolvePrevious(createWrapped());
      warnUnclosedStream();
    },
    /**
     * This method is used to append a delta string to the current value. It
     * requires the current value of the streamable to be a string.
     *
     * @example
     * ```jsx
     * const streamable = createStreamableValue('hello');
     * streamable.append(' world');
     *
     * // The value will be 'hello world'
     * ```
     */
    append(value) {
      assertStream(".append()");
      if (typeof currentValue !== "string" && typeof currentValue !== "undefined") {
        throw new Error(
          `.append(): The current value is not a string. Received: ${typeof currentValue}`
        );
      }
      if (typeof value !== "string") {
        throw new Error(
          `.append(): The value is not a string. Received: ${typeof value}`
        );
      }
      const resolvePrevious = resolvable.resolve;
      resolvable = createResolvablePromise();
      if (typeof currentValue === "string") {
        currentPatchValue = [0, value];
        currentValue = currentValue + value;
      } else {
        currentPatchValue = void 0;
        currentValue = value;
      }
      currentPromise = resolvable.promise;
      resolvePrevious(createWrapped());
      warnUnclosedStream();
    },
    /**
     * This method is used to signal that there is an error in the value stream.
     * It will be thrown on the client side when consumed via
     * `readStreamableValue` or `useStreamableValue`.
     */
    error(error) {
      assertStream(".error()");
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      closed = true;
      currentError = error;
      currentPromise = void 0;
      resolvable.resolve({ error });
    },
    /**
     * This method marks the value as finalized. You can either call it without
     * any parameters or with a new value as the final state.
     * Once called, the value cannot be updated or appended anymore.
     *
     * This method is always **required** to be called, otherwise the response
     * will be stuck in a loading state.
     */
    done(...args) {
      assertStream(".done()");
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      closed = true;
      currentPromise = void 0;
      if (args.length) {
        updateValueStates(args[0]);
        resolvable.resolve(createWrapped());
        return;
      }
      resolvable.resolve({});
    }
  };
}
function render(options) {
  const ui = createStreamableUI(options.initial);
  const text = options.text ? options.text : ({ content }) => content;
  const functions = options.functions ? Object.entries(options.functions).map(
    ([name, { description, parameters }]) => {
      return {
        name,
        description,
        parameters: zodToJsonSchema2(parameters)
      };
    }
  ) : void 0;
  const tools = options.tools ? Object.entries(options.tools).map(
    ([name, { description, parameters }]) => {
      return {
        type: "function",
        function: {
          name,
          description,
          parameters: zodToJsonSchema2(parameters)
        }
      };
    }
  ) : void 0;
  if (functions && tools) {
    throw new Error(
      "You can't have both functions and tools defined. Please choose one or the other."
    );
  }
  let finished;
  async function handleRender(args, renderer, res) {
    if (!renderer)
      return;
    const resolvable = createResolvablePromise();
    if (finished) {
      finished = finished.then(() => resolvable.promise);
    } else {
      finished = resolvable.promise;
    }
    const value = renderer(args);
    if (value instanceof Promise || value && typeof value === "object" && "then" in value && typeof value.then === "function") {
      const node = await value;
      res.update(node);
      resolvable.resolve(void 0);
    } else if (value && typeof value === "object" && Symbol.asyncIterator in value) {
      const it = value;
      while (true) {
        const { done, value: value2 } = await it.next();
        res.update(value2);
        if (done)
          break;
      }
      resolvable.resolve(void 0);
    } else if (value && typeof value === "object" && Symbol.iterator in value) {
      const it = value;
      while (true) {
        const { done, value: value2 } = it.next();
        res.update(value2);
        if (done)
          break;
      }
      resolvable.resolve(void 0);
    } else {
      res.update(value);
      resolvable.resolve(void 0);
    }
  }
  (async () => {
    let hasFunction = false;
    let content = "";
    consumeStream(
      OpenAIStream(
        await options.provider.chat.completions.create({
          model: options.model,
          messages: options.messages,
          temperature: options.temperature,
          stream: true,
          ...functions ? {
            functions
          } : {},
          ...tools ? {
            tools
          } : {}
        }),
        {
          ...functions ? {
            async experimental_onFunctionCall(functionCallPayload) {
              var _a, _b;
              hasFunction = true;
              handleRender(
                functionCallPayload.arguments,
                (_b = (_a = options.functions) == null ? void 0 : _a[functionCallPayload.name]) == null ? void 0 : _b.render,
                ui
              );
            }
          } : {},
          ...tools ? {
            async experimental_onToolCall(toolCallPayload) {
              var _a, _b;
              hasFunction = true;
              for (const tool of toolCallPayload.tools) {
                handleRender(
                  tool.func.arguments,
                  (_b = (_a = options.tools) == null ? void 0 : _a[tool.func.name]) == null ? void 0 : _b.render,
                  ui
                );
              }
            }
          } : {},
          onText(chunk) {
            content += chunk;
            handleRender({ content, done: false, delta: chunk }, text, ui);
          },
          async onFinal() {
            if (hasFunction) {
              await finished;
              ui.done();
              return;
            }
            handleRender({ content, done: true }, text, ui);
            await finished;
            ui.done();
          }
        }
      )
    );
  })();
  return ui.value;
}

// rsc/stream-ui/stream-ui.tsx
import {
  InvalidToolArgumentsError,
  NoSuchToolError
} from "@ai-sdk/provider";
import { safeParseJSON } from "@ai-sdk/provider-utils";
var defaultTextRenderer = ({ content }) => content;
async function experimental_streamUI({
  model,
  tools,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  initial,
  text,
  ...settings
}) {
  if (typeof model === "string") {
    throw new Error(
      "`model` cannot be a string in `experimental_streamUI`. Use the actual model instance instead."
    );
  }
  if ("functions" in settings) {
    throw new Error(
      "`functions` is not supported in `experimental_streamUI`, use `tools` instead."
    );
  }
  if ("provider" in settings) {
    throw new Error(
      "`provider` is no longer needed in `experimental_streamUI`. Use `model` instead."
    );
  }
  if (tools) {
    for (const [name, tool] of Object.entries(tools)) {
      if ("render" in tool) {
        throw new Error(
          "Tool definition in `experimental_streamUI` should not have `render` property. Use `generate` instead. Found in tool: " + name
        );
      }
    }
  }
  const ui = createStreamableUI(initial);
  const textRender = text || defaultTextRenderer;
  let finished;
  async function handleRender(args, renderer, res) {
    if (!renderer)
      return;
    const resolvable = createResolvablePromise();
    if (finished) {
      finished = finished.then(() => resolvable.promise);
    } else {
      finished = resolvable.promise;
    }
    const value = renderer(...args);
    if (value instanceof Promise || value && typeof value === "object" && "then" in value && typeof value.then === "function") {
      const node = await value;
      res.update(node);
      resolvable.resolve(void 0);
    } else if (value && typeof value === "object" && Symbol.asyncIterator in value) {
      const it = value;
      while (true) {
        const { done, value: value2 } = await it.next();
        res.update(value2);
        if (done)
          break;
      }
      resolvable.resolve(void 0);
    } else if (value && typeof value === "object" && Symbol.iterator in value) {
      const it = value;
      while (true) {
        const { done, value: value2 } = it.next();
        res.update(value2);
        if (done)
          break;
      }
      resolvable.resolve(void 0);
    } else {
      res.update(value);
      resolvable.resolve(void 0);
    }
  }
  const retry = retryWithExponentialBackoff({ maxRetries });
  const validatedPrompt = getValidatedPrompt({ system, prompt, messages });
  const result = await retry(
    () => model.doStream({
      mode: {
        type: "regular",
        tools: tools == null ? void 0 : Object.entries(tools).map(([name, tool]) => ({
          type: "function",
          name,
          description: tool.description,
          parameters: convertZodToJSONSchema(tool.parameters)
        }))
      },
      ...prepareCallSettings(settings),
      inputFormat: validatedPrompt.type,
      prompt: convertToLanguageModelPrompt(validatedPrompt),
      abortSignal
    })
  );
  const [stream, forkedStream] = result.stream.tee();
  (async () => {
    try {
      let content = "";
      let hasToolCall = false;
      const reader = forkedStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        switch (value.type) {
          case "text-delta": {
            content += value.textDelta;
            handleRender(
              [{ content, done: false, delta: value.textDelta }],
              textRender,
              ui
            );
            break;
          }
          case "tool-call-delta": {
            hasToolCall = true;
            break;
          }
          case "tool-call": {
            const toolName = value.toolName;
            if (!tools) {
              throw new NoSuchToolError({ toolName });
            }
            const tool = tools[toolName];
            if (!tool) {
              throw new NoSuchToolError({
                toolName,
                availableTools: Object.keys(tools)
              });
            }
            const parseResult = safeParseJSON({
              text: value.args,
              schema: tool.parameters
            });
            if (parseResult.success === false) {
              throw new InvalidToolArgumentsError({
                toolName,
                toolArgs: value.args,
                cause: parseResult.error
              });
            }
            handleRender(
              [
                parseResult.value,
                {
                  toolName,
                  toolCallId: value.toolCallId
                }
              ],
              tool.generate,
              ui
            );
            break;
          }
          case "error": {
            throw value.error;
          }
          case "finish": {
          }
        }
      }
      if (hasToolCall) {
        await finished;
        ui.done();
      } else {
        handleRender([{ content, done: true }], textRender, ui);
        await finished;
        ui.done();
      }
    } catch (error) {
      ui.error(error);
    }
  })();
  return {
    ...result,
    stream,
    value: ui.value
  };
}

// rsc/provider.tsx
import * as React2 from "react";
import { InternalAIProvider } from "./rsc-shared.mjs";
import { jsx as jsx2 } from "react/jsx-runtime";
async function innerAction({
  action,
  options
}, state, ...args) {
  "use server";
  return await withAIState(
    {
      state,
      options
    },
    async () => {
      const result = await action(...args);
      sealMutableAIState();
      return [getAIStateDeltaPromise(), result];
    }
  );
}
function wrapAction(action, options) {
  return innerAction.bind(null, { action, options });
}
function createAI({
  actions,
  initialAIState,
  initialUIState,
  onSetAIState,
  onGetUIState
}) {
  const wrappedActions = {};
  for (const name in actions) {
    wrappedActions[name] = wrapAction(actions[name], {
      onSetAIState
    });
  }
  const wrappedSyncUIState = onGetUIState ? wrapAction(onGetUIState, {}) : void 0;
  const AI = async (props) => {
    var _a, _b;
    if ("useState" in React2) {
      throw new Error(
        "This component can only be used inside Server Components."
      );
    }
    let uiState = (_a = props.initialUIState) != null ? _a : initialUIState;
    let aiState = (_b = props.initialAIState) != null ? _b : initialAIState;
    let aiStateDelta = void 0;
    if (wrappedSyncUIState) {
      const [newAIStateDelta, newUIState] = await wrappedSyncUIState(aiState);
      if (newUIState !== void 0) {
        aiStateDelta = newAIStateDelta;
        uiState = newUIState;
      }
    }
    return /* @__PURE__ */ jsx2(
      InternalAIProvider,
      {
        wrappedActions,
        wrappedSyncUIState,
        initialUIState: uiState,
        initialAIState: aiState,
        initialAIStatePatch: aiStateDelta,
        children: props.children
      }
    );
  };
  return AI;
}
export {
  createAI,
  createStreamableUI,
  createStreamableValue,
  experimental_streamUI,
  getAIState,
  getMutableAIState,
  render
};
//# sourceMappingURL=rsc-server.mjs.map