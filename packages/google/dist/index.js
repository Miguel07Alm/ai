"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Google: () => Google,
  createGoogleGenerativeAI: () => createGoogleGenerativeAI,
  google: () => google
});
module.exports = __toCommonJS(src_exports);

// src/google-facade.ts
var import_provider_utils4 = require("@ai-sdk/provider-utils");

// src/google-generative-ai-language-model.ts
var import_provider2 = require("@ai-sdk/provider");
var import_provider_utils3 = require("@ai-sdk/provider-utils");
var import_zod2 = require("zod");

// src/convert-to-google-generative-ai-messages.ts
var import_provider = require("@ai-sdk/provider");
var import_provider_utils = require("@ai-sdk/provider-utils");
function convertToGoogleGenerativeAIMessages(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "user", parts: [{ text: content }] });
        messages.push({ role: "model", parts: [{ text: "" }] });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          parts: content.map((part) => {
            var _a;
            switch (part.type) {
              case "text": {
                return { text: part.text };
              }
              case "image": {
                if (part.image instanceof URL) {
                  throw new import_provider.UnsupportedFunctionalityError({
                    functionality: "URL image parts"
                  });
                } else {
                  return {
                    inlineData: {
                      mimeType: (_a = part.mimeType) != null ? _a : "image/jpeg",
                      data: (0, import_provider_utils.convertUint8ArrayToBase64)(part.image)
                    }
                  };
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        messages.push({
          role: "model",
          parts: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text.length === 0 ? void 0 : { text: part.text };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.args
                  }
                };
              }
            }
          }).filter(
            (part) => part !== void 0
          )
        });
        break;
      }
      case "tool": {
        messages.push({
          role: "user",
          parts: content.map((part) => ({
            functionResponse: {
              name: part.toolName,
              response: part.result
            }
          }))
        });
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}

// src/google-error.ts
var import_provider_utils2 = require("@ai-sdk/provider-utils");
var import_zod = require("zod");
var googleErrorDataSchema = import_zod.z.object({
  error: import_zod.z.object({
    code: import_zod.z.number().nullable(),
    message: import_zod.z.string(),
    status: import_zod.z.string()
  })
});
var googleFailedResponseHandler = (0, import_provider_utils2.createJsonErrorResponseHandler)({
  errorSchema: googleErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/map-google-generative-ai-finish-reason.ts
function mapGoogleGenerativeAIFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "RECITATION":
    case "SAFETY":
      return "content-filter";
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
    default:
      return "other";
  }
}

// src/google-generative-ai-language-model.ts
var GoogleGenerativeAILanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    seed
  }) {
    var _a;
    const type = mode.type;
    const warnings = [];
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    const baseArgs = {
      generationConfig: {
        // model specific settings:
        topK: this.settings.topK,
        // standardized settings:
        maxOutputTokens: maxTokens,
        temperature,
        topP
      },
      // prompt:
      contents: convertToGoogleGenerativeAIMessages(prompt)
    };
    switch (type) {
      case "regular": {
        const functionDeclarations = (_a = mode.tools) == null ? void 0 : _a.map((tool) => {
          var _a2;
          return {
            name: tool.name,
            description: (_a2 = tool.description) != null ? _a2 : "",
            parameters: prepareJsonSchema(tool.parameters)
          };
        });
        return {
          args: {
            ...baseArgs,
            tools: functionDeclarations == null ? void 0 : { functionDeclarations }
          },
          warnings
        };
      }
      case "object-json": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      case "object-grammar": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "object-grammar mode"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a;
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseURL}/${this.modelId}:generateContent`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createJsonResponseHandler)(responseSchema),
      abortSignal: options.abortSignal
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    const candidate = response.candidates[0];
    const toolCalls = getToolCallsFromParts({
      parts: candidate.content.parts,
      generateId: this.config.generateId
    });
    return {
      text: getTextFromParts(candidate.content.parts),
      toolCalls,
      finishReason: mapGoogleGenerativeAIFinishReason({
        finishReason: candidate.finishReason,
        hasToolCalls: toolCalls != null && toolCalls.length > 0
      }),
      usage: {
        promptTokens: NaN,
        completionTokens: (_a = candidate.tokenCount) != null ? _a : NaN
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseURL}/${this.modelId}:streamGenerateContent?alt=sse`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createEventSourceResponseHandler)(chunkSchema),
      abortSignal: options.abortSignal
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    let finishReason = "other";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const generateId2 = this.config.generateId;
    let hasToolCalls = false;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const candidate = value.candidates[0];
            if ((candidate == null ? void 0 : candidate.finishReason) != null) {
              finishReason = mapGoogleGenerativeAIFinishReason({
                finishReason: candidate.finishReason,
                hasToolCalls
              });
            }
            if (candidate.tokenCount != null) {
              usage = {
                promptTokens: NaN,
                completionTokens: candidate.tokenCount
              };
            }
            const content = candidate.content;
            if (content == null) {
              return;
            }
            const deltaText = getTextFromParts(content.parts);
            if (deltaText != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: deltaText
              });
            }
            const toolCallDeltas = getToolCallsFromParts({
              parts: content.parts,
              generateId: generateId2
            });
            if (toolCallDeltas != null) {
              for (const toolCall of toolCallDeltas) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  args: toolCall.args
                });
                hasToolCalls = true;
              }
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings
    };
  }
};
function prepareJsonSchema(jsonSchema) {
  if (typeof jsonSchema !== "object") {
    return jsonSchema;
  }
  if (Array.isArray(jsonSchema)) {
    return jsonSchema.map(prepareJsonSchema);
  }
  const result = {};
  for (const [key, value] of Object.entries(jsonSchema)) {
    if (key === "additionalProperties" || key === "$schema") {
      continue;
    }
    result[key] = prepareJsonSchema(value);
  }
  return result;
}
function getToolCallsFromParts({
  parts,
  generateId: generateId2
}) {
  const functionCallParts = parts.filter(
    (part) => "functionCall" in part
  );
  return functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
    toolCallType: "function",
    toolCallId: generateId2(),
    toolName: part.functionCall.name,
    args: JSON.stringify(part.functionCall.args)
  }));
}
function getTextFromParts(parts) {
  const textParts = parts.filter((part) => "text" in part);
  return textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
}
var contentSchema = import_zod2.z.object({
  role: import_zod2.z.string(),
  parts: import_zod2.z.array(
    import_zod2.z.union([
      import_zod2.z.object({
        text: import_zod2.z.string()
      }),
      import_zod2.z.object({
        functionCall: import_zod2.z.object({
          name: import_zod2.z.string(),
          args: import_zod2.z.unknown()
        })
      })
    ])
  )
});
var responseSchema = import_zod2.z.object({
  candidates: import_zod2.z.array(
    import_zod2.z.object({
      content: contentSchema,
      finishReason: import_zod2.z.string().optional(),
      tokenCount: import_zod2.z.number().optional()
    })
  )
});
var chunkSchema = import_zod2.z.object({
  candidates: import_zod2.z.array(
    import_zod2.z.object({
      content: contentSchema.optional(),
      finishReason: import_zod2.z.string().optional(),
      tokenCount: import_zod2.z.number().optional()
    })
  )
});

// src/google-facade.ts
var Google = class {
  /**
   * Creates a new Google provider instance.
   */
  constructor(options = {}) {
    var _a, _b, _c;
    this.baseURL = (_b = (0, import_provider_utils4.withoutTrailingSlash)((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://generativelanguage.googleapis.com/v1beta";
    this.apiKey = options.apiKey;
    this.headers = options.headers;
    this.generateId = (_c = options.generateId) != null ? _c : import_provider_utils4.generateId;
  }
  get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        "x-goog-api-key": (0, import_provider_utils4.loadApiKey)({
          apiKey: this.apiKey,
          environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
          description: "Google Generative AI"
        }),
        ...this.headers
      })
    };
  }
  /**
   * @deprecated Use `chat()` instead.
   */
  generativeAI(modelId, settings = {}) {
    return this.chat(modelId, settings);
  }
  chat(modelId, settings = {}) {
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      ...this.baseConfig,
      generateId: this.generateId
    });
  }
};

// src/google-provider.ts
function createGoogleGenerativeAI(options = {}) {
  const google2 = new Google(options);
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Google Generative AI model function cannot be called with the new keyword."
      );
    }
    return google2.chat(modelId, settings);
  };
  provider.chat = google2.chat.bind(google2);
  provider.generativeAI = google2.generativeAI.bind(google2);
  return provider;
}
var google = createGoogleGenerativeAI();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Google,
  createGoogleGenerativeAI,
  google
});
//# sourceMappingURL=index.js.map