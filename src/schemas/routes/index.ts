import { Router } from 'express'
import authRoutes from './auth.routes'
import type { RouteGroup } from '@models/routes'
import memoryEntryRoutes from './memoryEntry.routes'

const registerRouteGroups = (router: Router, groups: RouteGroup[]) => {
    groups.forEach((group) => {
        group.routes.forEach((route) => {
            const fullPath = `/api${group.basePath}${route.path}`
            router[route.method](fullPath, ...(route.middlewares || []), route.handler)
        })
    })
}

const configureRoutes = (router: Router) => {
    const routeGroups = [authRoutes, memoryEntryRoutes]
    registerRouteGroups(router, routeGroups)
}

export default configureRoutes
