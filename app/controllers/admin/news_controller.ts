import type { HttpContext } from '@adonisjs/core/http'
import News from '#models/news'
import { s3, S3_BUCKET, s3PublicUrl } from '#services/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_.-]+/g, '_')
    .replace(/_+/g, '_')
}

export default class NewsController {
  public async index({ inertia }: HttpContext) {
    const items = await News.query().orderBy('created_at', 'desc')
    return inertia.render('admin/news', { news: items })
  }

  public async list() {
    return await News.query().orderBy('created_at', 'desc')
  }

  public async create({ request, response }: HttpContext) {
    const data = request.only(['title', 'link', 'imageName'])
    const title = String(data.title || '').trim()
    const link = String(data.link || '').trim()
    const imageName = String(data.imageName || '').trim()
    if (!title || !link || !imageName) {
      return response.status(400).send({ error: 'Les champs titre, lien et image sont requis.' })
    }
    const n = await News.create({ title, link, imageName })
    return { success: true, id: n.id }
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.only(['title', 'link', 'imageName'])
    const title = String(data.title || '').trim()
    const link = String(data.link || '').trim()
    const imageNameRaw = data.imageName
    if (!title || !link) {
      return response.status(400).send({ error: 'Les champs titre et lien sont requis.' })
    }
    const n = await News.findOrFail(params.id)
    n.title = title
    n.link = link
    if (imageNameRaw !== undefined) {
      const imageName = String(imageNameRaw || '').trim()
      n.imageName = imageName || null
    }
    await n.save()
    return { success: true }
  }

  // (removed) pre-signed URL flow disabled — route supprimée

  public async destroy({ params }: HttpContext) {
    const n = await News.findOrFail(params.id)
    await n.delete()
    return { success: true }
  }

  // Server-side upload fallback: Accepts multipart form-data with fields: title, link, image
  public async upload({ request, response }: HttpContext) {
    const title = String(request.input('title') || '').trim()
    const link = String(request.input('link') || '').trim()
    const file = request.file('image') as any

    if (!title || !link || !file) {
      return response.status(400).send({ error: 'Les champs titre, lien et image sont requis.' })
    }

    const originalName: string = (file?.clientName as string) || 'image'
    const safe = sanitizeFileName(originalName)
    const key = `News/${Date.now()}_${safe}`

    // Read file buffer from tmp path
    let buffer: Buffer | null = null
    try {
      const fs = await import('fs/promises')
      if (file?.tmpPath) {
        buffer = await fs.readFile(file.tmpPath as string)
      } else if (typeof (file as any).toBuffer === 'function') {
        buffer = await (file as any).toBuffer()
      }
    } catch (e) {
      return { error: "Impossible de lire le fichier uploadé" }
    }

    if (!buffer) {
      return { error: "Fichier invalide" }
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
    const n = await News.create({ title, link, imageName: publicUrl })
    return { success: true, id: n.id, imageUrl: publicUrl }
  }

  // Server-side helper to upload only the image (for edit/create flows that need the URL first)
  // Accepts multipart form-data with field: image
  // Returns: { success, key, imageUrl }
  public async uploadImage({ request, response }: HttpContext) {
    const file = request.file('image') as any
    if (!file) {
      return response.status(400).send({ error: 'Le fichier image est requis (champ "image").' })
    }

    const originalName: string = (file?.clientName as string) || 'image'
    const safe = sanitizeFileName(originalName)
    const key = `News/${Date.now()}_${safe}`

    // Read buffer
    let buffer: Buffer | null = null
    try {
      const fs = await import('fs/promises')
      if (file?.tmpPath) {
        buffer = await fs.readFile(file.tmpPath as string)
      } else if (typeof (file as any).toBuffer === 'function') {
        buffer = await (file as any).toBuffer()
      }
    } catch (e) {
      return { error: "Impossible de lire le fichier uploadé" }
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

    const imageUrl = s3PublicUrl(key)
    return { success: true, key, imageUrl }
  }
}
