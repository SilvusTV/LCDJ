import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  public async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  public async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.json({ success: true, redirectTo: '/admin' })
    } catch {
      return response.status(401).json({ success: false, error: 'Identifiants invalides' })
    }
  }

  public async register({ request, auth, response }: HttpContext) {
    const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

    try {
      const user = await User.create({ fullName: fullName || null, email, password, role: 'user', scopes: null })
      await auth.use('web').login(user)
      return response.json({ success: true, redirectTo: '/' })
    } catch (error) {
      // Likely duplicate email or validation error
      return response.status(400).json({ success: false, error: 'Impossible de créer le compte. Email déjà utilisé ?' })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.json({ success: true, redirectTo: '/' })
  }
}
