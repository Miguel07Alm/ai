import { LanguageModelV1 } from '@ai-sdk/provider';

type GoogleGenerativeAIModelId = 'models/gemini-1.5-pro-latest' | 'models/gemini-pro' | 'models/gemini-pro-vision' | (string & {});
interface GoogleGenerativeAISettings {
    /**
  Optional. The maximum number of tokens to consider when sampling.
  
  Models use nucleus sampling or combined Top-k and nucleus sampling.
  Top-k sampling considers the set of topK most probable tokens.
  Models running with nucleus sampling don't allow topK setting.
     */
    topK?: number;
}

type GoogleGenerativeAIConfig = {
    provider: string;
    baseURL: string;
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

interface GoogleGenerativeAIProvider {
    (modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
    chat(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
    /**
     * @deprecated Use `chat()` instead.
     */
    generativeAI(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
}
interface GoogleGenerativeAIProviderSettings {
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
     */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
     */
    baseUrl?: string;
    /**
  API key that is being send using the `x-goog-api-key` header.
  It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
  Custom headers to include in the requests.
       */
    headers?: Record<string, string>;
    generateId?: () => string;
}
/**
Create a Google Generative AI provider instance.
 */
declare function createGoogleGenerativeAI(options?: GoogleGenerativeAIProviderSettings): GoogleGenerativeAIProvider;
/**
Default Google Generative AI provider instance.
 */
declare const google: GoogleGenerativeAIProvider;

/**
 * @deprecated Use `createGoogleGenerativeAI` instead.
 */
declare class Google {
    /**
     * Base URL for the Google API calls.
     */
    readonly baseURL: string;
    readonly apiKey?: string;
    readonly headers?: Record<string, string>;
    private readonly generateId;
    /**
     * Creates a new Google provider instance.
     */
    constructor(options?: GoogleGenerativeAIProviderSettings);
    private get baseConfig();
    /**
     * @deprecated Use `chat()` instead.
     */
    generativeAI(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
    chat(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
}

export { Google, type GoogleGenerativeAIProvider, type GoogleGenerativeAIProviderSettings, createGoogleGenerativeAI, google };
