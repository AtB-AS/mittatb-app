export declare type Hosts = {
    pto: string;
};
export declare type ApiRequest = {
    headers?: Record<string, string>;
    method: string;
    url: string;
    body?: any;
};
export declare type ApiResponse<T = any> = {
    status: number;
    headers: Record<string, string>;
    body: T;
};
export declare type ApiErrorCode = 'TOKEN_EXPIRED';
export declare type ApiErrorBody = {
    errorCode: ApiErrorCode;
};
export declare type Fetch = <T>(request: ApiRequest) => Promise<ApiResponse<T>>;
export declare type Config = {
    hosts: Hosts;
    extraHeaders: Record<string, string>;
    fetch: Fetch;
};
export declare type InitialConfig = Partial<Config> & {
    safetyNetApiKey: string;
};
