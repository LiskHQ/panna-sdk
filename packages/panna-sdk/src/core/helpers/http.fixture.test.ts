import { AxiosResponse, AxiosHeaders } from 'axios';

export const fixture_getSampleAxiosResponse = (
  statusCode: number
): AxiosResponse => {
  return {
    data: {},
    status: statusCode,
    statusText: 'HTTP_STATUS',
    headers: {},
    config: {
      headers: new AxiosHeaders({})
    },
    request: {}
  };
};
