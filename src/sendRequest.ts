import axios from 'axios';

import { TypeRequestParams } from './types/TypeRequestParams';
import { downloadBlobAsFile } from './utils/downloadBlobAsFile';

export function sendRequest({
  url,
  mock,
  headers,
  requestParams,
  downloadFileNameGetter,
}: TypeRequestParams) {
  if (mock) return Promise.resolve(mock);

  return axios({
    url: typeof url === 'function' ? url(requestParams) : url,
    data: requestParams.formData || requestParams,
    method: 'POST',
    headers,
    responseType: requestParams.downloadAsFile ? 'blob' : undefined,
    withCredentials: true,
  }).then((response) => {
    if (requestParams.downloadAsFile) {
      downloadBlobAsFile(response.data as Blob, downloadFileNameGetter?.(response) || 'result');
    }

    return response.data;
  });
}
