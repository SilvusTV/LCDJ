import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /** Inertia page */
  public async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')
    const safeUsers = users.map((u) => ({
      id: u.id,
      fullName: (u as any).fullName ?? null,
      email: u.email,
      role: (u as any).role,
      scopes: Array.isArray((u as any).scopes) ? (u as any).scopes : [],
      createdAt: (u as any).createdAt,
    }))
    return inertia.render('admin/users', { users: safeUsers })
  }

  /** API list */
  public async list() {
    const users = await User.query().orderBy('created_at', 'desc')
    return users.map((u) => ({
      id: u.id,
      fullName: (u as any).fullName ?? null,
      email: u.email,
      role: (u as any).role,
      scopes: Array.isArray((u as any).scopes) ? (u as any).scopes : [],
      createdAt: (u as any).createdAt,
    }))
  }

  /** API update */
  public async update({ params, request, response, auth }: HttpContext) {
    const id = Number(params.id)
    const payload = request.only(['role', 'scopes']) as { role?: string; scopes?: string[] | null }

    if (!id) return response.badRequest({ error: 'ID invalide' })

    const me = auth.user!
    if (me.id === id && payload.role === 'user') {
      // Optional: avoid locking yourself out accidentally
      // Allow if scopes still include admin
      const newScopes = Array.isArray(payload.scopes) ? payload.scopes : (me.scopes || [])
      const willStillBeAdmin = newScopes.includes('admin')
      if (!willStillBeAdmin) return response.badRequest({ error: 'Vous ne pouvez pas retirer vos propres droits admin.' })
    }

    const user = await User.findOrFail(id)

    if (payload.role && !['user', 'admin'].includes(payload.role)) {
      return response.badRequest({ error: 'Rôle invalide' })
    }

    if (payload.role) user.role = payload.role
    if (payload.scopes !== undefined) user.scopes = payload.scopes as any

    await user.save()
    return { success: true }
  }
}
