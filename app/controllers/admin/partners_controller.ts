import type { HttpContext } from '@adonisjs/core/http'
import Partner from '#models/partner'
import { s3, S3_BUCKET, s3PublicUrl } from '#services/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_.-]+/g, '_')
    .replace(/_+/g, '_')
}

export default class PartnersController {
  public async index({ inertia, request }: HttpContext) {
    const key = request.input('key') as string | undefined
    const q = Partner.query()
    if (key !== undefined) {
      if (key === '' || key === 'null') q.whereNull('group_key')
      else q.where('group_key', key)
    }
    const partners = await q.orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
    return inertia.render('admin/partners', { partners })
  }

  public async list({ request }: HttpContext) {
    const key = request.input('key') as string | undefined
    const q = Partner.query()
    if (key !== undefined) {
      if (key === '' || key === 'null') q.whereNull('group_key')
      else q.where('group_key', key)
    }
    return await q.orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
  }

  public async create({ request }: HttpContext) {
    const { name, url, logoUrl, key } = request.only(['name', 'url', 'logoUrl', 'key'])
    // Determine next sort order within the same group key
    const q = Partner.query()
    if (key === undefined || key === null || key === '') q.whereNull('group_key')
    else q.where('group_key', key)
    const last = await q.orderBy('sort_order', 'desc').first()
    const nextOrder = last ? (last.sortOrder ?? 0) + 1 : 0

    const p = await Partner.create({
      name,
      url: url || null,
      logoUrl: logoUrl || null,
      sortOrder: nextOrder,
      key: key || null,
    } as any)
    return { success: true, id: p.id }
  }

  public async destroy({ params }: HttpContext) {
    const p = await Partner.findOrFail(params.id)
    await p.delete()
    return { success: true }
  }

  // (removed) pre-signed URL flow disabled — route supprimée

  // Server-side upload for Partner logo (to avoid browser-signed URLs)
  // Accepts multipart form-data with field: logo (file)
  // Returns the public URL so the frontend can then call create/update with logoUrl
  public async upload({ request, response }: HttpContext) {
    const file = request.file('logo') as any
    if (!file) {
      return response.status(400).send({ error: 'Le fichier logo est requis (champ "logo").' })
    }

    const originalName: string = (file?.clientName as string) || 'logo'
    const safe = sanitizeFileName(originalName)
    const key = `Partners/${Date.now()}_${safe}`

    // Read file buffer from tmp path or in-memory
    let buffer: Buffer | null = null
    try {
      const fs = await import('fs/promises')
      if (file?.tmpPath) {
        buffer = await fs.readFile(file.tmpPath as string)
      } else if (typeof (file as any).toBuffer === 'function') {
        buffer = await (file as any).toBuffer()
      }
    } catch (e) {
      return { error: 'Impossible de lire le fichier uploadé' }
    }

    if (!buffer) {
      return { error: 'Fichier invalide' }
    }

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: (file?.type && file?.subtype) ? `${file.type}/${file.subtype}` : 'application/octet-stream',
        })
      )
    } catch (e) {
      return response.status(502).send({ error: "Échec de l'upload S3 (Partner). Vérifiez la configuration MinIO." })
    }

    const publicUrl = s3PublicUrl(key)
    return { success: true, key, publicUrl }
  }

  public async reorder({ request, response }: HttpContext) {
    const ids = request.input('ids') as number[]
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'number')) {
      return response.status(400).send({ error: "Format invalide. Attendu: { ids: number[] }" })
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      await Partner.query().where('id', id).update({ sort_order: i })
    }

    return { success: true }
  }
}
