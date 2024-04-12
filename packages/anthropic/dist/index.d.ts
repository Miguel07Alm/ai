import { LanguageModelV1 } from '@ai-sdk/provider';

type AnthropicMessagesModelId = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' | (string & {});
interface AnthropicMessagesSettings {
    /**
  Only sample from the top K options for each subsequent token.
  
  Used to remove "long tail" low probability responses.
  Recommended for advanced use cases only. You usually only need to use temperature.
     */
    topK?: number;
}

type AnthropicMessagesConfig = {
    provider: string;
    baseUrl: string;
    headers: () => Record<string, string | undefined>;
};
declare class AnthropicMessagesLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "tool";
    readonly modelId: AnthropicMessagesModelId;
    readonly settings: AnthropicMessagesSettings;
    private readonly config;
    constructor(modelId: AnthropicMessagesModelId, settings: AnthropicMessagesSettings, config: AnthropicMessagesConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

/**
 * Anthropic provider.
 */
declare class Anthropic {
    readonly baseUrl?: string;
    readonly apiKey?: string;
    constructor(options?: {
        baseUrl?: string;
        apiKey?: string;
        generateId?: () => string;
    });
    private get baseConfig();
    messages(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): AnthropicMessagesLanguageModel;
}
/**
 * Default Anthropic provider instance.
 */
declare const anthropic: Anthropic;

export { Anthropic, anthropic };
