import Setting from '#models/setting'
import News from '#models/news'
import Partner from '#models/partner'
import KeyFigure from '#models/key_figure'

export default class GlobalsController {
  private static async ensureSeeded() {
    const settingsCount = await Setting.query().count('* as total')
    const totalSettings = Number(settingsCount[0].$extras.total || 0)
    if (totalSettings === 0) {
      // Seed minimal defaults in DB (no filesystem dependency)
      await Setting.create({
        socials: [],
        homeLinks: [],
        contact: null,
      })
    }

    // We no longer auto-seed News from a JSON file. Keep as-is if empty.
  }

  public static async getNews() {
    await GlobalsController.ensureSeeded()
    const items = await News.query().orderBy('created_at', 'desc').limit(3)
    return items.map((n) => ({ id: n.id, title: n.title, imageName: n.imageName, link: n.link }))
  }

  public static async getSocialNetworks() {
    await GlobalsController.ensureSeeded()
    const s = await Setting.firstOrFail()
    return s.socials
  }

  public static async getLinks() {
    await GlobalsController.ensureSeeded()
    const s = await Setting.firstOrFail()
    return s.homeLinks
  }

  public static async getContacts() {
    await GlobalsController.ensureSeeded()
    const s = await Setting.first()
    if (s && s.contact) return s.contact
    // No file fallback anymore
    return null
  }

  public static async getPartners() {
    const partners = await Partner.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
    return partners.map((p) => ({ id: p.id, name: p.name, url: (p as any).url || null, logoUrl: (p as any).logoUrl || null }))
  }

  public static async getKeyFigures() {
    const items = await KeyFigure.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
    return items.map((k) => ({ id: k.id, title: k.title, value: k.value }))
  }
}
