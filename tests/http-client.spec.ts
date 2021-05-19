import fetchMock from 'jest-fetch-mock'

import { HttpClient, RequestExtension } from '@/http-client'
import { HttpError } from '@/http-error'

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

    describe('request utility methods', (): void => {
        it('get should call request with correct parameters', (): void => {
            const requestSpy = jest.spyOn(client, 'request')

            client.get('https://example.com', {
                mode: 'cors'
            })

            expect(requestSpy).toBeCalledTimes(1)
            expect(requestSpy).toBeCalledWith('https://example.com', 'GET', undefined, {
                mode: 'cors'
            })
        })

        it('post should call request with correct parameters', (): void => {
            const requestSpy = jest.spyOn(client, 'request')

            client.post('https://example.com', {}, {
                mode: 'cors'
            })

            expect(requestSpy).toBeCalledTimes(1)
            expect(requestSpy).toBeCalledWith('https://example.com', 'POST', {}, {
                mode: 'cors'
            })
        })

        it('patch should call request with correct parameters', (): void => {
            const requestSpy = jest.spyOn(client, 'request')

            client.patch('https://example.com', {}, {
                mode: 'cors'
            })

            expect(requestSpy).toBeCalledTimes(1)
            expect(requestSpy).toBeCalledWith('https://example.com', 'PATCH', {}, {
                mode: 'cors'
            })
        })

        it('put should call request with correct parameters', (): void => {
            const requestSpy = jest.spyOn(client, 'request')

            client.put('https://example.com', {}, {
                mode: 'cors'
            })

            expect(requestSpy).toBeCalledTimes(1)
            expect(requestSpy).toBeCalledWith('https://example.com', 'PUT', {}, {
                mode: 'cors'
            })
        })

        it('delete should call request with correct parameters', (): void => {
            const requestSpy = jest.spyOn(client, 'request')

            client.delete('https://example.com', {
                mode: 'cors'
            })

            expect(requestSpy).toBeCalledTimes(1)
            expect(requestSpy).toBeCalledWith('https://example.com', 'DELETE', undefined, {
                mode: 'cors'
            })
        })
    })

    describe('json utility methods', (): void => {
        it('json should set headers, call request and remove headers', (): void => {
            const headersSetSpy = jest.spyOn(client.headers, 'set')
            const headersDeleteSpy = jest.spyOn(client.headers, 'delete')
            const requestSpy = jest.spyOn(client, 'request')

            fetchMock.doMockOnce('[]')

            client.json('https://example.com', 'POST', {}, {
                mode: 'cors'
            })

            expect(headersSetSpy).toHaveBeenCalledTimes(2)
            expect(headersSetSpy).toHaveBeenNthCalledWith(1, 'Accept', 'application/json')
            expect(headersSetSpy).toHaveBeenNthCalledWith(2, 'Content-Type', 'application/json')

            expect(requestSpy).toHaveBeenCalledTimes(1)
            expect(requestSpy).toHaveBeenCalledWith('https://example.com', 'POST', {}, {
                mode: 'cors'
            })

            expect(headersDeleteSpy).toHaveBeenCalledTimes(2)
            expect(headersDeleteSpy).toHaveBeenNthCalledWith(1, 'Accept')
            expect(headersDeleteSpy).toHaveBeenNthCalledWith(2, 'Content-Type')
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

    describe('authorization', (): void => {
        it('should set and unset authorization header', () => {
            expectIteratorLength(client.headers.entries(), 0)

            client.authorize('Type', 'token')

            expectIteratorLength(client.headers.entries(), 1)
            expect(client.headers.has('Authorization')).toBe(true)
            expect(client.headers.get('Authorization')).toBe('Type token')

            client.unauthorize()

            expectIteratorLength(client.headers.entries(), 0)
        })
    })

    describe('baseUrl', (): void => {
        it('should get and set baseUrl', (): void => {
            expect(client.baseUrl).toBe('')

            client.baseUrl = 'https://example.com'
            expect(client.baseUrl).toBe('https://example.com')
        })

        it('should remove trailing slash from base url', (): void => {
            expect(client.baseUrl).toBe('')

            client.baseUrl = 'https://example.com/'
            expect(client.baseUrl).toBe('https://example.com')
        })
    })

    describe('urlTo', (): void => {
        it('should return argument if base url is not present', (): void => {
            const url = client.urlTo('test')

            expect(url).toBe('test')
        })

        it('should not remove trailing slash when base url is not present', (): void => {
            const url = client.urlTo('/test')

            expect(url).toBe('/test')
        })

        it('should return url prefixed with base path', (): void => {
            client.baseUrl = 'https://example.com'
            const url = client.urlTo('test')

            expect(url).toBe('https://example.com/test')
        })

        it('should remove leading slash and return correct url when base path is present', (): void => {
            client.baseUrl = 'https://example.com'
            const url = client.urlTo('/test')

            expect(url).toBe('https://example.com/test')
        })

        // noinspection HttpUrlsUsage
        const protocols = ['http://', 'https://']
        test.each(protocols)('should return url when starts with protocol (%s)', (protocol: string): void => {
            client.baseUrl = 'https://example.com'
            const url = client.urlTo(`${protocol}example2.com/test`)

            expect(url).toBe(`${protocol}example2.com/test`)
        })
    })
})
