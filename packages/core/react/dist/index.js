'use client'
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

// react/index.ts
var react_exports = {};
__export(react_exports, {
  experimental_useAssistant: () => experimental_useAssistant,
  useAssistant: () => useAssistant,
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(react_exports);

// react/use-chat.ts
var import_react = require("react");
var import_swr = __toESM(require("swr"));

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

// shared/generate-id.ts
var import_non_secure = require("nanoid/non-secure");
var generateId = (0, import_non_secure.customAlphabet)(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

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

// shared/call-chat-api.ts
async function callChatApi({
  api,
  messages,
  body,
  streamMode = "stream-data",
  credentials,
  headers,
  abortController,
  restoreMessagesOnFailure,
  onResponse,
  onUpdate,
  onFinish,
  generateId: generateId2
}) {
  var _a;
  if (body.data instanceof FormData) {
    body.data.append("messages", JSON.stringify(messages));
  }
  const contentType = body.data instanceof FormData ? void 0 : "application/json";
  const response = await fetch(api, {
    method: "POST",
    body: body.data instanceof FormData ? body.data : JSON.stringify({
      messages,
      ...body
    }),
    headers: {
      ...contentType && { "Content-Type": contentType },
      ...headers
    },
    signal: (_a = abortController == null ? void 0 : abortController()) == null ? void 0 : _a.signal,
    credentials
  }).catch((err) => {
    restoreMessagesOnFailure();
    throw err;
  });
  if (onResponse) {
    try {
      await onResponse(response);
    } catch (err) {
      throw err;
    }
  }
  if (!response.ok) {
    restoreMessagesOnFailure();
    throw new Error(
      await response.text() || "Failed to fetch the chat response."
    );
  }
  if (!response.body) {
    throw new Error("The response body is empty.");
  }
  const reader = response.body.getReader();
  switch (streamMode) {
    case "text": {
      const decoder = createChunkDecoder();
      const resultMessage = {
        id: generateId2(),
        createdAt: /* @__PURE__ */ new Date(),
        role: "assistant",
        content: ""
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        resultMessage.content += decoder(value);
        resultMessage.id = generateId2();
        onUpdate([{ ...resultMessage }], []);
        if ((abortController == null ? void 0 : abortController()) === null) {
          reader.cancel();
          break;
        }
      }
      onFinish == null ? void 0 : onFinish(resultMessage);
      return {
        messages: [resultMessage],
        data: []
      };
    }
    case "stream-data": {
      return await parseComplexResponse({
        reader,
        abortControllerRef: abortController != null ? { current: abortController() } : void 0,
        update: onUpdate,
        onFinish(prefixMap) {
          if (onFinish && prefixMap.text != null) {
            onFinish(prefixMap.text);
          }
        },
        generateId: generateId2
      });
    }
    default: {
      const exhaustiveCheck = streamMode;
      throw new Error(`Unknown stream mode: ${exhaustiveCheck}`);
    }
  }
}

// shared/process-chat-stream.ts
async function processChatStream({
  getStreamedResponse: getStreamedResponse2,
  experimental_onFunctionCall,
  experimental_onToolCall,
  updateChatRequest,
  getCurrentMessages
}) {
  while (true) {
    const messagesAndDataOrJustMessage = await getStreamedResponse2();
    if ("messages" in messagesAndDataOrJustMessage) {
      let hasFollowingResponse = false;
      for (const message of messagesAndDataOrJustMessage.messages) {
        if ((message.function_call === void 0 || typeof message.function_call === "string") && (message.tool_calls === void 0 || typeof message.tool_calls === "string")) {
          continue;
        }
        hasFollowingResponse = true;
        if (experimental_onFunctionCall) {
          const functionCall = message.function_call;
          if (typeof functionCall !== "object") {
            console.warn(
              "experimental_onFunctionCall should not be defined when using tools"
            );
            continue;
          }
          const functionCallResponse = await experimental_onFunctionCall(
            getCurrentMessages(),
            functionCall
          );
          if (functionCallResponse === void 0) {
            hasFollowingResponse = false;
            break;
          }
          updateChatRequest(functionCallResponse);
        }
        if (experimental_onToolCall) {
          const toolCalls = message.tool_calls;
          if (!Array.isArray(toolCalls) || toolCalls.some((toolCall) => typeof toolCall !== "object")) {
            console.warn(
              "experimental_onToolCall should not be defined when using tools"
            );
            continue;
          }
          const toolCallResponse = await experimental_onToolCall(getCurrentMessages(), toolCalls);
          if (toolCallResponse === void 0) {
            hasFollowingResponse = false;
            break;
          }
          updateChatRequest(toolCallResponse);
        }
      }
      if (!hasFollowingResponse) {
        break;
      }
    } else {
      let fixFunctionCallArguments2 = function(response) {
        for (const message of response.messages) {
          if (message.tool_calls !== void 0) {
            for (const toolCall of message.tool_calls) {
              if (typeof toolCall === "object") {
                if (toolCall.function.arguments && typeof toolCall.function.arguments !== "string") {
                  toolCall.function.arguments = JSON.stringify(
                    toolCall.function.arguments
                  );
                }
              }
            }
          }
          if (message.function_call !== void 0) {
            if (typeof message.function_call === "object") {
              if (message.function_call.arguments && typeof message.function_call.arguments !== "string") {
                message.function_call.arguments = JSON.stringify(
                  message.function_call.arguments
                );
              }
            }
          }
        }
      };
      var fixFunctionCallArguments = fixFunctionCallArguments2;
      const streamedResponseMessage = messagesAndDataOrJustMessage;
      if ((streamedResponseMessage.function_call === void 0 || typeof streamedResponseMessage.function_call === "string") && (streamedResponseMessage.tool_calls === void 0 || typeof streamedResponseMessage.tool_calls === "string")) {
        break;
      }
      if (experimental_onFunctionCall) {
        const functionCall = streamedResponseMessage.function_call;
        if (!(typeof functionCall === "object")) {
          console.warn(
            "experimental_onFunctionCall should not be defined when using tools"
          );
          continue;
        }
        const functionCallResponse = await experimental_onFunctionCall(getCurrentMessages(), functionCall);
        if (functionCallResponse === void 0)
          break;
        fixFunctionCallArguments2(functionCallResponse);
        updateChatRequest(functionCallResponse);
      }
      if (experimental_onToolCall) {
        const toolCalls = streamedResponseMessage.tool_calls;
        if (!(typeof toolCalls === "object")) {
          console.warn(
            "experimental_onToolCall should not be defined when using functions"
          );
          continue;
        }
        const toolCallResponse = await experimental_onToolCall(getCurrentMessages(), toolCalls);
        if (toolCallResponse === void 0)
          break;
        fixFunctionCallArguments2(toolCallResponse);
        updateChatRequest(toolCallResponse);
      }
    }
  }
}

// react/use-chat.ts
var getStreamedResponse = async (api, chatRequest, mutate, mutateStreamData, existingData, extraMetadataRef, messagesRef, abortControllerRef, generateId2, streamMode, onFinish, onResponse, sendExtraMessageFields) => {
  var _a, _b, _c;
  const previousMessages = messagesRef.current;
  mutate(chatRequest.messages, false);
  const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
    ({ role, content, name, function_call, tool_calls, tool_call_id }) => ({
      role,
      content,
      tool_call_id,
      ...name !== void 0 && { name },
      ...function_call !== void 0 && {
        function_call
      },
      ...tool_calls !== void 0 && {
        tool_calls
      }
    })
  );
  if (typeof api !== "string") {
    const replyId = generateId2();
    const createdAt = /* @__PURE__ */ new Date();
    let responseMessage = {
      id: replyId,
      createdAt,
      content: "",
      role: "assistant"
    };
    async function readRow(promise) {
      const { content, ui, next } = await promise;
      responseMessage["content"] = content;
      responseMessage["ui"] = await ui;
      mutate([...chatRequest.messages, { ...responseMessage }], false);
      if (next) {
        await readRow(next);
      }
    }
    try {
      const promise = api({
        messages: constructedMessagesPayload,
        data: chatRequest.data
      });
      await readRow(promise);
    } catch (e) {
      mutate(previousMessages, false);
      throw e;
    }
    if (onFinish) {
      onFinish(responseMessage);
    }
    return responseMessage;
  }
  const formData = new FormData();
  let isFormData = false;
  Object.entries({
    data: chatRequest.data,
    ...extraMetadataRef.current.body instanceof FormData ? { formData: extraMetadataRef.current.body } : extraMetadataRef.current.body,
    ...(_a = chatRequest.options) == null ? void 0 : _a.body,
    ...chatRequest.functions !== void 0 && {
      functions: chatRequest.functions
    },
    ...chatRequest.function_call !== void 0 && {
      function_call: chatRequest.function_call
    },
    ...chatRequest.tools !== void 0 && { tools: chatRequest.tools },
    ...chatRequest.tool_choice !== void 0 && {
      tool_choice: chatRequest.tool_choice
    }
  }).forEach(([key, value]) => {
    if (value instanceof FormData) {
      isFormData = true;
      value.forEach((entry, entryKey) => {
        formData.append(entryKey, entry);
      });
    } else {
      formData.append(key, JSON.stringify(value));
    }
  });
  return await callChatApi({
    api,
    messages: constructedMessagesPayload,
    body: isFormData ? { data: formData } : {
      data: chatRequest.data,
      ...extraMetadataRef.current.body,
      ...(_b = chatRequest.options) == null ? void 0 : _b.body,
      ...chatRequest.functions !== void 0 && {
        functions: chatRequest.functions
      },
      ...chatRequest.function_call !== void 0 && {
        function_call: chatRequest.function_call
      },
      ...chatRequest.tools !== void 0 && {
        tools: chatRequest.tools
      },
      ...chatRequest.tool_choice !== void 0 && {
        tool_choice: chatRequest.tool_choice
      }
    },
    streamMode,
    credentials: extraMetadataRef.current.credentials,
    headers: {
      ...extraMetadataRef.current.headers,
      ...(_c = chatRequest.options) == null ? void 0 : _c.headers
    },
    abortController: () => abortControllerRef.current,
    restoreMessagesOnFailure() {
      mutate(previousMessages, false);
    },
    onResponse,
    onUpdate(merged, data) {
      mutate([...chatRequest.messages, ...merged], false);
      mutateStreamData([...existingData || [], ...data || []], false);
    },
    onFinish,
    generateId: generateId2
  });
};
function useChat({
  api = "/api/chat",
  id,
  initialMessages,
  initialInput = "",
  sendExtraMessageFields,
  experimental_onFunctionCall,
  experimental_onToolCall,
  streamMode,
  onResponse,
  onFinish,
  onError,
  credentials,
  headers,
  body,
  generateId: generateId2 = generateId
} = {}) {
  const hookId = (0, import_react.useId)();
  const idKey = id != null ? id : hookId;
  const chatKey = typeof api === "string" ? [api, idKey] : idKey;
  const [initialMessagesFallback] = (0, import_react.useState)([]);
  const { data: messages, mutate } = (0, import_swr.default)(
    [chatKey, "messages"],
    null,
    { fallbackData: initialMessages != null ? initialMessages : initialMessagesFallback }
  );
  const { data: isLoading = false, mutate: mutateLoading } = (0, import_swr.default)(
    [chatKey, "loading"],
    null
  );
  const { data: streamData, mutate: mutateStreamData } = (0, import_swr.default)([chatKey, "streamData"], null);
  const { data: error = void 0, mutate: setError } = (0, import_swr.default)([chatKey, "error"], null);
  const messagesRef = (0, import_react.useRef)(messages || []);
  (0, import_react.useEffect)(() => {
    messagesRef.current = messages || [];
  }, [messages]);
  const abortControllerRef = (0, import_react.useRef)(null);
  const extraMetadataRef = (0, import_react.useRef)({
    credentials,
    headers,
    body
  });
  (0, import_react.useEffect)(() => {
    extraMetadataRef.current = {
      credentials,
      headers,
      body
    };
  }, [credentials, headers, body]);
  const triggerRequest = (0, import_react.useCallback)(
    async (chatRequest) => {
      try {
        mutateLoading(true);
        setError(void 0);
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        await processChatStream({
          getStreamedResponse: () => getStreamedResponse(
            api,
            chatRequest,
            mutate,
            mutateStreamData,
            streamData,
            extraMetadataRef,
            messagesRef,
            abortControllerRef,
            generateId2,
            streamMode,
            onFinish,
            onResponse,
            sendExtraMessageFields
          ),
          experimental_onFunctionCall,
          experimental_onToolCall,
          updateChatRequest: (chatRequestParam) => {
            chatRequest = chatRequestParam;
          },
          getCurrentMessages: () => messagesRef.current
        });
        abortControllerRef.current = null;
      } catch (err) {
        if (err.name === "AbortError") {
          abortControllerRef.current = null;
          return null;
        }
        if (onError && err instanceof Error) {
          onError(err);
        }
        setError(err);
      } finally {
        mutateLoading(false);
      }
    },
    [
      mutate,
      mutateLoading,
      api,
      extraMetadataRef,
      onResponse,
      onFinish,
      onError,
      setError,
      mutateStreamData,
      streamData,
      sendExtraMessageFields,
      experimental_onFunctionCall,
      experimental_onToolCall,
      messagesRef,
      abortControllerRef,
      generateId2
    ]
  );
  const append = (0, import_react.useCallback)(
    async (message, {
      options,
      functions,
      function_call,
      tools,
      tool_choice,
      data
    } = {}) => {
      if (!message.id) {
        message.id = generateId2();
      }
      const chatRequest = {
        messages: messagesRef.current.concat(message),
        options,
        data,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest);
    },
    [triggerRequest, generateId2]
  );
  const reload = (0, import_react.useCallback)(
    async ({
      options,
      functions,
      function_call,
      tools,
      tool_choice
    } = {}) => {
      if (messagesRef.current.length === 0)
        return null;
      const lastMessage = messagesRef.current[messagesRef.current.length - 1];
      if (lastMessage.role === "assistant") {
        const chatRequest2 = {
          messages: messagesRef.current.slice(0, -1),
          options,
          ...functions !== void 0 && { functions },
          ...function_call !== void 0 && { function_call },
          ...tools !== void 0 && { tools },
          ...tool_choice !== void 0 && { tool_choice }
        };
        return triggerRequest(chatRequest2);
      }
      const chatRequest = {
        messages: messagesRef.current,
        options,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest);
    },
    [triggerRequest]
  );
  const stop = (0, import_react.useCallback)(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  const setMessages = (0, import_react.useCallback)(
    (messages2) => {
      mutate(messages2, false);
      messagesRef.current = messages2;
    },
    [mutate]
  );
  const [input, setInput] = (0, import_react.useState)(initialInput);
  const handleSubmit = (0, import_react.useCallback)(
    (e, options = {}, metadata) => {
      if (metadata) {
        extraMetadataRef.current = {
          ...extraMetadataRef.current,
          ...metadata
        };
      }
      e.preventDefault();
      if (!input)
        return;
      append(
        {
          content: input,
          role: "user",
          createdAt: /* @__PURE__ */ new Date()
        },
        options
      );
      setInput("");
    },
    [input, append]
  );
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  return {
    messages: messages || [],
    error,
    append,
    reload,
    stop,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// react/use-completion.ts
var import_react2 = require("react");
var import_swr2 = __toESM(require("swr"));

// shared/call-completion-api.ts
async function callCompletionApi({
  api,
  prompt,
  credentials,
  headers,
  body,
  streamMode = "stream-data",
  setCompletion,
  setLoading,
  setError,
  setAbortController,
  onResponse,
  onFinish,
  onError,
  onData
}) {
  try {
    setLoading(true);
    setError(void 0);
    const abortController = new AbortController();
    setAbortController(abortController);
    setCompletion("");
    const res = await fetch(api, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        ...body
      }),
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      signal: abortController.signal
    }).catch((err) => {
      throw err;
    });
    if (onResponse) {
      try {
        await onResponse(res);
      } catch (err) {
        throw err;
      }
    }
    if (!res.ok) {
      throw new Error(
        await res.text() || "Failed to fetch the chat response."
      );
    }
    if (!res.body) {
      throw new Error("The response body is empty.");
    }
    let result = "";
    const reader = res.body.getReader();
    switch (streamMode) {
      case "text": {
        const decoder = createChunkDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          result += decoder(value);
          setCompletion(result);
          if (abortController === null) {
            reader.cancel();
            break;
          }
        }
        break;
      }
      case "stream-data": {
        for await (const { type, value } of readDataStream(reader, {
          isAborted: () => abortController === null
        })) {
          switch (type) {
            case "text": {
              result += value;
              setCompletion(result);
              break;
            }
            case "data": {
              onData == null ? void 0 : onData(value);
              break;
            }
          }
        }
        break;
      }
      default: {
        const exhaustiveCheck = streamMode;
        throw new Error(`Unknown stream mode: ${exhaustiveCheck}`);
      }
    }
    if (onFinish) {
      onFinish(prompt, result);
    }
    setAbortController(null);
    return result;
  } catch (err) {
    if (err.name === "AbortError") {
      setAbortController(null);
      return null;
    }
    if (err instanceof Error) {
      if (onError) {
        onError(err);
      }
    }
    setError(err);
  } finally {
    setLoading(false);
  }
}

// react/use-completion.ts
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamMode,
  onResponse,
  onFinish,
  onError
} = {}) {
  const hookId = (0, import_react2.useId)();
  const completionId = id || hookId;
  const { data, mutate } = (0, import_swr2.default)([api, completionId], null, {
    fallbackData: initialCompletion
  });
  const { data: isLoading = false, mutate: mutateLoading } = (0, import_swr2.default)(
    [completionId, "loading"],
    null
  );
  const { data: streamData, mutate: mutateStreamData } = (0, import_swr2.default)([completionId, "streamData"], null);
  const [error, setError] = (0, import_react2.useState)(void 0);
  const completion = data;
  const [abortController, setAbortController] = (0, import_react2.useState)(null);
  const extraMetadataRef = (0, import_react2.useRef)({
    credentials,
    headers,
    body
  });
  (0, import_react2.useEffect)(() => {
    extraMetadataRef.current = {
      credentials,
      headers,
      body
    };
  }, [credentials, headers, body]);
  const triggerRequest = (0, import_react2.useCallback)(
    async (prompt, options) => callCompletionApi({
      api,
      prompt,
      credentials: extraMetadataRef.current.credentials,
      headers: { ...extraMetadataRef.current.headers, ...options == null ? void 0 : options.headers },
      body: {
        ...extraMetadataRef.current.body,
        ...options == null ? void 0 : options.body
      },
      streamMode,
      setCompletion: (completion2) => mutate(completion2, false),
      setLoading: mutateLoading,
      setError,
      setAbortController,
      onResponse,
      onFinish,
      onError,
      onData: (data2) => {
        mutateStreamData([...streamData || [], ...data2 || []], false);
      }
    }),
    [
      mutate,
      mutateLoading,
      api,
      extraMetadataRef,
      setAbortController,
      onResponse,
      onFinish,
      onError,
      setError,
      streamData,
      mutateStreamData
    ]
  );
  const stop = (0, import_react2.useCallback)(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);
  const setCompletion = (0, import_react2.useCallback)(
    (completion2) => {
      mutate(completion2, false);
    },
    [mutate]
  );
  const complete = (0, import_react2.useCallback)(
    async (prompt, options) => {
      return triggerRequest(prompt, options);
    },
    [triggerRequest]
  );
  const [input, setInput] = (0, import_react2.useState)(initialInput);
  const handleSubmit = (0, import_react2.useCallback)(
    (e) => {
      e.preventDefault();
      if (!input)
        return;
      return complete(input);
    },
    [input, complete]
  );
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  return {
    completion,
    complete,
    error,
    setCompletion,
    stop,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// react/use-assistant.ts
var import_react3 = require("react");
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError
}) {
  const [messages, setMessages] = (0, import_react3.useState)([]);
  const [input, setInput] = (0, import_react3.useState)("");
  const [threadId, setThreadId] = (0, import_react3.useState)(void 0);
  const [status, setStatus] = (0, import_react3.useState)("awaiting_message");
  const [error, setError] = (0, import_react3.useState)(void 0);
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const append = async (message, requestOptions) => {
    var _a;
    setStatus("in_progress");
    setMessages((messages2) => {
      var _a2;
      return [
        ...messages2,
        {
          ...message,
          id: (_a2 = message.id) != null ? _a2 : generateId()
        }
      ];
    });
    setInput("");
    try {
      const result = await fetch(api, {
        method: "POST",
        credentials,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: (_a = threadIdParam != null ? threadIdParam : threadId) != null ? _a : null,
          message: message.content,
          // optional request data:
          data: requestOptions == null ? void 0 : requestOptions.data
        })
      });
      if (result.body == null) {
        throw new Error("The response body is empty.");
      }
      for await (const { type, value } of readDataStream(
        result.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            setMessages((messages2) => [
              ...messages2,
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value
              }
            ]);
            break;
          }
          case "text": {
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              return [
                ...messages2.slice(0, messages2.length - 1),
                {
                  id: lastMessage.id,
                  role: lastMessage.role,
                  content: lastMessage.content + value
                }
              ];
            });
            break;
          }
          case "data_message": {
            setMessages((messages2) => {
              var _a2;
              return [
                ...messages2,
                {
                  id: (_a2 = value.id) != null ? _a2 : generateId(),
                  role: "data",
                  content: "",
                  data: value.data
                }
              ];
            });
            break;
          }
          case "assistant_control_data": {
            setThreadId(value.threadId);
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              lastMessage.id = value.messageId;
              return [...messages2.slice(0, messages2.length - 1), lastMessage];
            });
            break;
          }
          case "error": {
            const errorObj = new Error(value);
            setError(errorObj);
            break;
          }
        }
      }
    } catch (error2) {
      if (onError && error2 instanceof Error) {
        onError(error2);
      }
      setError(error2);
    }
    setStatus("awaiting_message");
  };
  const submitMessage = async (event, requestOptions) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    if (input === "") {
      return;
    }
    append({ role: "user", content: input }, requestOptions);
  };
  return {
    append,
    messages,
    setMessages,
    threadId,
    input,
    setInput,
    handleInputChange,
    submitMessage,
    status,
    error
  };
}
var experimental_useAssistant = useAssistant;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  experimental_useAssistant,
  useAssistant,
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map