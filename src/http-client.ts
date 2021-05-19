import { HttpError } from '@/http-error'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
type RequestBody = unknown | FormData
type RequestExtension = Partial<Omit<RequestInit, 'headers' | 'method' | 'body'>>

class HttpClient {
    private _baseUrl = ''
    public headers = new Headers()

    /**
     * Make request to the specified URL.
     *
     * @param url Request url
     * @param method HTTP method. GET, POST, PATCH, PUT, DELETE supported
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    public request (url: string, method: HttpMethod, body?: RequestBody, request?: RequestExtension): Promise<Response> {
        return fetch(this.urlTo(url), this.makeRequestInit(method, body, request))
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
     * Make request to the specified URL and convert response to JSON.
     *
     * @param url Request url
     * @param method HTTP method. GET, POST, PATCH, PUT, DELETE supported
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    public json<T> (url: string, method: HttpMethod, body?: RequestBody, request?: RequestExtension): Promise<T> {
        this.headers.set('Accept', 'application/json')
        this.headers.set('Content-Type', 'application/json')

        const response = this.request(url, method, body, request)

        this.headers.delete('Accept')
        this.headers.delete('Content-Type')

        return response.then(response => response.json() as Promise<T>)
    }

    /**
     * Create request init object for the fetch request
     *
     * @param method HTTP method
     * @param body Request body
     * @param request Additional request parameters
     */
    public makeRequestInit (method: HttpMethod, body?: RequestBody, request?: RequestExtension): RequestInit {
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

    // region Authorization

    /**
     * Set authorization header
     *
     * @param type Authorization type
     * @param credentials Authorization credentials
     */
    authorize (type: string, credentials: string): void {
        this.headers.set('Authorization', `${type} ${credentials}`)
    }

    /**
     * Remove authorization header
     */
    unauthorize (): void {
        this.headers.delete('Authorization')
    }

    // endregion

    // region Base Url

    /**
     * Get base url
     */
    public get baseUrl (): string {
        return this._baseUrl
    }

    /**
     * Set base url, removing trailing slash, as it
     * will be added in the urlTo method.
     *
     * @param url
     */
    public set baseUrl (url: string) {
        this._baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
    }

    /**
     * Get prefixed url if baseUrl is present
     * or return passed argument if it is not.
     *
     * @param url
     */
    public urlTo (url: string): string {
        if (this.baseUrl === '') {
            return url
        }

        // noinspection HttpUrlsUsage
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }

        if (url.startsWith('/')) {
            url = url.substring(1)
        }

        return `${this.baseUrl}/${url}`
    }

    // endregion

    // region Request utility methods

    /**
     * Make GET request to the specified URL.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameters
     */
    get (url: string, request?: RequestExtension): Promise<Response> {
        return this.request(url, 'GET', undefined, request)
    }

    /**
     * Make POST request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    post (url: string, body?: RequestBody, request?: RequestExtension): Promise<Response> {
        return this.request(url, 'POST', body, request)
    }

    /**
     * Make PATCH request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    patch (url: string, body?: RequestBody, request?: RequestExtension): Promise<Response> {
        return this.request(url, 'PATCH', body, request)
    }

    /**
     * Make PUT request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    put (url: string, body?: RequestBody, request?: RequestExtension): Promise<Response> {
        return this.request(url, 'PUT', body, request)
    }

    /**
     * Make DELETE request to the specified URL.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameters
     */
    delete (url: string, request?: RequestExtension): Promise<Response> {
        return this.request(url, 'DELETE', undefined, request)
    }

    // endregion
}

export type {
    HttpMethod, RequestBody, RequestExtension
}

export {
    HttpClient
}
