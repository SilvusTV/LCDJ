import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async showLogin({ response }: HttpContext) {
    // Plus de mot de passe : on redirige directement vers Google
    return response.redirect('/auth/google/redirect')
  }

  public async showRegister({ response }: HttpContext) {
    // L'inscription passe par Google désormais
    return response.redirect('/auth/google/redirect')
  }

  // Plus de login par mot de passe
  public async login({ response }: HttpContext) {
    return response.redirect('/auth/google/redirect')
  }

  public async register({ response }: HttpContext) {
    return response.redirect('/auth/google/redirect')
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.json({ success: true, redirectTo: '/' })
  }

  public async googleRedirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  public async googleCallback({ ally, auth, response }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.redirect('/?auth=denied')
    }
    if (google.stateMisMatch()) {
      return response.redirect('/?auth=state_mismatch')
    }
    if (google.hasError()) {
      return response.redirect('/?auth=error')
    }

    const googleUser = await google.user()
    const email = googleUser.email!

    // Find existing user by provider id or email
    let user = await User.query()
      .where('provider', 'google')
      .where('provider_id', googleUser.id)
      .first()

    if (!user) {
      user = await User.findBy('email', email)
    }

    if (user) {
      user.fullName = user.fullName || googleUser.name || null
      user.provider = 'google'
      // @ts-ignore columns added by migration
      ;(user as any).providerId = googleUser.id
      // @ts-ignore
      ;(user as any).avatarUrl = googleUser.avatarUrl || null
      await user.save()
    } else {
      user = await User.create({
        fullName: googleUser.name || null,
        email,
        // Pas de mot de passe
        // @ts-ignore
        password: null,
        role: 'user',
        scopes: null,
        // @ts-ignore additional fields
        provider: 'google',
        // @ts-ignore
        providerId: googleUser.id,
        // @ts-ignore
        avatarUrl: googleUser.avatarUrl || null,
      } as any)
    }

    await auth.use('web').login(user!)
    return response.redirect('/admin')
  }
}
