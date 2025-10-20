import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'

export default class SettingsController {
  public async show({ inertia }: HttpContext) {
    const s = await Setting.first()
    return inertia.render('admin/settings', { settings: s })
  }

  public async get({}: HttpContext) {
    const s = await Setting.first()
    return s
  }

  public async update({ request }: HttpContext) {
    const payload = request.only(['socials', 'homeLinks', 'contact'])
    let s = await Setting.first()
    if (!s) s = new Setting()
    s.socials = payload.socials || []
    s.homeLinks = payload.homeLinks || []
    s.contact = payload.contact || null
    await s.save()
    return { success: true }
  }
}
