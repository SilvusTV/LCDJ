import type { HttpContext } from '@adonisjs/core/http'

export default class AdminScopeMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    await ctx.auth.authenticate()
    const user = ctx.auth.user as any
    const role = user?.role
    const scopes: string[] = Array.isArray(user?.scopes) ? user.scopes : []

    if (role === 'admin' || scopes.includes('admin')) {
      await next()
      return
    }

    // Pretty unauthorized page for HTML/Inertia requests
    const wantsJson = ctx.request.header('accept')?.includes('application/json') || ctx.request.ajax()
    const isInertia = !!ctx.request.header('x-inertia')

    if (!wantsJson || isInertia) {
      return ctx.inertia.render('errors/unauthorized', {}, { status: 403 })
    }

    return ctx.response.status(403).json({ error: 'Accès refusé' })
  }
}
