type RequestExtension = Partial<Omit<RequestInit, 'headers' | 'method' | 'body'>>

export {
    RequestExtension
}
