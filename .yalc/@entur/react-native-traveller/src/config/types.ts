import type { LogCallback } from '../logger';

export type Hosts = {
  pto: string;
};

export type ApiRequest = {
  headers?: Record<string, string>;
  method: string;
  url: string;
  body?: any;
};

export type ApiResponse<T = any> = {
  status: number;
  headers: Record<string, string>;
  body: T;
};

export type ApiErrorCode = 'TOKEN_EXPIRED';

export type ApiErrorBody = {
  errorCode: ApiErrorCode;
};

export type Fetch = <T>(request: ApiRequest) => Promise<ApiResponse<T>>;

export type Config = {
  hosts: Hosts;
  extraHeaders: Record<string, string>;
  fetch: Fetch;
  infoLogger?: LogCallback;
  errorLogger?: LogCallback;
};

export type InitialConfig = Partial<Config> & { safetyNetApiKey: string };
