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
     * @param request Additional params to the fetch request parameter
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

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }

        if (url.startsWith('/')) {
            url = url.substring(1)
        }

        return `${this.baseUrl}/${url}`
    }

    // endregion
}

export type {
    HttpMethod, RequestBody, RequestExtension
}

export {
    HttpClient
}
