import { HttpError } from '@/http-error'

describe('HttpError', (): void => {
    let error: HttpError

    const factory = (): HttpError => new HttpError()

    beforeEach((): void => {
        error = factory()
    })

    it('extends Error', (): void => {
        expect(error).toBeInstanceOf(Error)
    })

    it('has correct name', (): void => {
        expect(error.name).toBe('HttpError')
    })

    describe('isHttpError', (): void => {
        it('should return true when HttpError', (): void => {
            expect(HttpError.isHttpError(error)).toBe(true)
        })

        it('should return false when not HttpError', (): void => {
            const error = new Error()

            expect(HttpError.isHttpError(error)).toBe(false)
        })
    })

    describe('fromError', (): void => {
        it('should set parent and should not set response', (): void => {
            const error = new Error()
            const httpError = HttpError.fromError(error)

            expect(httpError.parent).toBe(error)
            expect(httpError.response).toBeUndefined()
        })
    })

    describe('fromResponse', (): void => {
        it('fromResponse should set response and should not set parent', (): void => {
            const response = new Response()
            const httpError = HttpError.fromResponse(response)

            expect(httpError.parent).toBeUndefined()
            expect(httpError.response).toBe(response)
        })
    })
})
