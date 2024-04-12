// src/google-facade.ts
import { generateId, loadApiKey } from "@ai-sdk/provider-utils";

// src/google-generative-ai-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
import {
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/convert-to-google-generative-ai-messages.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
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
                  throw new UnsupportedFunctionalityError({
                    functionality: "URL image parts"
                  });
                } else {
                  return {
                    inlineData: {
                      mimeType: (_a = part.mimeType) != null ? _a : "image/jpeg",
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
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";
var googleErrorDataSchema = z.object({
  error: z.object({
    code: z.number().nullable(),
    message: z.string(),
    status: z.string()
  })
});
var googleFailedResponseHandler = createJsonErrorResponseHandler({
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
        throw new UnsupportedFunctionalityError2({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError2({
          functionality: "object-tool mode"
        });
      }
      case "object-grammar": {
        throw new UnsupportedFunctionalityError2({
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
    const response = await postJsonToApi({
      url: `${this.config.baseUrl}/${this.modelId}:generateContent`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(responseSchema),
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
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const response = await postJsonToApi({
      url: `${this.config.baseUrl}/${this.modelId}:streamGenerateContent?alt=sse`,
      headers: this.config.headers(),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(chunkSchema),
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
var contentSchema = z2.object({
  role: z2.string(),
  parts: z2.array(
    z2.union([
      z2.object({
        text: z2.string()
      }),
      z2.object({
        functionCall: z2.object({
          name: z2.string(),
          args: z2.unknown()
        })
      })
    ])
  )
});
var responseSchema = z2.object({
  candidates: z2.array(
    z2.object({
      content: contentSchema,
      finishReason: z2.string().optional(),
      tokenCount: z2.number().optional()
    })
  )
});
var chunkSchema = z2.object({
  candidates: z2.array(
    z2.object({
      content: contentSchema.optional(),
      finishReason: z2.string().optional(),
      tokenCount: z2.number().optional()
    })
  )
});

// src/google-facade.ts
var Google = class {
  constructor(options = {}) {
    var _a;
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.generateId = (_a = options.generateId) != null ? _a : generateId;
  }
  get baseConfig() {
    var _a;
    return {
      baseUrl: (_a = this.baseUrl) != null ? _a : "https://generativelanguage.googleapis.com/v1beta",
      headers: () => ({
        "x-goog-api-key": loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
          description: "Google Generative AI"
        })
      })
    };
  }
  generativeAI(modelId, settings = {}) {
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      ...this.baseConfig,
      generateId: this.generateId
    });
  }
};
var google = new Google();
export {
  Google,
  google
};
//# sourceMappingURL=index.mjs.map