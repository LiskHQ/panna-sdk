import { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import * as delay from './delay';
import * as http from './http';
import {
  AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP,
  DEFAULT_RETRIES,
  DEFAULT_RETRY_DELAY_MS,
  formatAxiosErr,
  formatResponseToJSON,
  isCacheableResponse,
  request,
  requestWithRetries,
  HttpStatusCode
} from './http';
import { fixture_getSampleAxiosResponse } from './http.fixture.test';

jest.mock('axios');
jest.mock('./delay', () => jest.requireActual('./delay'));
jest.mock('./http', () => jest.requireActual('./http'));

const MOCK_REQUEST_URL = 'http://test.url';

describe('isCacheableResponse', () => {
  it('should return true for 200 OK responses', () => {
    const response: AxiosResponse = fixture_getSampleAxiosResponse(200);
    expect(isCacheableResponse(response)).toBeTruthy();
  });

  it('should return false for non-200 OK responses', () => {
    const range = (
      start: number,
      end: number // non-inclusive
    ): number[] => Array.from({ length: end - start }, (v, k) => k + start);

    const possibleNon200StatusCodes = [...range(100, 200), ...range(201, 600)];
    possibleNon200StatusCodes.forEach((statusCode) => {
      const response: AxiosResponse =
        fixture_getSampleAxiosResponse(statusCode);
      expect(isCacheableResponse(response)).toBeFalsy();
    });
  });
});

describe('formatAxiosErr', () => {
  Object.keys(AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP).forEach((k) => {
    it(`should return configured Panna error for '${k}' Axios error`, () => {
      expect(formatAxiosErr(k)).toStrictEqual(
        AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP[k]
      );
    });

    it(`should return configured Panna error for '${k}' Axios error - case insensitive`, () => {
      expect(formatAxiosErr(k.toLowerCase())).toStrictEqual(
        AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP[k]
      );
    });
  });

  it('should return configured Panna error for undefined Axios error', () => {
    expect(formatAxiosErr(undefined)).toStrictEqual(
      AXIOS_ERR_CODE_TO_CUSTOM_ERR_MAP['UNDEFINED']
    );
  });
});

describe('formatResponseToJSON', () => {
  it('should return a stringified JSON object as a JSON', () => {
    const json = { a: 1, b: 'string', c: true, d: 100.111 };
    const stringifiedJson = JSON.stringify(json);
    expect(formatResponseToJSON(stringifiedJson)).toStrictEqual(json);
  });

  it('should return a JSON object as is', () => {
    const json = { a: 1, b: 'string', c: true, d: 100.111 };
    expect(formatResponseToJSON(json)).toBe(json);
  });
});

describe('requestWithRetries', () => {
  it('should immediately return response on successful API request', async () => {
    const mockApiResponse = fixture_getSampleAxiosResponse(HttpStatusCode.Ok);
    (axios.request as jest.Mock).mockResolvedValue(mockApiResponse);
    jest.spyOn(delay, 'delay');

    const result = await requestWithRetries(MOCK_REQUEST_URL);

    expect(axios.request).toHaveBeenCalledTimes(1);
    expect(axios.request).toHaveBeenCalledWith({
      url: MOCK_REQUEST_URL
    });
    expect(result).toStrictEqual(mockApiResponse);
    expect(delay.delay).not.toHaveBeenCalled();
  });

  it(`should retry a maximum of ${1 + DEFAULT_RETRIES} times with backedOff delay on consistent API request failures`, async () => {
    const mockApiResponse = fixture_getSampleAxiosResponse(
      HttpStatusCode.InternalServerError
    );
    (axios.request as jest.Mock).mockResolvedValue(mockApiResponse);
    jest.spyOn(delay, 'delay');

    const startTime = Date.now();
    const result = await requestWithRetries(MOCK_REQUEST_URL);
    const endTime = Date.now();

    expect(axios.request).toHaveBeenCalledTimes(1 + DEFAULT_RETRIES);
    for (let i = 1; i <= 1 + DEFAULT_RETRIES; i++) {
      expect(axios.request).toHaveBeenNthCalledWith(i, {
        url: MOCK_REQUEST_URL
      });
    }
    expect(result).toStrictEqual(mockApiResponse);

    expect(delay.delay).toHaveBeenCalledTimes(DEFAULT_RETRIES);
    expect(endTime - startTime).toBeGreaterThanOrEqual(
      DEFAULT_RETRY_DELAY_MS * (Math.pow(2, DEFAULT_RETRIES) - 1)
    );
  });

  it('should retry on initial API request failure with backedOff delay', async () => {
    const mockApiResponse1 = fixture_getSampleAxiosResponse(
      HttpStatusCode.InternalServerError
    );
    const mockApiResponse2 = fixture_getSampleAxiosResponse(
      HttpStatusCode.ServiceUnavailable
    );
    const mockApiResponse3 = fixture_getSampleAxiosResponse(HttpStatusCode.Ok);

    (axios.request as jest.Mock)
      .mockResolvedValueOnce(mockApiResponse1)
      .mockResolvedValueOnce(mockApiResponse2)
      .mockResolvedValue(mockApiResponse3);
    jest.spyOn(delay, 'delay');

    const startTime = Date.now();
    const result = await requestWithRetries(MOCK_REQUEST_URL);
    const endTime = Date.now();

    const expectedNumTries = 3;
    expect(axios.request).toHaveBeenCalledTimes(expectedNumTries);
    for (let i = 1; i <= expectedNumTries; i++) {
      expect(axios.request).toHaveBeenNthCalledWith(i, {
        url: MOCK_REQUEST_URL
      });
    }
    expect(result).toStrictEqual(mockApiResponse3);

    const expectedNumRetries = expectedNumTries - 1;
    expect(delay.delay).toHaveBeenCalledTimes(expectedNumRetries);
    expect(endTime - startTime).toBeGreaterThanOrEqual(
      DEFAULT_RETRY_DELAY_MS * (Math.pow(2, expectedNumRetries) - 1)
    );
  });

  it('should throw error when Axios throws', async () => {
    (axios.request as jest.Mock).mockImplementation(async () => {
      throw new AxiosError();
    });
    jest.spyOn(delay, 'delay');

    expect.assertions(4); // Because of for expect calls below
    requestWithRetries(MOCK_REQUEST_URL).catch((e) =>
      expect(e instanceof AxiosError).toBeTruthy()
    );

    expect(axios.request).toHaveBeenCalledTimes(1);
    expect(axios.request).toHaveBeenCalledWith({
      url: MOCK_REQUEST_URL
    });
    expect(delay.delay).not.toHaveBeenCalled();
  });
});

describe('HttpStatusCode', () => {
  it('should return numeric status code within range: [100, 599] - RFC 9110', () => {
    const HttpStatusCodes = Object.values(HttpStatusCode);
    const HTTPStatusCodeValues = HttpStatusCodes.slice(
      HttpStatusCodes.length / 2
    );

    HTTPStatusCodeValues.forEach((statusCode) => {
      const parsedStatusCode = Number(statusCode);
      expect(isNaN(parsedStatusCode)).toBeFalsy();
      expect(parsedStatusCode).toBeGreaterThanOrEqual(100);
      expect(parsedStatusCode).toBeLessThanOrEqual(599);
    });
  });
});

describe('request', () => {
  const validateStatus = () => true;

  it('should return PannaHttpErr response in case of internal Axios error', async () => {
    const axiosErr = new AxiosError(
      'ERR_NETWORK',
      'Unable to connect to internet...'
    );
    jest.spyOn(http, 'requestWithRetries').mockImplementation(() => {
      throw axiosErr;
    });

    expect(
      request(MOCK_REQUEST_URL, { validateStatus })
    ).resolves.toStrictEqual(formatAxiosErr(axiosErr.code));
    expect(http.requestWithRetries).toHaveBeenCalledTimes(1);
    expect(http.requestWithRetries).toHaveBeenCalledWith(
      MOCK_REQUEST_URL,
      {
        method: 'get',
        validateStatus
      },
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );
  });

  it('should return failed API response', async () => {
    const mockResponse = fixture_getSampleAxiosResponse(
      HttpStatusCode.ServiceUnavailable
    );
    jest.spyOn(http, 'requestWithRetries').mockResolvedValue(mockResponse);

    expect(
      request(MOCK_REQUEST_URL, { validateStatus })
    ).resolves.toStrictEqual(mockResponse.data);
    expect(http.requestWithRetries).toHaveBeenCalledTimes(1);
    expect(http.requestWithRetries).toHaveBeenCalledWith(
      MOCK_REQUEST_URL,
      {
        method: 'get',
        validateStatus
      },
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );
  });

  it('should return failed response for non-GET API call', async () => {
    const mockResponse = fixture_getSampleAxiosResponse(
      HttpStatusCode.ServiceUnavailable
    );
    jest.spyOn(http, 'requestWithRetries').mockResolvedValue(mockResponse);

    expect(
      request(MOCK_REQUEST_URL, { method: 'put', validateStatus })
    ).resolves.toStrictEqual(mockResponse.data);
    expect(http.requestWithRetries).toHaveBeenCalledTimes(1);
    expect(http.requestWithRetries).toHaveBeenCalledWith(
      MOCK_REQUEST_URL,
      {
        method: 'put',
        validateStatus
      },
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );
  });

  it('should return successful API response', async () => {
    const mockResponse = fixture_getSampleAxiosResponse(HttpStatusCode.Ok);
    jest.spyOn(http, 'requestWithRetries').mockResolvedValue(mockResponse);

    expect(
      request(MOCK_REQUEST_URL, { validateStatus })
    ).resolves.toStrictEqual(mockResponse.data);
    expect(http.requestWithRetries).toHaveBeenCalledTimes(1);
    expect(http.requestWithRetries).toHaveBeenCalledWith(
      MOCK_REQUEST_URL,
      {
        method: 'get',
        validateStatus
      },
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );
  });

  it('should return successful response for non-GET API calls', async () => {
    const mockResponse = fixture_getSampleAxiosResponse(HttpStatusCode.Created);
    jest.spyOn(http, 'requestWithRetries').mockResolvedValue(mockResponse);

    expect(
      request(MOCK_REQUEST_URL, { method: 'post', validateStatus })
    ).resolves.toStrictEqual(mockResponse.data);
    expect(http.requestWithRetries).toHaveBeenCalledTimes(1);
    expect(http.requestWithRetries).toHaveBeenCalledWith(
      MOCK_REQUEST_URL,
      {
        method: 'post',
        validateStatus
      },
      DEFAULT_RETRIES,
      DEFAULT_RETRY_DELAY_MS
    );
  });
});
