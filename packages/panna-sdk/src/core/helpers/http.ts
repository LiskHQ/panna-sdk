import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { newLruMemCache } from './cache';
import { delay } from './delay';

// Request cache
const requestCache = newLruMemCache('http_request');

// Constants
export const DEFAULT_RETRIES = 2;
export const DEFAULT_RETRY_DELAY_MS = 100;

export const AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP: Record<string, PannaHttpErr> = {
  UNDEFINED: {
    code: 'ERR_UNKNOWN',
    message: 'Unknown error occured. Retry after some time.'
  },
  ERR_BAD_OPTION_VALUE: {
    code: 'ERR_REQUEST_OPTION',
    message: 'Incorrect request options. Fix the request options and retry.'
  },
  ERR_BAD_OPTION: {
    code: 'ERR_REQUEST_OPTION',
    message: 'Unknown option provided. Fix the request options and retry.'
  },
  ECONNABORTED: {
    code: 'ERR_REQUEST_ABORTED',
    message: 'Request aborted. Retry after some time.'
  },
  ETIMEDOUT: {
    code: 'ERR_REQUEST_TIMEOUT',
    message:
      'Request timed out. Retry after some time. Or, try increasing the timeout value.'
  },
  ERR_NETWORK: {
    code: 'ERR_NETWORK',
    message: 'Connection problems. Retry after some time.'
  },
  ERR_FR_TOO_MANY_REDIRECTS: {
    code: 'ERR_FR_TOO_MANY_REDIRECTS',
    message: 'Too many request redirects.'
  },
  ERR_DEPRECATED: {
    code: 'ERR_AXIOS_DEPRECATED',
    message: ''
  },
  ERR_BAD_RESPONSE: {
    code: 'ERR_BAD_RESPONSE',
    message: ''
  },
  ERR_BAD_REQUEST: {
    code: 'ERR_BAD_REQUEST',
    message: ''
  },
  ERR_CANCELED: {
    code: 'ERR_CANCELED',
    message: 'Connection canceled. Retry after some time.'
  },
  ERR_NOT_SUPPORT: {
    code: 'ERR_NOT_SUPPORT',
    message: ''
  },
  ERR_INVALID_URL: {
    code: 'ERR_INVALID_URL',
    message: ''
  }
};

// Internal types
type RequestParamsConfig = Omit<AxiosRequestConfig, 'url'>;

// Internal functions
export const isCacheableResponse = (response: AxiosResponse): boolean =>
  response.status === HttpStatusCode.Ok;

export const requestWithRetries = async (
  url: string,
  requestParams: RequestParamsConfig = {},
  numRetries: number = DEFAULT_RETRIES,
  retryDelayMs: number = DEFAULT_RETRY_DELAY_MS
): Promise<AxiosResponse | never> => {
  const maxRetries = numRetries;
  const requestConfig = { url, ...requestParams };

  // Without the following initial request before the for loop, TS complains:
  // "Variable 'response' is used before being assigned"
  let response: AxiosResponse = await axios.request(requestConfig);

  for (
    ;
    response.status >= HttpStatusCode.InternalServerError && numRetries;
    --numRetries
  ) {
    const backedoffDelayMs =
      retryDelayMs * Math.pow(2, maxRetries - numRetries);
    await delay(backedoffDelayMs);

    response = await axios.request(requestConfig);
  }

  return response;
};

export const formatResponseToJSON = (respData: unknown) =>
  typeof respData === 'string' ? JSON.parse(respData) : respData;

export const formatAxiosErr = (
  axiosErrCode: string | undefined
): PannaHttpErr => {
  if (axiosErrCode === undefined) {
    return AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP['UNDEFINED'];
  }

  return AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP[axiosErrCode.toUpperCase()];
};

// Exported entities
export interface PannaHttpErr {
  code: string;
  message: string;
}

export const HttpStatusCode = axios.HttpStatusCode;

export const request = async (
  url: string,
  params: RequestParamsConfig = {}
): Promise<Record<string, unknown> | PannaHttpErr> => {
  const { method = 'get', ...restParams } = params;
  const finalParams = { method, validateStatus: () => true, ...restParams };

  // If cache exists, return the response from cache
  const cacheKey = JSON.stringify({ url, finalParams }, null, 0);
  if (requestCache.has(cacheKey)) {
    const response = requestCache.get(cacheKey) as AxiosResponse;
    return formatResponseToJSON(response.data);
  }

  try {
    const response = (await requestWithRetries(
      url,
      finalParams,
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    )) as AxiosResponse;

    if (isCacheableResponse(response)) {
      requestCache.set(cacheKey, response);
    }

    return formatResponseToJSON(response.data);
  } catch (error) {
    const axiosErr = error as AxiosError;
    const pannaFormatErr = formatAxiosErr(axiosErr.code);
    return {
      code: pannaFormatErr.code,
      message: pannaFormatErr.message.length
        ? pannaFormatErr.message
        : axiosErr.message
    } as PannaHttpErr;
  }
};
