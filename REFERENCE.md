# TypeScript Reference

### Utility types
```typescript
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestBody = unknown | FormData;

type RequestExtension = Partial<Omit<RequestInit, 'headers' | 'method' | 'body'>>;
```

### HttpError
```typescript
class HttpError extends Error implements Error {
    name: string;
    parent?: Error;
    response?: Response;
    
    /**
     * Check if error is a HttpError
     *
     * @param error
     */
    static isHttpError(error: Error): error is HttpError;
    
    /**
     * Create HttpError from another error
     *
     * @param error
     */
    static fromError(error: Error): HttpError;
    
    /**
     * Create HttpError from http response
     *
     * @param response
     */
    static fromResponse(response: Response): HttpError;
}
```

### HttpClient
```typescript
class HttpClient {
    headers: Headers;
    
    /**
     * Make request to the specified URL.
     *
     * @param url Request url
     * @param method HTTP method. GET, POST, PATCH, PUT, DELETE supported
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    request(url: string, method: HttpMethod, body?: RequestBody, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make json request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param method HTTP method. GET, POST, PATCH, PUT, DELETE supported
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    json<T>(url: string, method: HttpMethod, body?: RequestBody, request?: RequestExtension): Promise<T>;
    
    /**
     * Create request init object for the fetch request
     *
     * @param method HTTP method
     * @param body Request body
     * @param request Additional request parameters
     */
    makeRequestInit(method: HttpMethod, body?: RequestBody, request?: RequestExtension): RequestInit;
    
    /**
     * Set authorization header
     *
     * @param type Authorization type
     * @param credentials Authorization credentials
     */
    authorize(type: string, credentials: string): void;
    
    /**
     * Remove authorization header
     */
    unauthorize(): void;
    
    /**
     * Get base url
     */
    get baseUrl(): string;
    
    /**
     * Set base url, removing trailing slash, as it
     * will be added in the urlTo method.
     *
     * @param url
     */
    set baseUrl(url: string);
    
    /**
     * Get prefixed url if baseUrl is present
     * or return passed argument if it is not.
     *
     * @param url
     */
    urlTo(url: string): string;
    
    /**
     * Make GET request to the specified URL.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameters
     */
    get(url: string, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make POST request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    post(url: string, body?: RequestBody, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make PATCH request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    patch(url: string, body?: RequestBody, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make PUT request to the specified URL.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameters
     */
    put(url: string, body?: RequestBody, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make DELETE request to the specified URL.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameters
     */
    delete(url: string, request?: RequestExtension): Promise<Response>;
    
    /**
     * Make json GET request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameter
     */
    getJson<T>(url: string, request?: RequestExtension): Promise<T>;
    
    /**
     * Make json PUT request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    postJson<T>(url: string, body?: RequestBody, request?: RequestExtension): Promise<T>;
    
    /**
     * Make json PUT request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    patchJson<T>(url: string, body?: RequestBody, request?: RequestExtension): Promise<T>;
    
    /**
     * Make json PUT request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param body Optional request body
     * @param request Additional params to the fetch request parameter
     */
    putJson<T>(url: string, body?: RequestBody, request?: RequestExtension): Promise<T>;
    
    /**
     * Make json DELETE request to the specified URL and convert response to json.
     *
     * @param url Request url
     * @param request Additional params to the fetch request parameter
     */
    deleteJson<T>(url: string, request?: RequestExtension): Promise<T>;
}
```
