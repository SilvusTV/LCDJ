import type { HttpContext } from '@adonisjs/core/http'
import Partner from '#models/partner'
import { s3, S3_BUCKET, s3PublicUrl } from '#services/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_.-]+/g, '_')
    .replace(/_+/g, '_')
}

export default class PartnersController {
  public async index({ inertia }: HttpContext) {
    const partners = await Partner.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
    return inertia.render('admin/partners', { partners })
  }

  public async list() {
    return await Partner.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
  }

  public async create({ request }: HttpContext) {
    const { name, url, logoUrl } = request.only(['name', 'url', 'logoUrl'])
    const sortOrder = Number(request.input('sortOrder') || 0)
    const p = await Partner.create({ name, url: url || null, logoUrl: logoUrl || null, sortOrder })
    return { success: true, id: p.id }
  }

  public async destroy({ params }: HttpContext) {
    const p = await Partner.findOrFail(params.id)
    await p.delete()
    return { success: true }
  }

  // Pre-signed PUT upload for Partner logo
  public async uploadUrl({ request }: HttpContext) {
    const fileName = String(request.input('fileName') || '')
    const contentType = String(request.input('contentType') || 'application/octet-stream')
    if (!fileName) return { error: 'fileName is required' }
    const safe = sanitizeFileName(fileName)
    const key = `Partners/${Date.now()}_${safe}`

    const cmd = new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, ContentType: contentType })
    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 })
    const publicUrl = s3PublicUrl(key)
    return { key, uploadUrl, publicUrl }
  }

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

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: (file?.type && file?.subtype) ? `${file.type}/${file.subtype}` : 'application/octet-stream',
      })
    )

    const publicUrl = s3PublicUrl(key)
    return { success: true, key, publicUrl }
  }
}
