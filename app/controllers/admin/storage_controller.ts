import type { HttpContext } from '@adonisjs/core/http'
import { s3, S3_BUCKET } from '#services/s3'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '#start/env'

function normalizePrefix(prefix?: string) {
  if (!prefix) return ''
  let p = prefix.trim()
  if (p.startsWith('/')) p = p.slice(1)
  if (p === '/') return ''
  return p
}

export default class StorageController {
  // Render the UI
  public async show({ inertia }: HttpContext) {
    return inertia.render('admin/storage', { bucket: S3_BUCKET })
  }

  // List objects and prefixes under a given prefix
  public async list({ request }: HttpContext) {
    const prefix = normalizePrefix(request.input('prefix', ''))
    const cmd = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: prefix ? (prefix.endsWith('/') ? prefix : prefix + '/') : undefined,
      Delimiter: '/',
      MaxKeys: 1000,
    })
    const out = await s3.send(cmd)

    const folders = (out.CommonPrefixes || []).map((p) => ({
      prefix: p.Prefix!,
      name: p.Prefix!.slice(prefix.length).replace(/\/$/, ''),
    }))

    const files = (out.Contents || [])
      .filter((o) => o.Key && o.Key !== (prefix ? (prefix.endsWith('/') ? prefix : prefix + '/') : ''))
      .map((o) => ({
        key: o.Key!,
        name: o.Key!.slice(prefix.length),
        size: o.Size || 0,
        lastModified: o.LastModified?.toISOString() || null,
      }))

    // Breadcrumbs
    const parts = prefix ? prefix.replace(/\/$/, '').split('/') : []
    const breadcrumb = [{ name: 'root', prefix: '' }]
    let acc = ''
    for (const p of parts) {
      acc = acc ? acc + '/' + p : p
      breadcrumb.push({ name: p, prefix: acc })
    }

    return { prefix, folders, files, breadcrumb }
  }

  // Get a signed URL to view or download
  public async signedUrl({ request }: HttpContext) {
    const key = request.input('key') as string
    const disposition = request.input('disposition', 'inline') as 'inline' | 'attachment'
    if (!key) return { error: 'Missing key' }

    const cmd = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ResponseContentDisposition: `${disposition}; filename="${encodeURIComponent(key.split('/').pop() || 'file')}"`,
    })
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 })
    return { url }
  }

  // Resolve a signed URL from a full public URL (fallback for images that fail to load directly)
  public async signedUrlByUrl({ request }: HttpContext) {
    const fullUrl = String(request.input('url') || '')
    const disposition = (request.input('disposition', 'inline') as 'inline' | 'attachment') || 'inline'
    if (!fullUrl) return { error: 'Missing url' }

    const endpoint = String(env.get('S3_ENDPOINT') || '').replace(/\/$/, '')
    const bucket = String(S3_BUCKET)

    // Expect pattern: `${endpoint}/${bucket}/{key...}`
    let prefix = `${endpoint}/${bucket}/`
    if (!fullUrl.startsWith(prefix)) {
      // Try to handle encoded paths or missing schema
      const alt = fullUrl.replace(/\/$/, '')
      prefix = `${endpoint}/${bucket}/`
      if (!alt.startsWith(prefix)) {
        return { error: 'URL does not match configured storage endpoint' }
      }
    }

    const key = decodeURIComponent(fullUrl.slice(prefix.length))
    if (!key) return { error: 'Could not extract key from url' }

    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `${disposition}; filename="${encodeURIComponent(key.split('/').pop() || 'file')}"`,
    })
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 })
    return { url }
  }

  public async rename({ request }: HttpContext) {
    const fromKey = request.input('fromKey') as string
    const toKey = request.input('toKey') as string
    if (!fromKey || !toKey) return { error: 'Missing parameters' }

    // Copy then delete
    await s3.send(
      new CopyObjectCommand({ Bucket: S3_BUCKET, Key: toKey, CopySource: encodeURIComponent(`${S3_BUCKET}/${fromKey}`) })
    )
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: fromKey }))
    return { success: true }
  }

  public async remove({ request }: HttpContext) {
    const key = request.input('key') as string
    if (!key) return { error: 'Missing key' }
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    return { success: true }
  }
}
