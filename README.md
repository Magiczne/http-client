# http-client
[![npm][badge]][0]

Very simple, no dependency [`window.fetch`][1] wrapper.

## Installation

```
npm install @magiczne/http-client
```

```
yarn add @magiczne/http-client
```

## Basic usage

```typescript
import { HttpClient } from '@magiczne/http-client'

const client = new HttpClient()

const body = { foo: 'bar' }
const request = { mode: 'cors' }

client.get('https://example.com', 'POST', body, request)
```

## Setting request headers

`HttpClient` exposes headers object to set headers used by your requests. It is a 
[`Headers`][2] class. Look at documentation for possible options.

Those headers acts as default headers, so if you set them once, you don't have to set
them again when using the same instance of `HttpClient`.

```typescript
const client = new HttpClient()

client.headers.set('Accept', 'application/json')
// From this moment all requests will include "Accept: application/json" header

client.headers.delete('Accept')
// From this moment Accept header will no longer be included
```

## Authorization

`HttpClient` exposes two methods to simplify authorization using HTTP headers.

```typescript
const client = new HttpClient()

client.authorize('Bearer', 'bearer-token')
// From this moment all requests will include "Authorization: Bearer bearer-token" header

client.unauthorize()
// From this moment Authorization header will no longer be included
```

## Utility methods

`HttpClient` exposes utility methods for making `GET`, `POST`, `PATCH`, `PUT` and `DELETE` requests.

```typescript
const client = new HttpClient()

client.get(url, request)
client.post(url, body, request)
client.patch(url, body, request)
client.put(url, body, request)
client.delete(url, request)
```

## JSON utility methods

`HttpClient` exposes json method to support making JSON requests.
Methods below temporarily store current `Accept` and `Content-Type` headers and replace them
with `Accept: application/json` and `Content-Type: application/json` or `Content-Type: multipart/form-data`
when [`FormData`][3] was passed as a request body.

After using json method, these headers will be returned to state before calling json utility method.

```typescript
const client = new HttpClient()

client.headers.set('Accept', 'application/xhtml+xml')
// From this moment all requests will have Accept: application/xhtml+xml header set

// This request will be made with headers:
// - Accept: application/json
// - Content-Type: application/json
client.json(url, 'POST', { foo: 'bar' })

// This request will be made with headers:
// - Accept: application/json
// - Content-Type: multipart/form-data
client.json(url, 'POST', new FormData())

// This request will be made with headers:
// - Accept: application/xhtml+xml
client.post(url, body)
```

Additionally, like for `request` method, `HttpClient` exposes utility method for each supported HTTP method

```typescript
client.getJson(url, request)
client.postJson(url, body, request)
client.patchJson(url, body, request)
client.putJson(url, body, request)
client.deleteJson(url, request)
```

## TypeScript reference

For detailed information about all exposed methods read [REFERENCE.md](REFERENCE.md).

[badge]: https://img.shields.io/badge/dynamic/json?color=blue&label=npm&query=version&style=flat-square&url=https%3A%2F%2Fraw.githubusercontent.com%2FMagiczne%2Fhttp-client%2Fmaster%2Fpackage.json
[0]: https://www.npmjs.com/package/@magiczne/http-client
[1]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Headers
[3]: https://developer.mozilla.org/en-US/docs/Web/API/FormData
