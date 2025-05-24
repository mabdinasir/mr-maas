import type { RouteGroup } from '@models/routes'
import { authMiddleware } from '@middleware/authMiddleware'
import signUp from '@controllers/api/auth/signup'
import login from '@controllers/api/auth/login'
import signOut from '@controllers/api/auth/signout'

const authRoutes: RouteGroup = {
    basePath: '/auth',
    routes: [
        {
            path: '/signup',
            method: 'post',
            handler: signUp,
        },
        {
            path: '/login',
            method: 'post',
            handler: login,
        },
        {
            path: '/signout',
            method: 'post',
            middlewares: [authMiddleware],
            handler: signOut,
        },
    ],
}

export default authRoutes
