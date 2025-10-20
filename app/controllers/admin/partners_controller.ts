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
}
