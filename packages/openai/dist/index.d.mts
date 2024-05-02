import { LanguageModelV1 } from '@ai-sdk/provider';

type OpenAIChatModelId = 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-turbo-preview' | 'gpt-4-0125-preview' | 'gpt-4-1106-preview' | 'gpt-4-vision-preview' | 'gpt-4' | 'gpt-4-0613' | 'gpt-4-32k' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-16k-0613' | (string & {});
interface OpenAIChatSettings {
    /**
  Modify the likelihood of specified tokens appearing in the completion.
  
  Accepts a JSON object that maps tokens (specified by their token ID in
  the GPT tokenizer) to an associated bias value from -100 to 100. You
  can use this tokenizer tool to convert text to token IDs. Mathematically,
  the bias is added to the logits generated by the model prior to sampling.
  The exact effect will vary per model, but values between -1 and 1 should
  decrease or increase likelihood of selection; values like -100 or 100
  should result in a ban or exclusive selection of the relevant token.
  
  As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
  token from being generated.
  */
    logitBias?: Record<number, number>;
    /**
  Return the log probabilities of the tokens. Including logprobs will increase
  the response size and can slow down response times. However, it can
  be useful to better understand how the model is behaving.
  
  Setting to true will return the log probabilities of the tokens that
  were generated.
  
  Setting to a number will return the log probabilities of the top n
  tokens that were generated.
  */
    logprobs?: boolean | number;
    /**
  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.
  */
    user?: string;
}

type OpenAIChatConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
};
declare class OpenAIChatLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "tool";
    readonly modelId: OpenAIChatModelId;
    readonly settings: OpenAIChatSettings;
    private readonly config;
    constructor(modelId: OpenAIChatModelId, settings: OpenAIChatSettings, config: OpenAIChatConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

type OpenAICompletionModelId = 'gpt-3.5-turbo-instruct' | (string & {});
interface OpenAICompletionSettings {
    /**
  Echo back the prompt in addition to the completion.
     */
    echo?: boolean;
    /**
  Modify the likelihood of specified tokens appearing in the completion.
  
  Accepts a JSON object that maps tokens (specified by their token ID in
  the GPT tokenizer) to an associated bias value from -100 to 100. You
  can use this tokenizer tool to convert text to token IDs. Mathematically,
  the bias is added to the logits generated by the model prior to sampling.
  The exact effect will vary per model, but values between -1 and 1 should
  decrease or increase likelihood of selection; values like -100 or 100
  should result in a ban or exclusive selection of the relevant token.
  
  As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
  token from being generated.
     */
    logitBias?: Record<number, number>;
    /**
  Return the log probabilities of the tokens. Including logprobs will increase
  the response size and can slow down response times. However, it can
  be useful to better understand how the model is behaving.
  
  Setting to true will return the log probabilities of the tokens that
  were generated.
  
  Setting to a number will return the log probabilities of the top n
  tokens that were generated.
     */
    logprobs?: boolean | number;
    /**
  The suffix that comes after a completion of inserted text.
     */
    suffix?: string;
    /**
  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.
     */
    user?: string;
}

type OpenAICompletionConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
};
declare class OpenAICompletionLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode: undefined;
    readonly modelId: OpenAICompletionModelId;
    readonly settings: OpenAICompletionSettings;
    private readonly config;
    constructor(modelId: OpenAICompletionModelId, settings: OpenAICompletionSettings, config: OpenAICompletionConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

interface OpenAIProvider {
    (modelId: 'gpt-3.5-turbo-instruct', settings?: OpenAICompletionSettings): OpenAICompletionLanguageModel;
    (modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): OpenAIChatLanguageModel;
    chat(modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): OpenAIChatLanguageModel;
    completion(modelId: OpenAICompletionModelId, settings?: OpenAICompletionSettings): OpenAICompletionLanguageModel;
}
interface OpenAIProviderSettings {
    /**
  Base URL for the OpenAI API calls.
       */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
       */
    baseUrl?: string;
    /**
  API key for authenticating requests.
       */
    apiKey?: string;
    /**
  OpenAI Organization.
       */
    organization?: string;
    /**
  OpenAI project.
       */
    project?: string;
    /**
  Custom headers to include in the requests.
       */
    headers?: Record<string, string>;
}
/**
Create an OpenAI provider instance.
 */
declare function createOpenAI(options?: OpenAIProviderSettings): OpenAIProvider;
/**
 * Default OpenAI provider instance.
 */
declare const openai: OpenAIProvider;

/**
@deprecated Use `createOpenAI` instead.
 */
declare class OpenAI {
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.openai.com/v1`.
     */
    readonly baseURL: string;
    /**
  API key that is being send using the `Authorization` header.
  It defaults to the `OPENAI_API_KEY` environment variable.
   */
    readonly apiKey?: string;
    /**
  OpenAI Organization.
     */
    readonly organization?: string;
    /**
  OpenAI project.
     */
    readonly project?: string;
    /**
  Custom headers to include in the requests.
     */
    readonly headers?: Record<string, string>;
    /**
     * Creates a new OpenAI provider instance.
     */
    constructor(options?: OpenAIProviderSettings);
    private get baseConfig();
    chat(modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): OpenAIChatLanguageModel;
    completion(modelId: OpenAICompletionModelId, settings?: OpenAICompletionSettings): OpenAICompletionLanguageModel;
}

export { OpenAI, type OpenAIProvider, type OpenAIProviderSettings, createOpenAI, openai };
