import { createRouter, type MiddlewareContext } from 'remix/router'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import { render } from './middleware/render.tsx'
import { loadDatabase } from './middleware/db.ts'
import { routes } from './routes.ts'

type AppContext = MiddlewareContext<[
  ReturnType<typeof render>,
  ReturnType<typeof loadDatabase>,
]>

declare module 'remix/router' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    staticFiles('./public', { index: false }),
    render(),
    loadDatabase(),
  ],
})

router.map(routes, controller)

