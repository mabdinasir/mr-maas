# Mr MaaS SDK

A lightweight JavaScript SDK to interact with your MR Memory-as-a-Service API.

## Usage

```ts
import { createMemoryClient } from 'memory-sdk'

const client = new createMemoryClient({ baseUrl: 'http://localhost:8080' })

await client.storeMemory({ content: 'Hello world', userId: 'abc123' })
const result = await client.recallMemory({ query: 'Hello', userId: 'abc123' })
const summary = await client.summarizeMemory({ userId: 'abc123' })
```
