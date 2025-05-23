export class MemoryClient {
    private config: { baseUrl: string; token?: string }

    constructor(config: { baseUrl: string; token?: string }) {
        this.config = config
    }

    async storeMemory(data: { content: string; userId: string }) {
        const res = await fetch(`${this.config.baseUrl}/api/memoryEntry/storeMemory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}),
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error(`storeMemory failed: ${res.statusText}`)
        }
        return res.json()
    }

    async recallMemory(data: { query: string; userId: string }) {
        const res = await fetch(`${this.config.baseUrl}/api/memoryEntry/recallMemory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error(`recallMemory failed: ${res.statusText}`)
        }
        return res.json()
    }

    async summarizeMemory(data: { userId: string }) {
        const res = await fetch(`${this.config.baseUrl}/api/memoryEntry/summarizeMemory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error(`summarizeMemory failed: ${res.statusText}`)
        }
        return res.json()
    }
}
