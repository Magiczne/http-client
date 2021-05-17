class HttpError extends Error implements Error {
    name = 'HttpError'

    public parent?: Error
    public response?: Response

    /**
     * Check if error is a HttpError
     *
     * @param error
     */
    public static isHttpError (error: Error): error is HttpError {
        return error.name === HttpError.name
    }

    /**
     * Create HttpError from another error
     *
     * @param error
     */
    public static fromError (error: Error): HttpError {
        const httpError = new HttpError()
        httpError.parent = error

        return httpError
    }

    /**
     * Create HttpError from http response
     *
     * @param response
     */
    public static fromResponse (response: Response): HttpError {
        const httpError = new HttpError()
        httpError.response = response

        return httpError
    }
}

export {
    HttpError
}
