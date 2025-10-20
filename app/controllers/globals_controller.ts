import Setting from '#models/setting'
import News from '#models/news'
import Partner from '#models/partner'
import KeyFigure from '#models/key_figure'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const filedbPath = resolve(__dirname, '../../database/files/db.json')
const filedb: any = JSON.parse(readFileSync(filedbPath, 'utf-8'))

export default class GlobalsController {
  private static async ensureSeeded() {
    const settingsCount = await Setting.query().count('* as total')
    const totalSettings = Number(settingsCount[0].$extras.total || 0)
    if (totalSettings === 0) {
      // Normalize socials to expected 4 entries if available
      const socials = Array.isArray(filedb.socials) ? filedb.socials : []
      await Setting.create({
        socials,
        homeLinks: filedb.links || [],
        contact: filedb.contact || null,
      })
    }

    const newsCount = await News.query().count('* as total')
    const totalNews = Number(newsCount[0].$extras.total || 0)
    if (totalNews === 0) {
      const newsArr = filedb.news || []
      for (const n of newsArr) {
        await News.create({ title: n.title, imageName: n.imageName || null, link: n.link })
      }
    }
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
    // Fallback to file
    return (filedb as any).contact
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
