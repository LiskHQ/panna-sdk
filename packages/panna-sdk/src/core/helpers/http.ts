import * as axios from 'axios';
import { newLruMemCache } from './cache';
import { delay } from './delay';

// Request cache
const requestCache = newLruMemCache('http_request');

// Constants
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 100;

const AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP: Record<string, PannaHttpErr> = {
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
type RequestParamsConfig = Omit<axios.AxiosRequestConfig, 'url'>;

// Internal functions
const isCacheableResponse = (response: axios.AxiosResponse): boolean =>
  response.status === HttpStatusCode.Ok;

const requestWithRetries = async (
  url: string,
  requestParams: RequestParamsConfig,
  numRetries: number = DEFAULT_RETRIES,
  retryDelayMs: number = DEFAULT_RETRY_DELAY_MS
): Promise<axios.AxiosResponse> => {
  let response: axios.AxiosResponse;
  const ax = new axios.Axios();

  do {
    response = await ax.request({ url, ...requestParams });
    if (response.status < HttpStatusCode.InternalServerError) {
      return response;
    }

    const backedoffDelayMs =
      retryDelayMs * Math.pow(2, DEFAULT_RETRIES - numRetries);
    await delay(backedoffDelayMs);
  } while (--numRetries);

  return response;
};

const formatResponseToJSON = (respData: unknown) =>
  typeof respData === 'string' ? JSON.parse(respData) : respData;

const formatAxiosErr = (axiosErrCode: string | undefined): PannaHttpErr => {
  if (axiosErrCode === undefined) {
    return AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP['UNDEFINED'];
  }

  return AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP[axiosErrCode];
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
    const response = requestCache.get(cacheKey) as axios.AxiosResponse;
    return formatResponseToJSON(response.data);
  }

  try {
    const response = await requestWithRetries(
      url,
      finalParams,
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );

    if (isCacheableResponse(response)) {
      requestCache.set(cacheKey, response);
    }

    return formatResponseToJSON(response.data);
  } catch (error) {
    const axiosErr = error as axios.AxiosError;
    const pannaFormatErr = formatAxiosErr(axiosErr.code);
    return {
      code: pannaFormatErr.code,
      message: pannaFormatErr.message.length
        ? pannaFormatErr.message
        : axiosErr.message
    };
  }
};
