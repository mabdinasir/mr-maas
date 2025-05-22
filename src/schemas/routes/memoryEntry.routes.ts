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
    ],
}

export default memoryEntryRoutes
