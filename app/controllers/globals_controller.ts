// import type { HttpContext } from '@adonisjs/core/http'
import * as db from '../../database/files/db.json' assert { type: 'json' }

export default class GlobalsController {
  public static getNews() {
    return db.default.news
  }

  public static getSocialNetworks() {
    return db.default.socials
  }

  public static getLinks() {
    return db.default.links
  }

  public static getContacts() {
    return db.default.contact
  }
}
