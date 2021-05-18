import { HttpError } from '@/http-error'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
type RequestBody = unknown | FormData
type RequestExtension = Partial<Omit<RequestInit, 'headers' | 'method' | 'body'>>

class HttpClient {
    headers = new Headers()

    /**
     * Make request to the specified URL.
     *
     * @param url Request url
     * @param method HTTP method. GET, POST, PATCH, PUT, DELETE supported
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    request (url: string, method: HttpMethod, body?: RequestBody, request?: RequestExtension): Promise<Response> {
        return fetch(url, this.makeRequestInit(method, body, request))
            .then(response => {
                if (response.status >= 200 && response.status < 400) {
                    return response
                }

                throw HttpError.fromResponse(response)
            })
            .catch(err => {
                if (HttpError.isHttpError(err)) {
                    throw err
                }

                throw HttpError.fromError(err)
            })
    }

    /**
     * Create request init object for the fetch request
     *
     * @param method HTTP method
     * @param body Request body
     * @param request Additional request parameters
     */
    makeRequestInit (method: HttpMethod, body?: RequestBody, request?: RequestExtension): RequestInit {
        const requestInit: RequestInit = {
            headers: this.headers,
            method: method,
            ...request
        }

        if (body !== undefined) {
            if (body instanceof FormData) {
                requestInit.body = body
            } else {
                requestInit.body = JSON.stringify(body)
            }
        }

        return requestInit
    }
}

export type {
    HttpMethod, RequestBody, RequestExtension
}

export {
    HttpClient
}
