## Request utility with validations based on Axios & ts-interface-checker

[![coverage](https://img.shields.io/codecov/c/gh/dkazakov8/dk-request/master)](https://codecov.io/gh/dkazakov8/dk-request)
[![npm](https://img.shields.io/npm/v/dk-request)](https://www.npmjs.com/package/dk-request)
[![license](https://img.shields.io/npm/l/dk-request)](https://github.com/dkazakov8/dk-request/blob/master/LICENSE)

> This lib is maintained for my needs, open-source for your inspiration

### Features

- validates request and response by `ts-interface-checker`. Checkers could be created using
[dk-file-generator](https://github.com/dkazakov8/dk-file-generator)
- omits extraneous params from response using [dk-checker-remove-extraneous](https://github.com/dkazakov8/dk-checker-remove-extraneous)
- currently supports only `POST` xhr requests
- supports mocks
- supports file downloads if response type is `blob` with customizable file name
- supports FormData requests
- supports `url` as function
- supports custom headers
- works in Node.js

In future may be developed:
- other than `POST` requests
- handle and validate only some parts of response
- use some `requestParams` in `url` only, filter them in actual request data

### Installation

Add `dk-request` to package.json and install.

### Usage

```typescript
import { AxiosError } from 'axios';
import { request, errors } from 'dk-request';

type TypeRequest = {
  id: string;
}

type TypeResponse = {
  data: string;
}

// possibly auto-generated
const validators = t.createCheckers({
  TypeRequest: t.iface([], { id: 'string' }),
  TypeResponse: t.iface([], { data: 'string' }),
});

request({
  url: 'https://google.com/api/get-items',
  // url: (requestParams) => `https://google.com/api/get-items/${requestParams.id}`,
  apiName: 'getItems',
  requestParams: { id: 'id' } as TypeRequest,
  validatorRequest: validators.TypeRequest,
  validatorResponse: validators.TypeResponse,
}).then((response: TypeResponse) => {
  // response is validated and cleared, put it in store or use as you need
  
  successHandler(response);
}).catch((error: Error | AxiosError) => {
  // if it's validation error then
  // error.name === errors.VALIDATION
  // error.message smth. like 
  // 'validateRequest: request.id is missing for "getItems"'
  // 'validateResponse: response.data is not a string for "getItems"'
  
  errorHandler(error);
});
```

### Params

`url` - `string | ((request: any) => string)` - full url

`apiName` - `string` - just for logging

`requestParams` - `Record<string, any> & { formData?: any; downloadAsFile?: boolean }`

If you need to send FormData include it in `formData`. Other params will not be sent, but
could still be used in `url` function.

If you need to download file passed as `blob` by backend use `downloadAsFile: true`, this
way response validation will be omitted.

`mock` (optional) - `TypeResponse`, there will be no actual request to API, but validations are
applied

`headers` (optional) - `Record<string, any>`

`extraneousLogger` (optional) - logger for [dk-checker-remove-extraneous](https://github.com/dkazakov8/dk-checker-remove-extraneous)

`validatorRequest` (optional) - `Checker`

`validatorResponse` (optional) - `Checker`

`downloadFileNameGetter` (optional) - `(response: AxiosResponse) => string` - a method for
defining custom downloaded file name, ex.

```typescript
downloadFileNameGetter: (axiosResponse) => {
  return (
    axiosResponse.headers['content-disposition']?.split('filename=')?.[1]?.replaceAll('"', '') ||
    'result.csv'
  );
}
```

> For access to response headers like `content-disposition` don't forget `expose-headers` header
> in server response
