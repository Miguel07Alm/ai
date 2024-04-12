import { LanguageModelV1 } from '@ai-sdk/provider';

type MistralChatModelId = 'open-mistral-7b' | 'open-mixtral-8x7b' | 'mistral-small-latest' | 'mistral-medium-latest' | 'mistral-large-latest' | (string & {});
interface MistralChatSettings {
    /**
     * Whether to inject a safety prompt before all conversations.
     *
     * Default: false
     */
    safePrompt?: boolean;
}

type MistralChatConfig = {
    provider: string;
    baseUrl: string;
    headers: () => Record<string, string | undefined>;
    generateId: () => string;
};
declare class MistralChatLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "json";
    readonly modelId: MistralChatModelId;
    readonly settings: MistralChatSettings;
    private readonly config;
    constructor(modelId: MistralChatModelId, settings: MistralChatSettings, config: MistralChatConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

/**
 * Mistral provider.
 */
declare class Mistral {
    readonly baseUrl?: string;
    readonly apiKey?: string;
    private readonly generateId;
    constructor(options?: {
        baseUrl?: string;
        apiKey?: string;
        generateId?: () => string;
    });
    private get baseConfig();
    chat(modelId: MistralChatModelId, settings?: MistralChatSettings): MistralChatLanguageModel;
}
/**
 * Default Mistral provider instance.
 */
declare const mistral: Mistral;

export { Mistral, mistral };
