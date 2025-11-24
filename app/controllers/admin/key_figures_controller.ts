import type { HttpContext } from '@adonisjs/core/http'
import KeyFigure from '#models/key_figure'

export default class KeyFiguresController {
  public async index({ inertia }: HttpContext) {
    const items = await KeyFigure.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
    return inertia.render('admin/keyfigures', { keyFigures: items })
  }

  public async list() {
    return await KeyFigure.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
  }

  public async create({ request, response }: HttpContext) {
    const data = request.only(['title', 'value', 'unit'])
    const title = String(data.title || '').trim()
    const value = Number(data.value)
    const unit = (data.unit === undefined || data.unit === null) ? null : String(data.unit).trim() || null
    if (!title || Number.isNaN(value)) {
      return response.status(400).send({ error: 'Les champs titre et chiffre sont requis.' })
    }

    // Determine next sort order
    const last = await KeyFigure.query().orderBy('sort_order', 'desc').first()
    const nextOrder = last ? (last.sortOrder ?? 0) + 1 : 0

    const item = await KeyFigure.create({ title, value, unit, sortOrder: nextOrder })
    return { success: true, id: item.id }
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.only(['title', 'value', 'unit'])
    const title = String(data.title || '').trim()
    const valueRaw = data.value
    if (!title || valueRaw === undefined) {
      return response.status(400).send({ error: 'Les champs titre et chiffre sont requis.' })
    }
    const value = Number(valueRaw)
    if (Number.isNaN(value)) {
      return response.status(400).send({ error: 'Le champ chiffre doit être un nombre.' })
    }
    const item = await KeyFigure.findOrFail(params.id)
    item.title = title
    item.value = value
    item.unit = (data.unit === undefined || data.unit === null) ? null : String(data.unit).trim() || null
    await item.save()
    return { success: true }
  }

  public async reorder({ request, response }: HttpContext) {
    const ids = request.input('ids') as number[]
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'number')) {
      return response.status(400).send({ error: "Format invalide. Attendu: { ids: number[] }" })
    }

    // Update sort_order according to the array order
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      await KeyFigure.query().where('id', id).update({ sort_order: i })
    }

    return { success: true }
  }

  public async destroy({ params }: HttpContext) {
    const item = await KeyFigure.findOrFail(params.id)
    await item.delete()
    return { success: true }
  }
}
