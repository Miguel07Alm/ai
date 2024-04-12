// src/anthropic-facade.ts
import { loadApiKey } from "@ai-sdk/provider-utils";

// src/anthropic-messages-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
import {
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/anthropic-error.ts
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";
var anthropicErrorDataSchema = z.object({
  type: z.literal("error"),
  error: z.object({
    type: z.string(),
    message: z.string()
  })
});
var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/convert-to-anthropic-messages-prompt.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
function convertToAnthropicMessagesPrompt(prompt) {
  let system;
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        system = content;
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
                if (part.image instanceof URL) {
                  throw new UnsupportedFunctionalityError({
                    functionality: "URL image parts"
                  });
                } else {
                  return {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: (_a = part.mimeType) != null ? _a : "image/jpeg",
                      data: convertUint8ArrayToBase64(part.image)
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
          role: "assistant",
          content: content.map((part) => {
            switch (part.type) {
              case "text": {
                return { type: "text", text: part.text };
              }
              case "tool-call": {
                return {
                  type: "tool_use",
                  id: part.toolCallId,
                  name: part.toolName,
                  input: part.args
                };
              }
            }
          })
        });
        break;
      }
      case "tool": {
        messages.push({
          role: "user",
          content: content.map((part) => ({
            type: "tool_result",
            tool_use_id: part.toolCallId,
            content: JSON.stringify(part.result),
            is_error: part.isError
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
  return {
    system,
    messages
  };
}

// src/map-anthropic-stop-reason.ts
function mapAnthropicStopReason(finishReason) {
  switch (finishReason) {
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "tool_use":
      return "tool-calls";
    case "max_tokens":
      return "length";
    default:
      return "other";
  }
}

// src/anthropic-messages-language-model.ts
var AnthropicMessagesLanguageModel = class {
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
    const messagesPrompt = convertToAnthropicMessagesPrompt(prompt);
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      top_k: this.settings.topK,
      // standardized settings:
      max_tokens: maxTokens != null ? maxTokens : 4096,
      // 4096: max model output tokens
      temperature,
      // uses 0..1 scale
      top_p: topP,
      // prompt:
      system: messagesPrompt.system,
      messages: messagesPrompt.messages
    };
    switch (type) {
      case "regular": {
        const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
        return {
          args: {
            ...baseArgs,
            tools: tools == null ? void 0 : tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              input_schema: tool.parameters
            }))
          },
          warnings
        };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError2({
          functionality: "json-mode object generation"
        });
      }
      case "object-tool": {
        const { name, description, parameters } = mode.tool;
        baseArgs.messages[baseArgs.messages.length - 1].content.push({
          type: "text",
          text: `

Use the '${name}' tool.`
        });
        return {
          args: {
            ...baseArgs,
            tools: [{ name, description, input_schema: parameters }]
          },
          warnings
        };
      }
      case "object-grammar": {
        throw new UnsupportedFunctionalityError2({
          functionality: "grammar-mode object generation"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    const { args, warnings } = this.getArgs(options);
    const response = await postJsonToApi({
      url: `${this.config.baseUrl}/messages`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        anthropicMessagesResponseSchema
      ),
      abortSignal: options.abortSignal
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let text = "";
    for (const content of response.content) {
      if (content.type === "text") {
        text += content.text;
      }
    }
    let toolCalls = void 0;
    if (response.content.some((content) => content.type === "tool_use")) {
      toolCalls = [];
      for (const content of response.content) {
        if (content.type === "tool_use") {
          toolCalls.push({
            toolCallType: "function",
            toolCallId: content.id,
            toolName: content.name,
            args: JSON.stringify(content.input)
          });
        }
      }
    }
    return {
      text,
      toolCalls,
      finishReason: mapAnthropicStopReason(response.stop_reason),
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const response = await postJsonToApi({
      url: `${this.config.baseUrl}/messages`,
      headers: this.config.headers(),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        anthropicMessagesChunkSchema
      ),
      abortSignal: options.abortSignal
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "other";
    const usage = {
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
            switch (value.type) {
              case "ping":
              case "content_block_start":
              case "content_block_stop": {
                return;
              }
              case "content_block_delta": {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.delta.text
                });
                return;
              }
              case "message_start": {
                usage.promptTokens = value.message.usage.input_tokens;
                usage.completionTokens = value.message.usage.output_tokens;
                return;
              }
              case "message_delta": {
                usage.completionTokens = value.usage.output_tokens;
                finishReason = mapAnthropicStopReason(value.delta.stop_reason);
                return;
              }
              case "message_stop": {
                controller.enqueue({ type: "finish", finishReason, usage });
                return;
              }
              default: {
                const _exhaustiveCheck = value;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      warnings
    };
  }
};
var anthropicMessagesResponseSchema = z2.object({
  type: z2.literal("message"),
  content: z2.array(
    z2.discriminatedUnion("type", [
      z2.object({
        type: z2.literal("text"),
        text: z2.string()
      }),
      z2.object({
        type: z2.literal("tool_use"),
        id: z2.string(),
        name: z2.string(),
        input: z2.unknown()
      })
    ])
  ),
  stop_reason: z2.string().optional().nullable(),
  usage: z2.object({
    input_tokens: z2.number(),
    output_tokens: z2.number()
  })
});
var anthropicMessagesChunkSchema = z2.discriminatedUnion("type", [
  z2.object({
    type: z2.literal("message_start"),
    message: z2.object({
      usage: z2.object({
        input_tokens: z2.number(),
        output_tokens: z2.number()
      })
    })
  }),
  z2.object({
    type: z2.literal("content_block_start"),
    index: z2.number(),
    content_block: z2.object({
      type: z2.literal("text"),
      text: z2.string()
    })
  }),
  z2.object({
    type: z2.literal("content_block_delta"),
    index: z2.number(),
    delta: z2.object({
      type: z2.literal("text_delta"),
      text: z2.string()
    })
  }),
  z2.object({
    type: z2.literal("content_block_stop"),
    index: z2.number()
  }),
  z2.object({
    type: z2.literal("message_delta"),
    delta: z2.object({ stop_reason: z2.string().optional().nullable() }),
    usage: z2.object({ output_tokens: z2.number() })
  }),
  z2.object({
    type: z2.literal("message_stop")
  }),
  z2.object({
    type: z2.literal("ping")
  })
]);

// src/anthropic-facade.ts
var Anthropic = class {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
  }
  get baseConfig() {
    var _a;
    return {
      baseUrl: (_a = this.baseUrl) != null ? _a : "https://api.anthropic.com/v1",
      headers: () => ({
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "tools-2024-04-04",
        "x-api-key": loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: "ANTHROPIC_API_KEY",
          description: "Anthropic"
        })
      })
    };
  }
  messages(modelId, settings = {}) {
    return new AnthropicMessagesLanguageModel(modelId, settings, {
      provider: "anthropic.messages",
      ...this.baseConfig
    });
  }
};
var anthropic = new Anthropic();
export {
  Anthropic,
  anthropic
};
//# sourceMappingURL=index.mjs.map