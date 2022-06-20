import AsyncLock from 'async-lock'
const lock = new AsyncLock()

class UnknownContext extends Error {}

export class Context {
    id: string

    constructor(id: string) {
        this.id = id
    }

    getLock(maxPending: number) {
        return <T>(fn: () => T | Promise<T>) => lock.acquire<T>(this.id, fn, { maxPending })
    }
}

export class TokenContexts {
    contexts: Map<string, Context>

    constructor(contextIds: string[]) {
        this.contexts = new Map(contextIds.map(id => [id, new Context(id)]))
    }

    get(key: string) {
        const context = this.contexts.get(key)
        if (!context) {
            throw new UnknownContext(`No context with id ${key}`)
        }

        return context
    }

    getTokenContextIds() {
        return Array.from(this.contexts.keys())
    }
}
