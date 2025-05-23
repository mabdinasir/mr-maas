import recallMemory from '@controllers/api/memory/recallMemory'
import storeMemory from '@controllers/api/memory/storeMemory'
import { RouteGroup } from '@models/routes'

const memoryEntryRoutes: RouteGroup = {
    basePath: '/memoryEntry',
    routes: [
        {
            method: 'post',
            path: '/storeMemory',
            handler: storeMemory,
        },
        {
            method: 'post',
            path: '/recallMemory',
            handler: recallMemory,
        },
    ],
}

export default memoryEntryRoutes
