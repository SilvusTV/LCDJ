import env from '#start/env'
import { S3Client } from '@aws-sdk/client-s3'

// Public endpoint used to build URLs visible from the browser
const publicEndpoint = env.get('S3_ENDPOINT') as string
// Internal endpoint used by the backend SDK to talk directly to MinIO (no /files proxy)
const internalEndpoint = (env.get('S3_INTERNAL_ENDPOINT') as string) || publicEndpoint
const region = (env.get('S3_REGION', 'us-east-1') as string) || 'us-east-1'
const forcePathStyle = env.get('S3_FORCE_PATH_STYLE') === 'true'

export const S3_BUCKET = env.get('S3_BUCKET') as string

const accessKeyId = env.get('S3_ACCESS_KEY') as string
const secretAccessKey = env.get('S3_SECRET_KEY') as string

export const s3 = new S3Client({
  region,
  endpoint: internalEndpoint,
  forcePathStyle,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export function s3PublicUrl(key: string) {
  const base = (publicEndpoint as string).replace(/\/$/, '')
  const parts = key.split('/').map(encodeURIComponent).join('/')
  return `${base}/${S3_BUCKET}/${parts}`
}
