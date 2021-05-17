import fetchMock from 'jest-fetch-mock'

import { HttpClient } from '@/http-client'
import { HttpError } from '@/http-error'
import { RequestExtension } from '@/request-extension'

import { expectIteratorLength } from './util/expect'

describe('HttpClient', (): void => {
    let client: HttpClient
    let fetchSpy: jest.SpyInstance

    beforeEach((): void => {
        client = new HttpClient()

        fetchMock.resetMocks()
        fetchSpy = jest.spyOn(window, 'fetch')
    })

    afterEach((): void => {
        fetchMock.mockRestore()
    })

    describe('headers management', (): void => {
        it('should allow setting and unsetting headers', () => {
            expectIteratorLength(client.headers.entries(), 0)

            client.headers.set('Accept', 'application/json')

            expectIteratorLength(client.headers.entries(), 1)
            expect(client.headers.has('Accept')).toBe(true)

            client.headers.delete('Accept')

            expectIteratorLength(client.headers.entries(), 0)
            expect(client.headers.has('Accept')).toBe(false)
        })
    })

    describe('request', (): void => {
        const validStatusCodes = [200, 201, 205, 299, 300, 301,]
        const invalidStatusCodes = [100, 105, 199, 400, 401, 500]

        it('should call fetch without body', () => {
            fetchMock.doMockOnce()

            client.request('', 'GET')

            expect(fetchSpy).toHaveBeenCalledTimes(1)
            expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
                headers: client.headers,
                method: 'GET'
            })
        })

        it('should call fetch with with object converted to json string', () => {
            fetchMock.doMockOnce()

            const request = {
                foo: 'bar',
                baz: 1337,
                bar: false
            }

            client.request('', 'POST', request)

            expect(fetchSpy).toHaveBeenCalledTimes(1)
            expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
                headers: client.headers,
                method: 'POST',
                body: JSON.stringify(request)
            })
        })

        it('should call fetch with form data', () => {
            fetchMock.doMockOnce()

            const formData = new FormData()
            formData.set('foo', 'bar')

            client.request('', 'POST', formData)

            expect(fetchSpy).toHaveBeenCalledTimes(1)
            expect(fetchSpy).toHaveBeenCalledWith(expect.anything(), {
                headers: client.headers,
                method: 'POST',
                body: formData
            })
        })

        test.each(validStatusCodes)('should not throw error if valid status code (%s)', (code: number) => {
            fetchMock.mockResponse('', {
                status: code
            })

            expect(() => {
                client.request('', 'GET')
            }).not.toThrow()

            expect(fetchSpy).toHaveBeenCalledTimes(1)
        })

        test.each(invalidStatusCodes)('should throw error if not valid status code (%s)', async (code: number) => {
            fetchMock.mockResponse('', {
                status: code
            })

            await expect(client.request('', 'GET'))
                .rejects
                .toThrow(HttpError)

            expect(fetchSpy).toHaveBeenCalledTimes(1)
        })

        it('should throw HttpError when fetch failed', async () => {
            fetchMock.mockReject(new Error('fake error message'))

            await expect(client.request('', 'GET'))
                .rejects
                .toThrow(HttpError)

            expect(fetchSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('makeRequestInit', (): void => {
        it('should create request init from required parameters', (): void => {
            client.headers.set('Accept', 'application/json')

            const requestInit = client.makeRequestInit('GET')

            expect(requestInit).toStrictEqual({
                headers: client.headers,
                method: 'GET'
            })
        })

        it('should create request init with body as json string', (): void => {
            const body = {
                foo: 'bar',
                baz: 1337,
                bar: false
            }

            const requestInit = client.makeRequestInit('POST', body)

            expect(requestInit).toStrictEqual({
                headers: client.headers,
                method: 'POST',
                body: JSON.stringify(body)
            })
        })

        it('should add additional request params', (): void => {
            const body = {
                foo: 'bar',
                baz: 1337,
                bar: false
            }

            const params: RequestExtension = {
                credentials: 'omit',
                redirect: 'follow'
            }

            const requestInit = client.makeRequestInit('PATCH', body, params)

            expect(requestInit).toStrictEqual({
                headers: client.headers,
                method: 'PATCH',
                body: JSON.stringify(body),
                ...params
            })
        })

        it('should create request init with form data', (): void => {
            const formData = new FormData()
            formData.set('foo', 'bar')

            const requestInit = client.makeRequestInit('PATCH', formData)

            expect(requestInit).toStrictEqual({
                headers: client.headers,
                method: 'PATCH',
                body: formData
            })
        })
    })
})
