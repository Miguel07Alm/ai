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
  OpenAI: () => OpenAI,
  openai: () => openai
});
module.exports = __toCommonJS(src_exports);

// src/openai-facade.ts
var import_provider_utils5 = require("@ai-sdk/provider-utils");

// src/openai-chat-language-model.ts
var import_provider = require("@ai-sdk/provider");
var import_provider_utils3 = require("@ai-sdk/provider-utils");
var import_zod2 = require("zod");

// src/convert-to-openai-chat-messages.ts
var import_provider_utils = require("@ai-sdk/provider-utils");
function convertToOpenAIChatMessages(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part) => {
            var _a;
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "image": {
                return {
                  type: "image_url",
                  image_url: {
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${(0, import_provider_utils.convertUint8ArrayToBase64)(part.image)}`
                  }
                };
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: JSON.stringify(toolResponse.result)
          });
        }
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

// src/map-openai-finish-reason.ts
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "other";
  }
}

// src/openai-error.ts
var import_zod = require("zod");
var import_provider_utils2 = require("@ai-sdk/provider-utils");
var openAIErrorDataSchema = import_zod.z.object({
  error: import_zod.z.object({
    message: import_zod.z.string(),
    type: import_zod.z.string(),
    param: import_zod.z.any().nullable(),
    code: import_zod.z.string().nullable()
  })
});
var openaiFailedResponseHandler = (0, import_provider_utils2.createJsonErrorResponseHandler)({
  errorSchema: openAIErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/openai-chat-language-model.ts
var OpenAIChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "tool";
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
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature: (0, import_provider_utils3.scale)({
        value: temperature,
        outputMin: 0,
        outputMax: 2
      }),
      top_p: topP,
      frequency_penalty: (0, import_provider_utils3.scale)({
        value: frequencyPenalty,
        inputMin: -1,
        inputMax: 1,
        outputMin: -2,
        outputMax: 2
      }),
      presence_penalty: (0, import_provider_utils3.scale)({
        value: presencePenalty,
        inputMin: -1,
        inputMax: 1,
        outputMin: -2,
        outputMax: 2
      }),
      seed,
      // messages:
      messages: convertToOpenAIChatMessages(prompt)
    };
    switch (type) {
      case "regular": {
        const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
        return {
          ...baseArgs,
          tools: tools == null ? void 0 : tools.map((tool) => ({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters
            }
          }))
        };
      }
      case "object-json": {
        return {
          ...baseArgs,
          response_format: { type: "json_object" }
        };
      }
      case "object-tool": {
        return {
          ...baseArgs,
          tool_choice: { type: "function", function: { name: mode.tool.name } },
          tools: [
            {
              type: "function",
              function: {
                name: mode.tool.name,
                description: mode.tool.description,
                parameters: mode.tool.parameters
              }
            }
          ]
        };
      }
      case "object-grammar": {
        throw new import_provider.UnsupportedFunctionalityError({
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
    var _a, _b;
    const args = this.getArgs(options);
    const response = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseUrl}/chat/completions`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createJsonResponseHandler)(
        openAIChatResponseSchema
      ),
      abortSignal: options.abortSignal
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: (_a = choice.message.content) != null ? _a : void 0,
      toolCalls: (_b = choice.message.tool_calls) == null ? void 0 : _b.map((toolCall) => ({
        toolCallType: "function",
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        args: toolCall.function.arguments
      })),
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      warnings: []
    };
  }
  async doStream(options) {
    const args = this.getArgs(options);
    const response = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseUrl}/chat/completions`,
      headers: this.config.headers(),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createEventSourceResponseHandler)(
        openaiChatChunkSchema
      ),
      abortSignal: options.abortSignal
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const toolCalls = [];
    let finishReason = "other";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i;
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new import_provider.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new import_provider.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_a = toolCallDelta.function) == null ? void 0 : _a.name) == null) {
                    throw new import_provider.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`
                    });
                  }
                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: "function",
                    function: {
                      name: toolCallDelta.function.name,
                      arguments: (_b = toolCallDelta.function.arguments) != null ? _b : ""
                    }
                  };
                  continue;
                }
                const toolCall = toolCalls[index];
                if (((_c = toolCallDelta.function) == null ? void 0 : _c.arguments) != null) {
                  toolCall.function.arguments += (_e = (_d = toolCallDelta.function) == null ? void 0 : _d.arguments) != null ? _e : "";
                }
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: (_f = toolCallDelta.function.arguments) != null ? _f : ""
                });
                if (((_g = toolCall.function) == null ? void 0 : _g.name) == null || ((_h = toolCall.function) == null ? void 0 : _h.arguments) == null || !(0, import_provider_utils3.isParseableJson)(toolCall.function.arguments)) {
                  continue;
                }
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: (_i = toolCall.id) != null ? _i : (0, import_provider_utils3.generateId)(),
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments
                });
              }
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      warnings: []
    };
  }
};
var openAIChatResponseSchema = import_zod2.z.object({
  choices: import_zod2.z.array(
    import_zod2.z.object({
      message: import_zod2.z.object({
        role: import_zod2.z.literal("assistant"),
        content: import_zod2.z.string().nullable(),
        tool_calls: import_zod2.z.array(
          import_zod2.z.object({
            id: import_zod2.z.string(),
            type: import_zod2.z.literal("function"),
            function: import_zod2.z.object({
              name: import_zod2.z.string(),
              arguments: import_zod2.z.string()
            })
          })
        ).optional()
      }),
      index: import_zod2.z.number(),
      finish_reason: import_zod2.z.string().optional().nullable()
    })
  ),
  object: import_zod2.z.literal("chat.completion"),
  usage: import_zod2.z.object({
    prompt_tokens: import_zod2.z.number(),
    completion_tokens: import_zod2.z.number()
  })
});
var openaiChatChunkSchema = import_zod2.z.object({
  object: import_zod2.z.literal("chat.completion.chunk"),
  choices: import_zod2.z.array(
    import_zod2.z.object({
      delta: import_zod2.z.object({
        role: import_zod2.z.enum(["assistant"]).optional(),
        content: import_zod2.z.string().nullable().optional(),
        tool_calls: import_zod2.z.array(
          import_zod2.z.object({
            index: import_zod2.z.number(),
            id: import_zod2.z.string().optional(),
            type: import_zod2.z.literal("function").optional(),
            function: import_zod2.z.object({
              name: import_zod2.z.string().optional(),
              arguments: import_zod2.z.string().optional()
            })
          })
        ).optional()
      }),
      finish_reason: import_zod2.z.string().nullable().optional(),
      index: import_zod2.z.number()
    })
  ),
  usage: import_zod2.z.object({
    prompt_tokens: import_zod2.z.number(),
    completion_tokens: import_zod2.z.number()
  }).optional().nullable()
});

// src/openai-completion-language-model.ts
var import_provider3 = require("@ai-sdk/provider");
var import_provider_utils4 = require("@ai-sdk/provider-utils");
var import_zod3 = require("zod");

// src/convert-to-openai-completion-prompt.ts
var import_provider2 = require("@ai-sdk/provider");
function convertToOpenAICompletionPrompt({
  prompt,
  inputFormat,
  user = "user",
  assistant = "assistant"
}) {
  if (inputFormat === "prompt" && prompt.length === 1 && prompt[0].role === "user" && prompt[0].content.length === 1 && prompt[0].content[0].type === "text") {
    return { prompt: prompt[0].content[0].text };
  }
  let text = "";
  if (prompt[0].role === "system") {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new import_provider2.InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "image": {
              throw new import_provider2.UnsupportedFunctionalityError({
                functionality: "images"
              });
            }
          }
        }).join("");
        text += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new import_provider2.UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [`
${user}:`]
  };
}

// src/openai-completion-language-model.ts
var OpenAICompletionLanguageModel = class {
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
    inputFormat,
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
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt, inputFormat });
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature: (0, import_provider_utils4.scale)({
        value: temperature,
        outputMin: 0,
        outputMax: 2
      }),
      top_p: topP,
      frequency_penalty: (0, import_provider_utils4.scale)({
        value: frequencyPenalty,
        inputMin: -1,
        inputMax: 1,
        outputMin: -2,
        outputMax: 2
      }),
      presence_penalty: (0, import_provider_utils4.scale)({
        value: presencePenalty,
        inputMin: -1,
        inputMax: 1,
        outputMin: -2,
        outputMax: 2
      }),
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stopSequences
    };
    switch (type) {
      case "regular": {
        if ((_a = mode.tools) == null ? void 0 : _a.length) {
          throw new import_provider3.UnsupportedFunctionalityError({
            functionality: "tools"
          });
        }
        return baseArgs;
      }
      case "object-json": {
        throw new import_provider3.UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new import_provider3.UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      case "object-grammar": {
        throw new import_provider3.UnsupportedFunctionalityError({
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
    const args = this.getArgs(options);
    const response = await (0, import_provider_utils4.postJsonToApi)({
      url: `${this.config.baseUrl}/completions`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils4.createJsonResponseHandler)(
        openAICompletionResponseSchema
      ),
      abortSignal: options.abortSignal
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: choice.text,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      rawCall: { rawPrompt, rawSettings },
      warnings: []
    };
  }
  async doStream(options) {
    const args = this.getArgs(options);
    const response = await (0, import_provider_utils4.postJsonToApi)({
      url: `${this.config.baseUrl}/completions`,
      headers: this.config.headers(),
      body: {
        ...this.getArgs(options),
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils4.createEventSourceResponseHandler)(
        openaiCompletionChunkSchema
      ),
      abortSignal: options.abortSignal
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    let finishReason = "other";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: choice.text
              });
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      warnings: []
    };
  }
};
var openAICompletionResponseSchema = import_zod3.z.object({
  choices: import_zod3.z.array(
    import_zod3.z.object({
      text: import_zod3.z.string(),
      finish_reason: import_zod3.z.string()
    })
  ),
  usage: import_zod3.z.object({
    prompt_tokens: import_zod3.z.number(),
    completion_tokens: import_zod3.z.number()
  })
});
var openaiCompletionChunkSchema = import_zod3.z.object({
  object: import_zod3.z.literal("text_completion"),
  choices: import_zod3.z.array(
    import_zod3.z.object({
      text: import_zod3.z.string(),
      finish_reason: import_zod3.z.enum(["stop", "length", "content_filter"]).optional().nullable(),
      index: import_zod3.z.number()
    })
  ),
  usage: import_zod3.z.object({
    prompt_tokens: import_zod3.z.number(),
    completion_tokens: import_zod3.z.number()
  }).optional().nullable()
});

// src/openai-facade.ts
var OpenAI = class {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.organization = options.organization;
  }
  get baseConfig() {
    var _a;
    return {
      organization: this.organization,
      baseUrl: (_a = this.baseUrl) != null ? _a : "https://api.openai.com/v1",
      headers: () => ({
        Authorization: `Bearer ${(0, import_provider_utils5.loadApiKey)({
          apiKey: this.apiKey,
          environmentVariableName: "OPENAI_API_KEY",
          description: "OpenAI"
        })}`,
        "OpenAI-Organization": this.organization
      })
    };
  }
  chat(modelId, settings = {}) {
    return new OpenAIChatLanguageModel(modelId, settings, {
      provider: "openai.chat",
      ...this.baseConfig
    });
  }
  completion(modelId, settings = {}) {
    return new OpenAICompletionLanguageModel(modelId, settings, {
      provider: "openai.completion",
      ...this.baseConfig
    });
  }
};
var openai = new OpenAI();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OpenAI,
  openai
});
//# sourceMappingURL=index.js.map