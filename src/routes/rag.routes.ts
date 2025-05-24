import { RouteGroup } from '@models/routes'
import generateAnswerWithRAG from '@controllers/api/rag/generateAnswerWithRAG'

const ragRoutes: RouteGroup = {
    basePath: '/rag',
    routes: [
        {
            method: 'post',
            path: '/generateAnswerWithRAG',
            handler: generateAnswerWithRAG,
        },
    ],
}

export default ragRoutes
