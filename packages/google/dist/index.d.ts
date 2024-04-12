import { LanguageModelV1 } from '@ai-sdk/provider';

type GoogleGenerativeAIModelId = 'models/gemini-1.5-pro-latest' | 'models/gemini-pro' | 'models/gemini-pro-vision' | (string & {});
interface GoogleGenerativeAISettings {
    topK?: number;
}

type GoogleGenerativeAIConfig = {
    provider: string;
    baseUrl: string;
    headers: () => Record<string, string | undefined>;
    generateId: () => string;
};
declare class GoogleGenerativeAILanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode: undefined;
    readonly modelId: GoogleGenerativeAIModelId;
    readonly settings: GoogleGenerativeAISettings;
    private readonly config;
    constructor(modelId: GoogleGenerativeAIModelId, settings: GoogleGenerativeAISettings, config: GoogleGenerativeAIConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

/**
 * Google provider.
 */
declare class Google {
    readonly baseUrl?: string;
    readonly apiKey?: string;
    private readonly generateId;
    constructor(options?: {
        baseUrl?: string;
        apiKey?: string;
        generateId?: () => string;
    });
    private get baseConfig();
    generativeAI(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
}
/**
 * Default Google provider instance.
 */
declare const google: Google;

export { Google, google };
