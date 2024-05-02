// src/openai-facade.ts
import { loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils";

// src/openai-chat-language-model.ts
import {
  InvalidResponseDataError,
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
import {
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  generateId,
  isParseableJson,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/convert-to-openai-chat-messages.ts
import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
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
                    url: part.image instanceof URL ? part.image.toString() : `data:${(_a = part.mimeType) != null ? _a : "image/jpeg"};base64,${convertUint8ArrayToBase64(part.image)}`
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
import { z } from "zod";
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
var openAIErrorDataSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string(),
    param: z.any().nullable(),
    code: z.string().nullable()
  })
});
var openaiFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: openAIErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/map-openai-chat-logprobs.ts
function mapOpenAIChatLogProbsOutput(logprobs) {
  var _a, _b;
  return (_b = (_a = logprobs == null ? void 0 : logprobs.content) == null ? void 0 : _a.map(({ token, logprob, top_logprobs }) => ({
    token,
    logprob,
    topLogprobs: top_logprobs ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
      token: token2,
      logprob: logprob2
    })) : []
  }))) != null ? _b : void 0;
}

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
      logprobs: this.settings.logprobs === true || typeof this.settings.logprobs === "number",
      top_logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
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
        throw new UnsupportedFunctionalityError({
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
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openAIChatResponseSchema
      ),
      abortSignal: options.abortSignal
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: (_a = choice.message.content) != null ? _a : void 0,
      toolCalls: (_b = choice.message.tool_calls) == null ? void 0 : _b.map((toolCall) => {
        var _a2;
        return {
          toolCallType: "function",
          toolCallId: (_a2 = toolCall.id) != null ? _a2 : generateId(),
          toolName: toolCall.function.name,
          args: toolCall.function.arguments
        };
      }),
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: [],
      logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs)
    };
  }
  async doStream(options) {
    const args = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: this.config.headers(),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
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
    let logprobs;
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
            const mappedLogprobs = mapOpenAIChatLogProbsOutput(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0)
                logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                const index = toolCallDelta.index;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== "function") {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`
                    });
                  }
                  if (((_a = toolCallDelta.function) == null ? void 0 : _a.name) == null) {
                    throw new InvalidResponseDataError({
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
                if (((_g = toolCall.function) == null ? void 0 : _g.name) == null || ((_h = toolCall.function) == null ? void 0 : _h.arguments) == null || !isParseableJson(toolCall.function.arguments)) {
                  continue;
                }
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: (_i = toolCall.id) != null ? _i : generateId(),
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments
                });
              }
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: []
    };
  }
};
var openAIChatResponseSchema = z2.object({
  choices: z2.array(
    z2.object({
      message: z2.object({
        role: z2.literal("assistant"),
        content: z2.string().nullable().optional(),
        tool_calls: z2.array(
          z2.object({
            id: z2.string().optional().nullable(),
            type: z2.literal("function"),
            function: z2.object({
              name: z2.string(),
              arguments: z2.string()
            })
          })
        ).optional()
      }),
      index: z2.number(),
      logprobs: z2.object({
        content: z2.array(
          z2.object({
            token: z2.string(),
            logprob: z2.number(),
            top_logprobs: z2.array(
              z2.object({
                token: z2.string(),
                logprob: z2.number()
              })
            )
          })
        ).nullable()
      }).nullable().optional(),
      finish_reason: z2.string().optional().nullable()
    })
  ),
  object: z2.literal("chat.completion"),
  usage: z2.object({
    prompt_tokens: z2.number(),
    completion_tokens: z2.number()
  })
});
var openaiChatChunkSchema = z2.object({
  object: z2.enum([
    "chat.completion.chunk",
    "chat.completion"
    // support for OpenAI-compatible providers such as Perplexity
  ]),
  choices: z2.array(
    z2.object({
      delta: z2.object({
        role: z2.enum(["assistant"]).optional(),
        content: z2.string().nullable().optional(),
        tool_calls: z2.array(
          z2.object({
            index: z2.number(),
            id: z2.string().optional().nullable(),
            type: z2.literal("function").optional(),
            function: z2.object({
              name: z2.string().optional(),
              arguments: z2.string().optional()
            })
          })
        ).optional()
      }),
      logprobs: z2.object({
        content: z2.array(
          z2.object({
            token: z2.string(),
            logprob: z2.number(),
            top_logprobs: z2.array(
              z2.object({
                token: z2.string(),
                logprob: z2.number()
              })
            )
          })
        ).nullable()
      }).nullable().optional(),
      finish_reason: z2.string().nullable().optional(),
      index: z2.number()
    })
  ),
  usage: z2.object({
    prompt_tokens: z2.number(),
    completion_tokens: z2.number()
  }).optional().nullable()
});

// src/openai-completion-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError3
} from "@ai-sdk/provider";
import {
  createEventSourceResponseHandler as createEventSourceResponseHandler2,
  createJsonResponseHandler as createJsonResponseHandler2,
  postJsonToApi as postJsonToApi2
} from "@ai-sdk/provider-utils";
import { z as z3 } from "zod";

// src/convert-to-openai-completion-prompt.ts
import {
  InvalidPromptError,
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
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
        throw new InvalidPromptError({
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
              throw new UnsupportedFunctionalityError2({
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
              throw new UnsupportedFunctionalityError2({
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
        throw new UnsupportedFunctionalityError2({
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

// src/map-openai-completion-logprobs.ts
function mapOpenAICompletionLogProbs(logprobs) {
  return logprobs == null ? void 0 : logprobs.tokens.map((token, index) => ({
    token,
    logprob: logprobs.token_logprobs[index],
    topLogprobs: logprobs.top_logprobs ? Object.entries(logprobs.top_logprobs[index]).map(
      ([token2, logprob]) => ({
        token: token2,
        logprob
      })
    ) : []
  }));
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
      logprobs: typeof this.settings.logprobs === "number" ? this.settings.logprobs : typeof this.settings.logprobs === "boolean" ? this.settings.logprobs ? 0 : void 0 : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stopSequences
    };
    switch (type) {
      case "regular": {
        if ((_a = mode.tools) == null ? void 0 : _a.length) {
          throw new UnsupportedFunctionalityError3({
            functionality: "tools"
          });
        }
        return baseArgs;
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError3({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError3({
          functionality: "object-tool mode"
        });
      }
      case "object-grammar": {
        throw new UnsupportedFunctionalityError3({
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
    const { responseHeaders, value: response } = await postJsonToApi2({
      url: `${this.config.baseURL}/completions`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler2(
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
      logprobs: mapOpenAICompletionLogProbs(choice.logprobs),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: []
    };
  }
  async doStream(options) {
    const args = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi2({
      url: `${this.config.baseURL}/completions`,
      headers: this.config.headers(),
      body: {
        ...this.getArgs(options),
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler2(
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
    let logprobs;
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
            const mappedLogprobs = mapOpenAICompletionLogProbs(
              choice == null ? void 0 : choice.logprobs
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0)
                logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              logprobs,
              usage
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings: []
    };
  }
};
var openAICompletionResponseSchema = z3.object({
  choices: z3.array(
    z3.object({
      text: z3.string(),
      finish_reason: z3.string(),
      logprobs: z3.object({
        tokens: z3.array(z3.string()),
        token_logprobs: z3.array(z3.number()),
        top_logprobs: z3.array(z3.record(z3.string(), z3.number())).nullable()
      }).nullable().optional()
    })
  ),
  usage: z3.object({
    prompt_tokens: z3.number(),
    completion_tokens: z3.number()
  })
});
var openaiCompletionChunkSchema = z3.object({
  object: z3.literal("text_completion"),
  choices: z3.array(
    z3.object({
      text: z3.string(),
      finish_reason: z3.enum(["stop", "length", "content_filter"]).optional().nullable(),
      index: z3.number(),
      logprobs: z3.object({
        tokens: z3.array(z3.string()),
        token_logprobs: z3.array(z3.number()),
        top_logprobs: z3.array(z3.record(z3.string(), z3.number())).nullable()
      }).nullable().optional()
    })
  ),
  usage: z3.object({
    prompt_tokens: z3.number(),
    completion_tokens: z3.number()
  }).optional().nullable()
});

// src/openai-facade.ts
var OpenAI = class {
  /**
   * Creates a new OpenAI provider instance.
   */
  constructor(options = {}) {
    var _a, _b;
    this.baseURL = (_b = withoutTrailingSlash((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://api.openai.com/v1";
    this.apiKey = options.apiKey;
    this.organization = options.organization;
    this.project = options.project;
    this.headers = options.headers;
  }
  get baseConfig() {
    return {
      organization: this.organization,
      baseURL: this.baseURL,
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: "OPENAI_API_KEY",
          description: "OpenAI"
        })}`,
        "OpenAI-Organization": this.organization,
        "OpenAI-Project": this.project,
        ...this.headers
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

// src/openai-provider.ts
function createOpenAI(options = {}) {
  const openai2 = new OpenAI(options);
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    }
    if (modelId === "gpt-3.5-turbo-instruct") {
      return openai2.completion(modelId, settings);
    } else {
      return openai2.chat(modelId, settings);
    }
  };
  provider.chat = openai2.chat.bind(openai2);
  provider.completion = openai2.completion.bind(openai2);
  return provider;
}
var openai = createOpenAI();
export {
  OpenAI,
  createOpenAI,
  openai
};
//# sourceMappingURL=index.mjs.map