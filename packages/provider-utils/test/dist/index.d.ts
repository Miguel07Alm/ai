import { SetupServer } from 'msw/node';

declare function convertStreamToArray<T>(stream: ReadableStream<T>): Promise<T[]>;

declare class JsonTestServer {
    readonly server: SetupServer;
    responseBodyJson: any;
    request: Request | undefined;
    constructor(url: string);
    getRequestBodyJson(): Promise<any>;
    getRequestHeaders(): Promise<Headers>;
    setupTestEnvironment(): void;
}

declare class StreamingTestServer {
    readonly server: SetupServer;
    responseChunks: any[];
    request: Request | undefined;
    constructor(url: string);
    getRequestBodyJson(): Promise<any>;
    getRequestHeaders(): Promise<Headers>;
    setupTestEnvironment(): void;
}

export { JsonTestServer, StreamingTestServer, convertStreamToArray };
