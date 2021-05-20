const expectIteratorLength = <T>(iterator: IterableIterator<T>, length: number): void => {
    expect([
        ...iterator
    ]).toHaveLength(length)
}

export {
    expectIteratorLength
}
