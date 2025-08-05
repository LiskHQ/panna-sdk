import * as axios from 'axios';
import { newLruMemCache } from './cache';
import { delay } from './delay';

// Constants
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY_MS = 100;

// Request cache
const requestCache = newLruMemCache('http_request');

// Internal types
type RequestParamsConfig = Omit<axios.AxiosRequestConfig, 'url'>;

// Internal functions
const isCacheableResponse = (response: axios.AxiosResponse) =>
  response.status === HttpStatusCode.Ok;

const requestWithRetries = async (
  url: string,
  requestParams: RequestParamsConfig,
  numRetries: number = DEFAULT_RETRIES,
  retryDelayMs: number = DEFAULT_RETRY_DELAY_MS
) => {
  let response: axios.AxiosResponse;

  do {
    const ax = new axios.Axios();
    response = await ax.request({ url, ...requestParams });
    if (response.status < HttpStatusCode.BadRequest) return response;

    await delay(retryDelayMs);
  } while (--numRetries);

  return response;
};

// Exported entities
export const HttpStatusCode = axios.HttpStatusCode;

export const request = async (
  url: string,
  params: RequestParamsConfig = {}
) => {
  let response: axios.AxiosResponse;

  if (!('method' in params)) {
    params.method = 'get';
  }

  // If cache exists, return the response from cache
  const cacheKey = JSON.stringify({ url, params }, null, 0);
  if (requestCache.has(cacheKey)) {
    response = requestCache.get(cacheKey) as axios.AxiosResponse;
  }

  response = await requestWithRetries(
    url,
    params,
    DEFAULT_RETRIES,
    DEFAULT_RETRY_DELAY_MS
  );

  if (isCacheableResponse(response)) requestCache.set(cacheKey, response);

  return response.data;
};
